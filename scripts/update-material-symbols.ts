import * as fs from 'node:fs';
import process from 'node:process';
import { URL } from 'node:url';

import { Font } from 'fonteditor-core';
import * as hb from 'harfbuzzjs';
import subsetFont from 'subset-font';

const root = new URL('..', import.meta.url);
const assets = new URL('packages/material-symbols/assets/fonts/', root);

const VARIANTS = ['Outlined', 'Rounded', 'Sharp'];
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700];

type IconsMetadata = {
  icons: { name: string; unsupported_families: string[] }[];
};

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

// The codepoints also include legacy names from Material Icons, such as `_filled` names
// So we only keep the icons that are listed on fonts.google.com for Material Symbols
const metadataBuffer = await download(
  'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true',
  'icons metadata'
);

const metadataText = metadataBuffer.toString('utf-8');

// The response starts with `)]}'` before the JSON to prevent JSON hijacking
const metadata: IconsMetadata = JSON.parse(
  metadataText.slice(metadataText.indexOf('{'))
);

const listedNames = new Set(
  metadata.icons
    .filter((icon) =>
      VARIANTS.some(
        (variant) =>
          !icon.unsupported_families.includes(`Material Symbols ${variant}`)
      )
    )
    .map((icon) => icon.name)
);

for (const line of codepoints.split('\n')) {
  const [name, codepoint] = line.trim().split(' ');

  if (name && codepoint && listedNames.has(name)) {
    mappings.set(name, parseInt(codepoint, 16));
  }
}

const uniqueCodepoints = [...new Set(mappings.values())];
const chars = String.fromCodePoint(...uniqueCodepoints);

for (const variant of VARIANTS) {
  const variableName = `MaterialSymbols${variant}[FILL,GRAD,opsz,wght].ttf`;
  const variableBuffer = await download(
    `${baseUrl}${encodeURIComponent(variableName)}`,
    variableName
  );

  for (const weight of WEIGHTS) {
    for (const fill of [0, 1]) {
      const ttfName = `MaterialSymbols${variant}_${weight}${fill ? '_Filled' : ''}.ttf`;

      process.stdout.write(`Generating ${ttfName}...`);

      // The variable fonts are too large to ship, so we generate static fonts
      // Subsetting also drops the glyph names and the ligatures for icon names
      // As the native code draws the icons by codepoint instead of name
      let ttfBuffer = await subsetFont(variableBuffer, chars, {
        variationAxes: { FILL: fill, GRAD: 0, opsz: 24, wght: weight },
      });

      if (fill) {
        // The filled glyphs are swapped in with the `rclt` feature
        // Pointing the codepoints to them lets the unused glyphs be dropped
        const hbFont = new hb.Font(new hb.Face(new hb.Blob(ttfBuffer)));
        const hbBuffer = new hb.Buffer();

        const font = Font.create(ttfBuffer, { type: 'ttf', hinting: true });
        const glyphs = font.get().glyf;

        for (const glyph of glyphs) {
          glyph.unicode = [];
        }

        for (const codepoint of uniqueCodepoints) {
          hbBuffer.reset();
          hbBuffer.addCodePoints([codepoint]);
          hbBuffer.guessSegmentProperties();

          hb.shape(hbFont, hbBuffer);

          for (const info of hbBuffer.getGlyphInfos()) {
            glyphs[info.codepoint]?.unicode.push(codepoint);
          }
        }

        ttfBuffer = await subsetFont(
          font.write({ type: 'ttf', hinting: true, toBuffer: true }),
          chars
        );
      }

      fs.writeFileSync(new URL(ttfName, assets), ttfBuffer);

      process.stdout.write(' done.\n');
    }
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
