import { execFileSync, execSync, spawn } from 'node:child_process';
import * as fs from 'node:fs';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { parseArgs } from 'node:util';

const root = new URL('..', import.meta.url);

const BENCHMARK = { depth: 10, width: 100 };

type NavigatorConfig = [navigator: string, screen: string, pkg: string];

const NAVIGATORS: NavigatorConfig[] = [
  ['createNativeStackNavigator', 'createNativeStackScreen', 'native-stack'],
  ['createStackNavigator', 'createStackScreen', 'stack'],
  ['createBottomTabNavigator', 'createBottomTabScreen', 'bottom-tabs'],
  ['createDrawerNavigator', 'createDrawerScreen', 'drawer'],
  [
    'createMaterialTopTabNavigator',
    'createMaterialTopTabScreen',
    'material-top-tabs',
  ],
];

const benchmarkFile = new URL(
  'example/__typechecks__/_generated-benchmark.tsx',
  root
);

type Metrics = {
  types: number;
  instantiations: number;
  memoryKB: number;
  checkTimeSec: number;
  totalTimeSec: number;
};

type MetricOutliers = { [Key in keyof Metrics]: number[] };

type ServerMetrics = {
  openCheckMs: number;
  hoverMs: number;
  completionMs: number;
  recheckMs: number;
};

type Measurement = {
  metrics: Metrics;
  outliers: MetricOutliers;
  server: ServerMetrics;
};

const NOTICEABLE_THRESHOLDS = {
  types: 1,
  instantiations: 1,
  memoryKB: 5,
  checkTimeSec: 10,
};

const OUTLIER_THRESHOLD = 1.4826 * 10;

const HELP = `Usage: node scripts/measure-typescript.ts [baseline-ref] [--runs N] [--json]

Compares \`tsc --noEmit --extendedDiagnostics\` metrics, plus editor-style
\`tsserver\` latencies (open, hover, completion, re-check after edit), between
the current working tree and a baseline git ref.

Arguments:
  baseline-ref   Git branch, tag, or commit (default: main)
  --runs N       Number of tsc runs per side (default: 5)
  --json         Output a machine-readable JSON report instead of a table
`;

const parsed = (() => {
  try {
    return parseArgs({
      options: {
        runs: { type: 'string', default: '7' },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      allowPositionals: true,
    });
  } catch (error) {
    process.stderr.write(`${String(error)}\n\n${HELP}`);
    process.exit(1);
  }
})();

if (parsed.values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

if (parsed.positionals.length > 1) {
  process.stderr.write(
    `Unexpected extra arguments: ${parsed.positionals.slice(1).join(' ')}\n\n${HELP}`
  );
  process.exit(1);
}

const baseline = parsed.positionals[0] ?? 'main';
const runs = Number.parseInt(parsed.values.runs, 10);
const jsonOutput = parsed.values.json;

if (!Number.isFinite(runs) || runs < 1) {
  process.stderr.write(`Invalid --runs value: ${parsed.values.runs}\n`);
  process.exit(1);
}

function git(args: string[]): string {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf-8',
  }).trim();
}

function yarnInstall(): void {
  execSync('yarn install', {
    cwd: root,
    stdio: jsonOutput ? 'ignore' : 'inherit',
  });
}

function resolveRef(ref: string): string {
  try {
    return git(['rev-parse', '--verify', ref]);
  } catch {
    process.stderr.write(`Cannot resolve baseline ref: ${ref}\n`);
    process.exit(1);
  }
}

function parseMetrics(output: string): Metrics {
  const read = (label: string, pattern: RegExp): number => {
    const value = output.match(pattern)?.[1]?.replace(/,/g, '');

    if (value == null) {
      throw new Error(
        `Could not parse "${label}" from tsc output. Is --extendedDiagnostics supported by this tsc version?`
      );
    }

    return Number.parseFloat(value);
  };

  return {
    types: read('Types', /Types:\s+(\d[\d,]*)/),
    instantiations: read('Instantiations', /Instantiations:\s+(\d[\d,]*)/),
    memoryKB: read('Memory used', /Memory used:\s+(\d[\d,]*)K/),
    checkTimeSec: read('Check time', /Check time:\s+([\d.]+)s/),
    totalTimeSec: read('Total time', /Total time:\s+([\d.]+)s/),
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const current = sorted[middle];

  if (current == null) {
    throw new Error(`Couldn't find a median value at index ${middle}.`);
  }

  if (sorted.length % 2 === 1) {
    return current;
  }

  const previous = sorted[middle - 1];

  if (previous == null) {
    throw new Error(`Couldn't find a median value at index ${middle - 1}.`);
  }

  return (previous + current) / 2;
}

function summarizeValues(values: number[], select: 'first' | 'min') {
  const middle = median(values);
  const mad = median(values.map((value) => Math.abs(value - middle)));

  const outliers =
    values.length > 1
      ? values.filter(
          (value) =>
            Math.abs((value - middle) / (mad > 0 ? mad : Number.EPSILON)) >
            OUTLIER_THRESHOLD
        )
      : [];
  const kept = values.filter((value) => !outliers.includes(value));
  const selected = kept.length > 0 ? kept : values;
  const first = selected[0];

  if (first == null) {
    throw new Error("Couldn't find a metric value.");
  }

  return {
    value: select === 'first' ? first : Math.min(...selected),
    outliers,
  };
}

function runTsc(): Metrics {
  fs.rmSync(new URL('tsconfig.tsbuildinfo', root), {
    force: true,
  });

  const output = execSync('yarn tsc --noEmit --extendedDiagnostics', {
    cwd: root,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return parseMetrics(output);
}

function generateBenchmark(): void {
  const navigators: string[] = [];
  const screens: string[] = [];

  // Build from the deepest level up so each level can nest the previous one.
  for (let level = BENCHMARK.depth - 1; level >= 0; level--) {
    const config = NAVIGATORS[level % NAVIGATORS.length];

    if (config == null) {
      throw new Error(`Couldn't find a navigator config for level ${level}.`);
    }

    const [navigator, screen] = config;
    const entries: string[] = [];

    for (let i = 0; i < BENCHMARK.width; i++) {
      const name = `Screen${level}_${i}`;

      entries.push(`    ${name}: ${screen}({
      screen: () => null,
      linking: {
        path: '${name.toLowerCase()}/:id',
        parse: { id: (value) => Number(value) },
      },
      options: ({ route }) => ({ title: 'Item ' + route.params.id }),
    }),`);
      screens.push(name);
    }

    if (level < BENCHMARK.depth - 1) {
      entries.push(`    Nested${level}: Nav${level + 1},`);
    }

    navigators.push(
      `const Nav${level} = ${navigator}({\n  screens: {\n${entries.join('\n')}\n  },\n});`
    );
  }

  const consumers = screens.map(
    (name) => `function Use${name}() {
  const navigation = useNavigation<typeof Nav0>('${name}');
  const route = useRoute<RootParamList, '${name}'>('${name}');
  const value = useNavigationState<number, typeof Nav0, '${name}'>(
    '${name}',
    (state) => state.index
  );
  return { navigation, route, value };
}
void Use${name};`
  );

  const imports = NAVIGATORS.map(
    ([navigator, screen, pkg]) =>
      `import { ${navigator}, ${screen} } from '@react-navigation/${pkg}';`
  ).join('\n');

  fs.writeFileSync(
    benchmarkFile,
    `/* eslint-disable */
// Generated by scripts/measure-typescript.ts -- do not edit or commit.
import {
  createStaticNavigation,
  useNavigation,
  useNavigationState,
  useRoute,
  type StaticParamList,
} from '@react-navigation/native';
${imports}

${navigators.join('\n\n')}

createStaticNavigation(Nav0);

type RootParamList = StaticParamList<typeof Nav0>;

${consumers.join('\n\n')}
`
  );
}

function removeBenchmark(): void {
  fs.rmSync(benchmarkFile, { force: true });
}

type ServerMessage = {
  type?: string;
  request_seq?: number;
};

async function measureServer(): Promise<ServerMetrics> {
  const tsserver = new URL('node_modules/typescript/lib/tsserver.js', root);
  const tsserverPath = fileURLToPath(tsserver);
  const benchmarkFilePath = fileURLToPath(benchmarkFile);
  const rootPath = fileURLToPath(root);

  if (!fs.existsSync(tsserver)) {
    throw new Error(`Couldn't find tsserver at ${tsserverPath}.`);
  }

  const lines = fs.readFileSync(benchmarkFile, 'utf-8').split('\n');
  const hoverText = lines.find((line) =>
    line.includes('const route = useRoute')
  );
  const editIndex = lines.findIndex((line) => line.startsWith('const Nav0 '));

  if (hoverText == null || editIndex === -1) {
    throw new Error(
      "Couldn't find the tsserver anchors in the generated benchmark. " +
        'The benchmark generator and measureServer have drifted apart.'
    );
  }

  const hoverLine = lines.indexOf(hoverText) + 1;
  const hoverOffset = hoverText.indexOf('route') + 1;
  const editLine = editIndex + 1;

  const server = spawn(
    'node',
    [tsserverPath, '--disableAutomaticTypingAcquisition'],
    { cwd: root }
  );

  const pending = new Map<number, (message: ServerMessage) => void>();
  let buffer = Buffer.alloc(0);

  server.stdout.on('data', (chunk: Buffer) => {
    buffer = Buffer.concat([buffer, chunk]);

    for (;;) {
      const headerEnd = buffer.indexOf('\r\n\r\n');

      if (headerEnd === -1) {
        break;
      }

      const header = buffer.subarray(0, headerEnd).toString();
      const length = Number(header.match(/Content-Length: (\d+)/)?.[1]);

      if (Number.isNaN(length)) {
        buffer = buffer.subarray(headerEnd + 4);
        continue;
      }

      const start = headerEnd + 4;
      const end = start + length;

      if (buffer.length < end) {
        break;
      }

      const message: ServerMessage = JSON.parse(
        buffer.subarray(start, end).toString()
      );

      buffer = buffer.subarray(end);

      if (message.type === 'response' && message.request_seq != null) {
        const resolve = pending.get(message.request_seq);

        if (resolve) {
          pending.delete(message.request_seq);
          resolve(message);
        }
      }
    }
  });

  let seq = 0;

  const send = (command: string, args: object): number => {
    seq += 1;
    server.stdin.write(
      `${JSON.stringify({ seq, type: 'request', command, arguments: args })}\n`
    );
    return seq;
  };

  const request = (command: string, args: object): Promise<ServerMessage> => {
    const current = send(command, args);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(current);
        reject(new Error(`tsserver timed out waiting for '${command}'.`));
      }, 180000);

      pending.set(current, (message) => {
        clearTimeout(timer);
        resolve(message);
      });
    });
  };

  const time = async (command: string, args: object): Promise<number> => {
    const start = performance.now();
    await request(command, args);
    return performance.now() - start;
  };

  try {
    send('open', {
      file: benchmarkFilePath,
      projectRootPath: rootPath.replace(/\/$/, ''),
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const openCheckMs = await time('semanticDiagnosticsSync', {
      file: benchmarkFilePath,
    });
    const hoverMs = await time('quickinfo', {
      file: benchmarkFilePath,
      line: hoverLine,
      offset: hoverOffset,
    });
    const completionMs = await time('completionInfo', {
      file: benchmarkFilePath,
      line: hoverLine,
      offset: hoverOffset,
      triggerKind: 1,
    });

    send('change', {
      file: benchmarkFilePath,
      line: editLine,
      offset: 1,
      endLine: editLine,
      endOffset: 1,
      insertString: ' ',
    });
    const recheckMs = await time('semanticDiagnosticsSync', {
      file: benchmarkFilePath,
    });

    return { openCheckMs, hoverMs, completionMs, recheckMs };
  } finally {
    server.kill();
  }
}

async function measure(label: string): Promise<Measurement> {
  const results: Metrics[] = [];
  const serverResults: ServerMetrics[] = [];

  generateBenchmark();

  try {
    for (let i = 0; i < runs; i++) {
      if (!jsonOutput) {
        process.stdout.write(`  ${label} tsc run ${i + 1}/${runs}...\n`);
      }
      results.push(runTsc());
    }

    for (let i = 0; i < runs; i++) {
      if (!jsonOutput) {
        process.stdout.write(`  ${label} tsserver run ${i + 1}/${runs}...\n`);
      }
      serverResults.push(await measureServer());
    }
  } finally {
    removeBenchmark();
  }

  const types = summarizeValues(
    results.map((r) => r.types),
    'first'
  );
  const instantiations = summarizeValues(
    results.map((r) => r.instantiations),
    'first'
  );
  const memoryKB = summarizeValues(
    results.map((r) => r.memoryKB),
    'min'
  );
  const checkTimeSec = summarizeValues(
    results.map((r) => r.checkTimeSec),
    'min'
  );
  const totalTimeSec = summarizeValues(
    results.map((r) => r.totalTimeSec),
    'min'
  );

  const serverValue = (select: (metrics: ServerMetrics) => number) =>
    summarizeValues(serverResults.map(select), 'min').value;

  return {
    metrics: {
      types: types.value,
      instantiations: instantiations.value,
      memoryKB: memoryKB.value,
      checkTimeSec: checkTimeSec.value,
      totalTimeSec: totalTimeSec.value,
    },
    outliers: {
      types: types.outliers,
      instantiations: instantiations.outliers,
      memoryKB: memoryKB.outliers,
      checkTimeSec: checkTimeSec.outliers,
      totalTimeSec: totalTimeSec.outliers,
    },
    server: {
      openCheckMs: serverValue((m) => m.openCheckMs),
      hoverMs: serverValue((m) => m.hoverMs),
      completionMs: serverValue((m) => m.completionMs),
      recheckMs: serverValue((m) => m.recheckMs),
    },
  };
}

function format(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function delta(current: number, base: number): string {
  if (base === 0) {
    return '—';
  }

  const change = ((current - base) / base) * 100;
  const sign = change > 0 ? '+' : '';

  return `${sign}${change.toFixed(1)}%`;
}

function toReport(base: Measurement, current: Measurement) {
  const metric = (baseValue: number, currentValue: number) => ({
    base: baseValue,
    current: currentValue,
    delta:
      baseValue === 0 ? null : ((currentValue - baseValue) / baseValue) * 100,
  });

  const baseMetrics = base.metrics;
  const currentMetrics = current.metrics;

  const metrics = {
    types: metric(baseMetrics.types, currentMetrics.types),
    instantiations: metric(
      baseMetrics.instantiations,
      currentMetrics.instantiations
    ),
    memoryKB: metric(baseMetrics.memoryKB, currentMetrics.memoryKB),
    checkTimeSec: metric(baseMetrics.checkTimeSec, currentMetrics.checkTimeSec),
    totalTimeSec: metric(baseMetrics.totalTimeSec, currentMetrics.totalTimeSec),
  };

  const noticeable =
    Math.abs(metrics.types.delta ?? 0) >= NOTICEABLE_THRESHOLDS.types ||
    Math.abs(metrics.instantiations.delta ?? 0) >=
      NOTICEABLE_THRESHOLDS.instantiations ||
    Math.abs(metrics.memoryKB.delta ?? 0) >= NOTICEABLE_THRESHOLDS.memoryKB ||
    Math.abs(metrics.checkTimeSec.delta ?? 0) >=
      NOTICEABLE_THRESHOLDS.checkTimeSec;

  const server = {
    openCheckMs: metric(base.server.openCheckMs, current.server.openCheckMs),
    hoverMs: metric(base.server.hoverMs, current.server.hoverMs),
    completionMs: metric(base.server.completionMs, current.server.completionMs),
    recheckMs: metric(base.server.recheckMs, current.server.recheckMs),
  };

  return {
    baseline: { ref: baseline, sha: baselineSha },
    current: {
      branch: currentBranch === 'HEAD' ? null : currentBranch,
      sha: currentSha,
      hasUncommittedChanges: hasChanges,
    },
    runs,
    noticeable,
    metrics,
    server,
    outliers: {
      baseline: base.outliers,
      current: current.outliers,
    },
  };
}

function printSummary(base: Measurement, current: Measurement): void {
  const baseMetrics = base.metrics;
  const currentMetrics = current.metrics;

  const rows: string[][] = [
    ['Metric', 'Baseline', 'Current', 'Δ'],
    [
      'Types',
      format(baseMetrics.types),
      format(currentMetrics.types),
      delta(currentMetrics.types, baseMetrics.types),
    ],
    [
      'Instantiations',
      format(baseMetrics.instantiations),
      format(currentMetrics.instantiations),
      delta(currentMetrics.instantiations, baseMetrics.instantiations),
    ],
    [
      'Memory (MB)',
      format(Math.round(baseMetrics.memoryKB / 1024)),
      format(Math.round(currentMetrics.memoryKB / 1024)),
      delta(currentMetrics.memoryKB, baseMetrics.memoryKB),
    ],
    [
      'Check time (s)',
      baseMetrics.checkTimeSec.toFixed(2),
      currentMetrics.checkTimeSec.toFixed(2),
      delta(currentMetrics.checkTimeSec, baseMetrics.checkTimeSec),
    ],
    [
      'Total time (s)',
      baseMetrics.totalTimeSec.toFixed(2),
      currentMetrics.totalTimeSec.toFixed(2),
      delta(currentMetrics.totalTimeSec, baseMetrics.totalTimeSec),
    ],
  ];

  process.stdout.write('\ntsc type-check:\n');

  printTable(rows);

  printOutliers('Baseline', base.outliers);
  printOutliers('Current', current.outliers);

  printServerSummary(base.server, current.server);
}

function printTable(rows: string[][]): void {
  const headerRow = rows[0];

  if (headerRow == null) {
    throw new Error("Couldn't find table header row.");
  }

  const widths = headerRow.map((_, column) =>
    Math.max(...rows.map((row) => row[column]?.length ?? 0))
  );

  const separator = `+${widths.map((w) => '-'.repeat(w + 2)).join('+')}+`;

  process.stdout.write(`\n${separator}\n`);

  rows.forEach((row, index) => {
    const line = row
      .map((cell, column) => {
        const width = widths[column] ?? 0;

        const padded =
          column === 0 || index === 0
            ? cell.padEnd(width)
            : cell.padStart(width);

        return ` ${padded} `;
      })
      .join('|');

    process.stdout.write(`|${line}|\n`);

    if (index === 0) {
      process.stdout.write(`${separator}\n`);
    }
  });

  process.stdout.write(`${separator}\n`);
}

function printServerSummary(base: ServerMetrics, current: ServerMetrics): void {
  const row = (name: string, baseValue: number, currentValue: number) => [
    name,
    baseValue.toFixed(1),
    currentValue.toFixed(1),
    baseValue < 1 ? '—' : delta(currentValue, baseValue),
  ];

  process.stdout.write('\ntsserver latency:\n');

  printTable([
    ['Operation (ms)', 'Baseline', 'Current', 'Δ'],
    row('Open + first check', base.openCheckMs, current.openCheckMs),
    row('Hover', base.hoverMs, current.hoverMs),
    row('Completion', base.completionMs, current.completionMs),
    row('Re-check after edit', base.recheckMs, current.recheckMs),
  ]);
}

function printOutliers(label: string, outliers: MetricOutliers): void {
  const rows: { name: string; values: number[] }[] = [
    { name: 'Types', values: outliers.types },
    { name: 'Instantiations', values: outliers.instantiations },
    { name: 'Memory (KB)', values: outliers.memoryKB },
    { name: 'Check time (s)', values: outliers.checkTimeSec },
    { name: 'Total time (s)', values: outliers.totalTimeSec },
  ].filter((row) => row.values.length > 0);

  if (rows.length === 0) {
    return;
  }

  process.stdout.write(`\nRemoved ${label.toLowerCase()} outliers:\n`);

  rows.forEach(({ name, values }) => {
    process.stdout.write(`  ${name}: ${values.map(format).join(', ')}\n`);
  });
}

if (git(['rev-parse', '--is-inside-work-tree']) !== 'true') {
  process.stderr.write('Not inside a git working tree.\n');

  process.exit(1);
}

const baselineSha = resolveRef(baseline);
const currentSha = git(['rev-parse', 'HEAD']);
const currentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
const hasChanges = git(['status', '--porcelain']).length > 0;

if (baselineSha === currentSha && !hasChanges) {
  process.stderr.write(
    `Baseline ${baseline} is identical to the current tree — nothing to compare.\n`
  );

  process.exit(1);
}

if (!jsonOutput) {
  process.stdout.write(
    `Baseline: ${baseline} (${baselineSha.slice(0, 10)})\n` +
      `Current:  ${currentBranch === 'HEAD' ? currentSha.slice(0, 10) : currentBranch} (${currentSha.slice(0, 10)})${hasChanges ? ' + uncommitted changes' : ''}\n` +
      `Runs per side: ${runs}\n\n`
  );

  process.stdout.write('Measuring CURRENT (working tree)...\n');
}

const stashLabel = `measure-typescript ${new Date().toISOString()}`;

let stashed = false;

function restore(): void {
  try {
    const ref = currentBranch === 'HEAD' ? currentSha : currentBranch;

    git(['checkout', '--quiet', ref]);
  } catch (error) {
    process.stderr.write(
      `\nFailed to restore original checkout (${currentBranch}). ` +
        `Recover manually with:\n  git checkout ${currentBranch}\n` +
        (stashed ? `  git stash pop\n` : '') +
        `${String(error)}\n`
    );

    return;
  }

  if (stashed) {
    try {
      git(['stash', 'pop', '--quiet']);

      stashed = false;
    } catch (error) {
      process.stderr.write(
        `\nFailed to restore stashed changes. Recover with:\n  git stash pop\n` +
          `${String(error)}\n`
      );
    }
  }

  yarnInstall();
}

process.on('SIGINT', () => {
  process.stderr.write('\nInterrupted — restoring original state...\n');

  removeBenchmark();
  restore();

  process.exit(130);
});

async function run(): Promise<void> {
  const current = await measure('current');

  if (hasChanges) {
    git([
      'stash',
      'push',
      '--quiet',
      '--include-untracked',
      '--message',
      stashLabel,
    ]);

    stashed = true;
  }

  try {
    git(['checkout', '--quiet', baselineSha]);

    yarnInstall();

    if (!jsonOutput) {
      process.stdout.write(`\nMeasuring BASELINE (${baseline})...\n`);
    }

    const base = await measure('baseline');

    restore();

    if (jsonOutput) {
      process.stdout.write(
        `${JSON.stringify(toReport(base, current), null, 2)}\n`
      );
    } else {
      printSummary(base, current);
    }
  } catch (error) {
    restore();
    throw error;
  }
}

run().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
