import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
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
  .map(([file]) => path.basename(file, '_24px.xml'))
  .sort((a, b) => a.localeCompare(b));

process.stdout.write(' done.\n');

const uniqueCodepoints = [...new Set(mappings.values())];
const chars = String.fromCodePoint(...uniqueCodepoints);

for (const [variant, variableName] of variableFontPaths) {
  const variableBuffer = variableFonts.get(variableName);

  if (variableBuffer == null) {
    throw new Error(`Couldn't find ${variableName}.`);
  }

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
  new URL('MaterialSymbols.codepoints', assets),
  [...mappings]
    .map(([name, codepoint]) => `${name} ${codepoint.toString(16)}\n`)
    .join('')
);

fs.writeFileSync(
  new URL('MaterialSymbols.mirrored', assets),
  autoMirroredNames.map((name) => `${name}\n`).join('')
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
