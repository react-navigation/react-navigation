import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

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

const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'material-design-icons-'));

process.on('exit', () => {
  fs.rmSync(repo, { recursive: true, force: true });
});

function git(args: string[], input?: string): Buffer {
  return execFileSync(
    'git',
    [
      // Git fetches missing trees with all of their nested trees in a partial clone
      // This downloads every tree in the repo when the root tree is missing
      // So we fetch the objects ourselves and fail if anything is missing
      '--no-lazy-fetch',
      // The font file names contain `[` and `]` which are glob characters
      '--literal-pathspecs',
      ...args,
    ],
    {
      cwd: repo,
      input,
      maxBuffer: Infinity,
      stdio: ['pipe', 'pipe', 'inherit'],
    }
  );
}

function writeUInt16s(...values: number[]): Buffer {
  const buffer = Buffer.alloc(values.length * 2);

  values.forEach((value, i) => {
    buffer.writeUInt16BE(value, i * 2);
  });

  return buffer;
}

function writeRecords(records: [string, Buffer][]): Buffer {
  const header = Buffer.alloc(2 + records.length * 6);

  header.writeUInt16BE(records.length, 0);

  let offset = header.length;

  records.forEach(([tag, table], i) => {
    const record = 2 + i * 6;

    header.write(tag, record, 'latin1');
    header.writeUInt16BE(offset, record + 4);

    offset += table.length;
  });

  return Buffer.concat([header, ...records.map(([, table]) => table)]);
}

// Only the ligatures in `rlig` are kept, and `ss01` is added with the new lookup
// The lookups for the other features are kept, but no feature uses them
// So subsetting the font again drops them along with the glyphs that they use
function writeGSUB(gsub: Buffer, lookup: Buffer): Buffer {
  const featureListOffset = gsub.readUInt16BE(6);
  const lookupListOffset = gsub.readUInt16BE(8);

  const readUInt16s = (offset: number) =>
    Array.from({ length: gsub.readUInt16BE(offset) }, (_, i) =>
      gsub.readUInt16BE(offset + 2 + i * 2)
    );

  const rlig = Array.from(
    { length: gsub.readUInt16BE(featureListOffset) },
    (_, i) => featureListOffset + 2 + i * 6
  ).find((record) => gsub.toString('latin1', record, record + 4) === 'rlig');

  if (rlig == null) {
    throw new Error('Could not find the "rlig" feature in "GSUB"');
  }

  const ligatureLookups = readUInt16s(
    featureListOffset + gsub.readUInt16BE(rlig + 4) + 2
  );

  // The offsets inside the lookups are relative and point forward
  // So the lookups can be moved as a single block without updating them
  const lookupsStart =
    lookupListOffset + 2 + gsub.readUInt16BE(lookupListOffset) * 2;

  const lookupOffsets = readUInt16s(lookupListOffset).map(
    (offset) => lookupListOffset + offset - lookupsStart
  );

  // The new lookup is listed last, as the lookups run in the order of the list
  // But it's written first, as the existing lookups can be too far for a 16-bit offset
  const lookupListHeader = 2 + (lookupOffsets.length + 1) * 2;
  const offsets = [
    ...lookupOffsets.map((offset) => lookupListHeader + lookup.length + offset),
    lookupListHeader,
  ];

  if (offsets.some((offset) => offset > 0xffff)) {
    throw new Error('The lookups in "GSUB" are too large to add a feature');
  }

  const lookupList = Buffer.concat([
    writeUInt16s(offsets.length, ...offsets),
    lookup,
    gsub.subarray(lookupsStart),
  ]);

  // A script with only a default language system, which uses both features
  const script = writeUInt16s(4, 0, 0, 0xffff, 2, 0, 1);

  const scriptList = writeRecords([
    ['DFLT', script],
    ['latn', script],
  ]);

  const featureList = writeRecords([
    ['rlig', writeUInt16s(0, ligatureLookups.length, ...ligatureLookups)],
    ['ss01', writeUInt16s(0, 1, lookupOffsets.length)],
  ]);

  return Buffer.concat([
    writeUInt16s(
      1,
      0,
      10,
      10 + scriptList.length,
      10 + scriptList.length + featureList.length
    ),
    scriptList,
    featureList,
    lookupList,
  ]);
}

// The ligatures point to the unfilled glyphs, and `rclt` swaps in the filled glyphs
// So we copy the outlines of the filled glyphs to the glyphs used by the ligatures
// The mirrored glyphs for RTL are composite glyphs that flip the original glyphs
// So they don't need a copy of the outlines, and they're swapped in with `ss01`
// The tables are edited directly, as `fonteditor-core` drops the ligatures on write
function editGlyphs(
  buffer: Buffer,
  filledNames: string[],
  mirroredNames: string[]
): Buffer {
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
  const maxp = Buffer.from(getTable('maxp'));
  const hhea = Buffer.from(getTable('hhea'));
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

  // The mirrored glyphs use the last advance width, as they are after `metricsCount`
  // It's the same for all icons, so it's also the offset to flip them in place
  const advance = hmtx.readUInt16BE((metricsCount - 1) * 4);

  const hbFont = new hb.Font(new hb.Face(new hb.Blob(buffer)));
  const hbBuffer = new hb.Buffer();

  const shapeName = (name: string, features: hb.Feature[]) => {
    hbBuffer.reset();
    hbBuffer.addText(name);
    hbBuffer.guessSegmentProperties();

    hb.shape(hbFont, hbBuffer, features);

    const [info, ...rest] = hbBuffer.getGlyphInfos();

    // Glyph 0 is `.notdef`, which is used for characters missing in the font
    if (info == null || info.codepoint === 0 || rest.length) {
      throw new Error(`Could not find a ligature for "${name}"`);
    }

    return info.codepoint;
  };

  const sources = Array.from({ length: glyphCount }, (_, glyph) => glyph);

  for (const name of filledNames) {
    sources[shapeName(name, [new hb.Feature('rclt', 0)])] = shapeName(name, []);
  }

  const mirrored = new Set(
    mirroredNames.map((name) => shapeName(name, [new hb.Feature('rclt', 0)]))
  );

  const glyphs: Buffer[] = [];
  const mirroredGlyphs: Buffer[] = [];
  const newLoca = Buffer.alloc((glyphCount + mirrored.size + 1) * 4);
  const newHmtx = Buffer.concat([hmtx, Buffer.alloc(mirrored.size * 2)]);

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

    if (!mirrored.has(glyph)) {
      return;
    }

    if (data.readInt16BE(0) < 0) {
      throw new Error(`Mirroring composite glyph ${glyph} is not supported`);
    }

    const mirroredGlyph = Buffer.alloc(22);

    mirroredGlyph.writeInt16BE(-1, 0);
    mirroredGlyph.writeInt16BE(advance - data.readInt16BE(6), 2);
    mirroredGlyph.writeInt16BE(data.readInt16BE(4), 4);
    mirroredGlyph.writeInt16BE(advance - data.readInt16BE(2), 6);
    mirroredGlyph.writeInt16BE(data.readInt16BE(8), 8);
    // ARG_1_AND_2_ARE_WORDS | ARGS_ARE_XY_VALUES | WE_HAVE_AN_X_AND_Y_SCALE
    // And UNSCALED_COMPONENT_OFFSET, as the spec doesn't define the default
    mirroredGlyph.writeUInt16BE(0x1043, 10);
    mirroredGlyph.writeUInt16BE(glyph, 12);
    mirroredGlyph.writeInt16BE(advance, 14);
    mirroredGlyph.writeInt16BE(0, 16);
    // The scales are in the F2Dot14 format, so -1 is -0x4000 and 1 is 0x4000
    mirroredGlyph.writeInt16BE(-0x4000, 18);
    mirroredGlyph.writeInt16BE(0x4000, 20);

    mirroredGlyphs.push(mirroredGlyph);
  });

  mirroredGlyphs.forEach((glyph, i) => {
    newLoca.writeUInt32BE(position, (glyphCount + i) * 4);
    glyphs.push(glyph);
    position += glyph.length;

    newHmtx.writeInt16BE(
      glyph.readInt16BE(2),
      getSideBearingOffset(glyphCount + i)
    );
  });

  newLoca.writeUInt32BE(position, glyphs.length * 4);

  // Use the long format for `loca` since the offsets are written as 32-bit
  head.writeInt16BE(1, 50);

  // Subsetting the font again doesn't extend the bounds for the mirrored glyphs
  // The side bearings match the bounds, as the advance width is the same
  const minX = Math.min(
    head.readInt16BE(36),
    ...mirroredGlyphs.map((glyph) => glyph.readInt16BE(2))
  );

  const maxX = Math.max(
    head.readInt16BE(40),
    ...mirroredGlyphs.map((glyph) => glyph.readInt16BE(6))
  );

  head.writeInt16BE(minX, 36);
  head.writeInt16BE(maxX, 40);
  hhea.writeInt16BE(Math.min(hhea.readInt16BE(12), minX), 12);
  hhea.writeInt16BE(Math.min(hhea.readInt16BE(14), advance - maxX), 14);
  hhea.writeInt16BE(Math.max(hhea.readInt16BE(16), maxX), 16);

  // Each composite glyph has a single simple glyph as the component
  // So the limits for simple glyphs are also the limits for composite glyphs
  maxp.writeUInt16BE(glyphs.length, 4);
  maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(10), maxp.readUInt16BE(6)), 10);
  maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(12), maxp.readUInt16BE(8)), 12);
  maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(28), 1), 28);
  maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(30), 1), 30);

  // Lookup type 1 is a single substitution, and format 2 lists each substitute
  // In the order of the glyphs in the coverage, which needs to be sorted
  const coverage = [...mirrored].sort((a, b) => a - b);
  const lookup = Buffer.concat([
    writeUInt16s(1, 0, 1, 8),
    writeUInt16s(
      2,
      6 + coverage.length * 2,
      coverage.length,
      ...coverage.map((_, i) => glyphCount + i)
    ),
    writeUInt16s(1, coverage.length, ...coverage),
  ]);

  tables.set('head', head);
  tables.set('hhea', hhea);
  tables.set('maxp', maxp);
  tables.set('loca', newLoca);
  tables.set('glyf', Buffer.concat(glyphs));
  tables.set('hmtx', newHmtx);
  tables.set('GSUB', writeGSUB(getTable('GSUB'), lookup));

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

function fetchObjects(oids: string[]) {
  // GitHub only supports the `tree:0` filter which skips all nested trees
  // So only the requested objects are downloaded in a single request
  git(
    [
      '-c',
      'fetch.negotiationAlgorithm=noop',
      'fetch',
      '--quiet',
      '--filter=tree:0',
      '--no-tags',
      '--no-write-fetch-head',
      '--stdin',
      'origin',
    ],
    oids.join('\n')
  );
}

function listTree(paths: string[]): Map<string, string> {
  const output = git(['ls-tree', 'HEAD', '--', ...paths]).toString('utf-8');
  const entries = new Map<string, string>();

  for (const line of output.trim().split('\n')) {
    const [info = '', file = ''] = line.split('\t');
    const [, , oid = ''] = info.split(' ');

    entries.set(file, oid);
  }

  // The paths that don't exist are skipped in the output without an error
  const missing = paths.filter((file) => !entries.has(file));

  if (missing.length) {
    throw new Error(`Couldn't find ${missing.join(', ')}.`);
  }

  return entries;
}

function readFiles(paths: string[]): Map<string, Buffer> {
  const depth = Math.max(...paths.map((file) => file.split('/').length));

  // Fetch the trees containing the files one level at a time
  // Each level needs the trees from the previous level to list them
  for (let level = 1; level < depth; level++) {
    const dirs = new Set(
      paths
        .map((file) => file.split('/'))
        .filter((parts) => parts.length > level)
        .map((parts) => parts.slice(0, level).join('/'))
    );

    fetchObjects([...listTree([...dirs]).values()]);
  }

  const entries = listTree(paths);
  const oids = [...entries.values()];

  fetchObjects(oids);

  const output = git(['cat-file', '--batch'], oids.join('\n'));
  const files = new Map<string, Buffer>();

  let offset = 0;

  for (const file of entries.keys()) {
    // Each file is in the format `<oid> <type> <size>\n<content>\n`
    const headerEnd = output.indexOf('\n', offset);
    const header = output.toString('utf-8', offset, headerEnd);
    const [, type, size] = header.split(' ');

    if (type !== 'blob') {
      throw new Error(`Failed to read ${file}: ${header}`);
    }

    const start = headerEnd + 1;
    const end = start + Number(size);

    files.set(file, output.subarray(start, end));

    offset = end + 1;
  }

  return files;
}

process.stdout.write('Cloning material-design-icons...');

// The repo is several GBs, so we clone only the latest commit without any files
// Then fetch only the files we need from the same commit
// So that the codepoints always match the glyphs in the fonts
git([
  'clone',
  '--quiet',
  '--depth=1',
  '--filter=tree:0',
  '--no-checkout',
  'https://github.com/google/material-design-icons.git',
  '.',
]);

fetchObjects([git(['log', '-1', '--format=%T']).toString('utf-8').trim()]);

process.stdout.write(' done.\n');

process.stdout.write('Downloading icons metadata...');

// The codepoints also include legacy names from Material Icons, such as `_filled` names
// So we only keep the icons that are listed on fonts.google.com for Material Symbols
const metadataResponse = await fetch(
  'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true'
);

if (!metadataResponse.ok) {
  throw new Error(
    `Failed to download icons metadata: ${metadataResponse.statusText}`
  );
}

const metadataText = await metadataResponse.text();

process.stdout.write(' done.\n');

process.stdout.write('Reading variable fonts...');

// The codepoints are the same for all variants
// So we only need to read them for one variant
const codepointsFile =
  'variablefont/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints';

const variableFontPaths = new Map(
  VARIANTS.map((variant) => [
    variant,
    `variablefont/MaterialSymbols${variant}[FILL,GRAD,opsz,wght].ttf`,
  ])
);

const variableFonts = readFiles([
  codepointsFile,
  ...variableFontPaths.values(),
]);

process.stdout.write(' done.\n');

const codepoints = variableFonts.get(codepointsFile)?.toString('utf-8');

if (codepoints == null) {
  throw new Error(`Couldn't find ${codepointsFile}.`);
}

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

const mappings = new Map<string, number>();

for (const line of codepoints.split('\n')) {
  const [name, codepoint] = line.trim().split(' ');

  if (name && codepoint && listedNames.has(name)) {
    mappings.set(name, parseInt(codepoint, 16));
  }
}

process.stdout.write('Reading Android drawables...');

// The fonts don't have any info about which symbols need to be mirrored in RTL
// The Android drawables have `android:autoMirrored="true"` for these symbols
// The attribute is the same for all variants, so we only read one variant
const drawables = readFiles(
  [...mappings.keys()].map(
    (name) => `symbols/android/${name}/materialsymbolsoutlined/${name}_24px.xml`
  )
);

const autoMirroredNames = [...drawables]
  .filter(([, content]) => content.includes('android:autoMirrored="true"'))
  .map(([file]) => path.basename(file, '_24px.xml'));

process.stdout.write(' done.\n');

const uniqueCodepoints = [...new Set(mappings.values())];
const chars = String.fromCodePoint(...uniqueCodepoints);

const names = [...mappings.keys()].sort((a, b) => a.localeCompare(b));
const ligatureChars = names.join('');

for (const [variant, variableName] of variableFontPaths) {
  const variableBuffer = variableFonts.get(variableName);

  if (variableBuffer == null) {
    throw new Error(`Couldn't find ${variableName}.`);
  }

  for (const weight of WEIGHTS) {
    for (const fill of [0, 1]) {
      const fileName = `MaterialSymbols${variant}_${weight}${fill ? '_Filled' : ''}`;
      const ttfName = `${fileName}.ttf`;
      const variationAxes = { FILL: fill, GRAD: 0, opsz: 24, wght: weight };

      process.stdout.write(`Generating ${ttfName}...`);

      // The variable fonts are too large to ship, so we generate static fonts
      // The codepoints and the ligatures point to the same glyphs, so one font has both
      // The `STAT` table describes the variation axes, which the static fonts don't have
      const buffer = editGlyphs(
        await subsetFont(variableBuffer, chars + ligatureChars, {
          variationAxes,
          // @ts-expect-error `dropTables` is supported, but missing in `@types/subset-font`
          dropTables: ['STAT'],
        }),
        fill ? names : [],
        autoMirroredNames
      );

      // Subsetting with the codepoints drops the ligatures for icon names
      // As the native code draws the icons by codepoint instead of name
      fs.writeFileSync(
        new URL(ttfName, assets),
        await subsetFont(buffer, chars)
      );

      process.stdout.write(' done.\n');

      const woff2Name = `${fileName}.woff2`;

      process.stdout.write(`Generating ${woff2Name}...`);

      // Web draws the icons by name, so the woff2 fonts keep the ligatures
      // Subsetting with the letters of the names drops the codepoints instead
      fs.writeFileSync(
        new URL(woff2Name, assets),
        await subsetFont(buffer, ligatureChars, { targetFormat: 'woff2' })
      );

      process.stdout.write(' done.\n');
    }
  }
}

process.stdout.write('\n');

fs.writeFileSync(
  new URL('MaterialSymbols.codepoints', assets),
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
