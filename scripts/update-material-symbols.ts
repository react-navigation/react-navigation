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

// The ligatures point to the unfilled glyphs, and `rclt` swaps in the filled glyphs
// So we copy the outlines of the filled glyphs to the glyphs used by the ligatures
// The tables are edited directly, as `fonteditor-core` drops the ligatures on write
function copyFilledOutlines(buffer: Buffer, names: string[]): Buffer {
  const tables = new Map<string, Buffer>();

  for (let i = 0; i < buffer.readUInt16BE(4); i++) {
    const record = 12 + i * 16;
    const offset = buffer.readUInt32BE(record + 8);
    const length = buffer.readUInt32BE(record + 12);

    tables.set(
      buffer.toString('latin1', record, record + 4),
      buffer.subarray(offset, offset + length)
    );
  }

  const getTable = (tag: string) => {
    const table = tables.get(tag);

    if (table == null) {
      throw new Error(`Could not find the "${tag}" table in the font`);
    }

    return table;
  };

  const head = Buffer.from(getTable('head'));
  const maxp = getTable('maxp');
  const hhea = getTable('hhea');
  const loca = getTable('loca');
  const glyf = getTable('glyf');
  const hmtx = getTable('hmtx');

  const glyphCount = maxp.readUInt16BE(4);
  const metricsCount = hhea.readUInt16BE(34);
  const longLoca = head.readInt16BE(50) === 1;

  const getGlyphOffset = (glyph: number) =>
    longLoca ? loca.readUInt32BE(glyph * 4) : loca.readUInt16BE(glyph * 2) * 2;

  const getSideBearingOffset = (glyph: number) =>
    glyph < metricsCount
      ? glyph * 4 + 2
      : metricsCount * 4 + (glyph - metricsCount) * 2;

  const hbFont = new hb.Font(new hb.Face(new hb.Blob(buffer)));
  const hbBuffer = new hb.Buffer();

  const shapeName = (name: string, features: hb.Feature[]) => {
    hbBuffer.reset();
    hbBuffer.addText(name);
    hbBuffer.guessSegmentProperties();

    hb.shape(hbFont, hbBuffer, features);

    const [info, ...rest] = hbBuffer.getGlyphInfos();

    if (info == null || rest.length) {
      throw new Error(`Could not find a ligature for "${name}"`);
    }

    return info.codepoint;
  };

  const sources = Array.from({ length: glyphCount }, (_, glyph) => glyph);

  for (const name of names) {
    sources[shapeName(name, [new hb.Feature('rclt', 0)])] = shapeName(name, []);
  }

  const glyphs: Buffer[] = [];
  const newLoca = Buffer.alloc((glyphCount + 1) * 4);
  const newHmtx = Buffer.from(hmtx);

  let position = 0;

  sources.forEach((source, glyph) => {
    const data = glyf.subarray(
      getGlyphOffset(source),
      getGlyphOffset(source + 1)
    );

    newLoca.writeUInt32BE(position, glyph * 4);
    glyphs.push(data);
    position += data.length;

    // All the icons have the same advance width
    // So only the left side bearing needs to be copied
    newHmtx.writeInt16BE(
      hmtx.readInt16BE(getSideBearingOffset(source)),
      getSideBearingOffset(glyph)
    );
  });

  newLoca.writeUInt32BE(position, glyphCount * 4);

  // Use the long format for `loca` since the offsets are written as 32-bit
  head.writeInt16BE(1, 50);

  tables.set('head', head);
  tables.set('loca', newLoca);
  tables.set('glyf', Buffer.concat(glyphs));
  tables.set('hmtx', newHmtx);

  // The checksums and search fields are left empty
  // As subsetting the font again recalculates them
  const entries = [...tables];
  const header = Buffer.alloc(12 + entries.length * 16);
  const data: Buffer[] = [header];

  let offset = header.length;

  header.writeUInt32BE(buffer.readUInt32BE(0), 0);
  header.writeUInt16BE(entries.length, 4);

  entries.forEach(([tag, table], i) => {
    const record = 12 + i * 16;
    const padded = Buffer.alloc(Math.ceil(table.length / 4) * 4);

    table.copy(padded);

    header.write(tag, record, 'latin1');
    header.writeUInt32BE(offset, record + 8);
    header.writeUInt32BE(table.length, record + 12);

    data.push(padded);
    offset += padded.length;
  });

  return Buffer.concat(data);
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

const names = [...mappings.keys()].sort((a, b) => a.localeCompare(b));
const ligatureChars = names.join('');

for (const variant of VARIANTS) {
  const variableName = `MaterialSymbols${variant}[FILL,GRAD,opsz,wght].ttf`;
  const variableBuffer = await download(
    `${baseUrl}${encodeURIComponent(variableName)}`,
    variableName
  );

  for (const weight of WEIGHTS) {
    for (const fill of [0, 1]) {
      const fileName = `MaterialSymbols${variant}_${weight}${fill ? '_Filled' : ''}`;
      const ttfName = `${fileName}.ttf`;
      const variationAxes = { FILL: fill, GRAD: 0, opsz: 24, wght: weight };

      process.stdout.write(`Generating ${ttfName}...`);

      // The variable fonts are too large to ship, so we generate static fonts
      // Subsetting also drops the glyph names and the ligatures for icon names
      // As the native code draws the icons by codepoint instead of name
      let ttfBuffer = await subsetFont(variableBuffer, chars, {
        variationAxes,
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

      const woff2Name = `${fileName}.woff2`;

      process.stdout.write(`Generating ${woff2Name}...`);

      // Web draws the icons by name, so the woff2 fonts keep the ligatures
      // Subsetting with the letters of the names drops the codepoints instead
      let woff2Buffer = await subsetFont(variableBuffer, ligatureChars, {
        variationAxes,
      });

      if (fill) {
        woff2Buffer = copyFilledOutlines(woff2Buffer, names);
      }

      // The ligatures for the icon names are in the `rlig` feature
      // Dropping `rclt` also drops the filled glyphs that are no longer used
      woff2Buffer = await subsetFont(woff2Buffer, ligatureChars, {
        // @ts-expect-error `keepFeatures` is supported, but missing in `@types/subset-font`
        keepFeatures: ['rlig'],
        targetFormat: 'woff2',
      });

      fs.writeFileSync(new URL(woff2Name, assets), woff2Buffer);

      process.stdout.write(' done.\n');
    }
  }
}

process.stdout.write('\n');

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
