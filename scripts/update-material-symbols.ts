import * as fs from 'node:fs';
import process from 'node:process';
import { URL } from 'node:url';

import { Font } from 'fonteditor-core';
import subsetFont from 'subset-font';

const root = new URL('..', import.meta.url);
const assets = new URL('packages/native/assets/fonts/', root);

const VARIANTS = ['Outlined', 'Rounded', 'Sharp'];
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700];

// The filled glyphs need codepoints that Material Symbols doesn't use
// Its codepoints go up to U+FFFFD, so the filled glyphs start at U+100000
// It's the start of the next private use block (U+100000 to U+10FFFD)
const FILLED_CODEPOINT_START = 0x100000;

process.stdout.write('Updating Material Symbols...\n\n');

fs.mkdirSync(assets, { recursive: true });

const mappings = new Map<string, number>();

async function download(url: string, name: string): Promise<Buffer> {
  process.stdout.write(`Downloading ${name}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  process.stdout.write(' done.\n');

  return buffer;
}

// Download the codepoints and the fonts from the same commit
// So that the codepoints always match the glyphs in the fonts
const shaResponse = await fetch(
  'https://api.github.com/repos/google/material-design-icons/commits/master',
  { headers: { Accept: 'application/vnd.github.sha' } }
);

if (!shaResponse.ok) {
  throw new Error(
    `Failed to fetch the latest commit: ${shaResponse.statusText}`
  );
}

const sha = await shaResponse.text();

const baseUrl = `https://github.com/google/material-design-icons/raw/${sha}/variablefont/`;

// The codepoints are the same for all variants
// So we only need to download them for one variant
const codepointsUrl = `${baseUrl}${encodeURIComponent('MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints')}`;
const codepointsName = 'MaterialSymbols.codepoints';

const codepointsBuffer = await download(codepointsUrl, codepointsName);
const codepoints = codepointsBuffer.toString('utf-8');

for (const line of codepoints.split('\n')) {
  const [name, codepoint] = line.trim().split(' ');

  if (name && codepoint) {
    mappings.set(name, parseInt(codepoint, 16));
  }
}

// The `_filled` names use the same codepoints as their base icons
// Google Fonts draws them filled by setting the `FILL` axis instead
// We add the filled glyphs to the fonts under unused codepoints,
// and point the `_filled` names to those codepoints
const filledCodepoints = new Map<number, number>();

for (const [name, codepoint] of mappings) {
  if (name.endsWith('_filled')) {
    const filledCodepoint =
      filledCodepoints.get(codepoint) ??
      FILLED_CODEPOINT_START + filledCodepoints.size;

    filledCodepoints.set(codepoint, filledCodepoint);
    mappings.set(name, filledCodepoint);
  }
}

const chars = String.fromCodePoint(...new Set(mappings.values()));
const filledChars = String.fromCodePoint(...filledCodepoints.keys());

for (const variant of VARIANTS) {
  const variableName = `MaterialSymbols${variant}[FILL,GRAD,opsz,wght].ttf`;
  const variableBuffer = await download(
    `${baseUrl}${encodeURIComponent(variableName)}`,
    variableName
  );

  for (const weight of WEIGHTS) {
    const ttfName = `MaterialSymbols${variant}_${weight}.ttf`;

    process.stdout.write(`Generating ${ttfName}...`);

    // The variable fonts are too large to ship
    // So we generate static fonts for each weight from them
    // With the same axis values that Google Fonts uses for its static fonts
    // This also drops the glyph names and the ligatures for the icon names
    // As the native code draws the icons by codepoint instead of name
    const ttfBuffer = await subsetFont(variableBuffer, chars, {
      variationAxes: { FILL: 0, GRAD: 0, opsz: 24, wght: weight },
    });

    const filledTtfBuffer = await subsetFont(variableBuffer, filledChars, {
      variationAxes: { FILL: 1, GRAD: 0, opsz: 24, wght: weight },
    });

    const font = Font.create(ttfBuffer, { type: 'ttf', hinting: true });

    // Copied glyphs can't reference components in the source font
    // So convert composite glyphs to simple glyphs before copying them
    const filledFont = Font.create(filledTtfBuffer, {
      type: 'ttf',
      compound2simple: true,
    });

    const filledGlyphs = filledFont
      .find({ unicode: [...filledCodepoints.keys()] })
      .map((glyph) => ({
        ...glyph,
        unicode: glyph.unicode.flatMap(
          (codepoint) => filledCodepoints.get(codepoint) ?? []
        ),
      }));

    font.getHelper().appendGlyf(filledGlyphs);

    // fonteditor-core writes a wrong `usLastCharIndex` in the `OS/2` table
    // As it doesn't handle codepoints above U+FFFF used for filled glyphs
    // So we pass the font through subset-font again to recalculate it
    const subsetBuffer = await subsetFont(
      font.write({ type: 'ttf', hinting: true, toBuffer: true }),
      chars
    );

    fs.writeFileSync(new URL(ttfName, assets), subsetBuffer);

    process.stdout.write(' done.\n');
  }
}

process.stdout.write('\n');

const names = [...mappings.keys()].sort((a, b) => a.localeCompare(b));

fs.writeFileSync(
  new URL(codepointsName, assets),
  [...mappings]
    .map(([name, codepoint]) => `${name} ${codepoint.toString(16)}\n`)
    .join('')
);

fs.writeFileSync(
  new URL('packages/native/src/native/MaterialSymbolData.tsx', root),
  `// Auto-generated by scripts/update-material-symbols.ts
// Do not edit manually

export type MaterialSymbolName =
${names.map((name) => `  | '${name}'`).join('\n')};
`
);

process.stdout.write(`Generated mappings with ${mappings.size} icon names.\n`);

fs.writeFileSync(
  new URL('example/src/material-symbol-names.ts', root),
  `// Auto-generated by scripts/update-material-symbols.ts
// Do not edit manually

export const MATERIAL_SYMBOL_NAMES = [
${names.map((name) => `  '${name}',`).join('\n')}
] as const;
`
);

process.stdout.write('\nDone!\n');
