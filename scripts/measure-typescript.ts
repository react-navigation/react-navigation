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
  memory: number;
  checkTime: number;
  totalTime: number;
};

type MetricOutliers = { [Key in keyof Metrics]: number[] };

type ServerMetrics = {
  openCheck: number;
  hover: number;
  completion: number;
  recheck: number;
};

type Measurement = {
  metrics: Metrics;
  outliers: MetricOutliers;
  server: ServerMetrics;
};

const NOTICEABLE_THRESHOLDS = {
  types: 1,
  instantiations: 1,
  memory: 5,
  checkTime: 10,
};

const OUTLIER_THRESHOLD = 1.4826 * 10;

const REPORT_DELIMITER = '---';

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

function log(message: string): void {
  if (!jsonOutput) {
    process.stdout.write(`${message}\n`);
  }
}

function git(args: string[]): string {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf-8',
  }).trim();
}

function yarnInstall(): void {
  log('Installing dependencies...');

  execSync('yarn install', {
    cwd: root,
    stdio: ['ignore', 'ignore', 'inherit'],
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
    memory: read('Memory used', /Memory used:\s+(\d[\d,]*)K/),
    checkTime: read('Check time', /Check time:\s+([\d.]+)s/) * 1000,
    totalTime: read('Total time', /Total time:\s+([\d.]+)s/) * 1000,
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

function summarizeValues(values: number[]) {
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

  return {
    value: Math.min(...selected),
    outliers,
  };
}

function runTsc(): Metrics {
  fs.rmSync(new URL('tsconfig.tsbuildinfo', root), {
    force: true,
  });

  let output: string;

  try {
    output = execSync('yarn tsc --noEmit --extendedDiagnostics', {
      cwd: root,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    if (typeof error === 'object' && error != null) {
      if ('stdout' in error && typeof error.stdout === 'string') {
        process.stdout.write(error.stdout);
      }

      if ('stderr' in error && typeof error.stderr === 'string') {
        process.stderr.write(error.stderr);
      }
    }

    throw error;
  }

  return parseMetrics(output);
}

function generateBenchmark(): void {
  const navigators: string[] = [];
  const screens: { name: string; level: number; index: number }[] = [];

  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const paramName = (level: number, index: number) =>
    `${letters[level % letters.length]}${letters[index % letters.length]}`;

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
      const param = paramName(level, i);

      entries.push(`    ${name}: ${screen}({
      screen: () => null,
      linking: {
        path: '${name.toLowerCase()}/:${param}',
        parse: { ${param}: (value) => Number(value) },
      },
      options: ({ route }) => ({ title: 'Item ' + route.params.${param} }),
    }),`);
      screens.push({ name, level, index: i });
    }

    if (level < BENCHMARK.depth - 1) {
      entries.push(`    Nested${level}: Nav${level + 1},`);
    }

    navigators.push(
      `const Nav${level} = ${navigator}({\n  screens: {\n${entries.join('\n')}\n  },\n});`
    );
  }

  const consumers = screens.map(({ name, level, index }) => {
    const siblingIndex = (index + 1) % BENCHMARK.width;
    const sibling = `Screen${level}_${siblingIndex}`;
    const siblingParam = paramName(level, siblingIndex);

    return `function Use${name}() {
  const navigation = useNavigation<typeof Nav0, '${name}'>('${name}');
  navigation.navigate('${sibling}', { ${siblingParam}: 1 });
  const route = useRoute<RootParamList, '${name}'>('${name}');
  const value = useNavigationState<number, typeof Nav0, '${name}'>(
    '${name}',
    (state) => state.index
  );
  return { navigation, route, value };
}
void Use${name};`;
  });

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

    const openCheck = await time('semanticDiagnosticsSync', {
      file: benchmarkFilePath,
    });
    const hover = await time('quickinfo', {
      file: benchmarkFilePath,
      line: hoverLine,
      offset: hoverOffset,
    });
    const completion = await time('completionInfo', {
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
    const recheck = await time('semanticDiagnosticsSync', {
      file: benchmarkFilePath,
    });

    return { openCheck, hover, completion, recheck };
  } finally {
    server.kill();
  }
}

async function measure(): Promise<Measurement> {
  const results: Metrics[] = [];
  const serverResults: ServerMetrics[] = [];

  generateBenchmark();

  try {
    for (let i = 0; i < runs; i++) {
      log(`  tsc run ${i + 1}/${runs}...`);
      results.push(runTsc());
    }

    for (let i = 0; i < runs; i++) {
      log(`  tsserver run ${i + 1}/${runs}...`);
      serverResults.push(await measureServer());
    }

    log('');
  } finally {
    removeBenchmark();
  }

  const types = summarizeValues(results.map((r) => r.types));
  const instantiations = summarizeValues(results.map((r) => r.instantiations));
  const memory = summarizeValues(results.map((r) => r.memory));
  const checkTime = summarizeValues(results.map((r) => r.checkTime));
  const totalTime = summarizeValues(results.map((r) => r.totalTime));

  const serverValue = (select: (metrics: ServerMetrics) => number) =>
    summarizeValues(serverResults.map(select)).value;

  return {
    metrics: {
      types: types.value,
      instantiations: instantiations.value,
      memory: memory.value,
      checkTime: checkTime.value,
      totalTime: totalTime.value,
    },
    outliers: {
      types: types.outliers,
      instantiations: instantiations.outliers,
      memory: memory.outliers,
      checkTime: checkTime.outliers,
      totalTime: totalTime.outliers,
    },
    server: {
      openCheck: serverValue((m) => m.openCheck),
      hover: serverValue((m) => m.hover),
      completion: serverValue((m) => m.completion),
      recheck: serverValue((m) => m.recheck),
    },
  };
}

function num(value: number, fraction = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
}

function delta(current: number, base: number): string {
  if (base === 0) {
    return '—';
  }

  const change = ((current - base) / base) * 100;
  const sign = change > 0 ? '+' : '';

  return `${sign}${change.toFixed(1)}%`;
}

function isNoticeable(base: Metrics, current: Metrics): boolean {
  const change = (baseValue: number, currentValue: number) =>
    baseValue === 0
      ? 0
      : Math.abs(((currentValue - baseValue) / baseValue) * 100);

  return (
    change(base.types, current.types) >= NOTICEABLE_THRESHOLDS.types ||
    change(base.instantiations, current.instantiations) >=
      NOTICEABLE_THRESHOLDS.instantiations ||
    change(base.memory, current.memory) >= NOTICEABLE_THRESHOLDS.memory ||
    change(base.checkTime, current.checkTime) >= NOTICEABLE_THRESHOLDS.checkTime
  );
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
    memory: metric(baseMetrics.memory, currentMetrics.memory),
    checkTime: metric(baseMetrics.checkTime, currentMetrics.checkTime),
    totalTime: metric(baseMetrics.totalTime, currentMetrics.totalTime),
  };

  const server = {
    openCheck: metric(base.server.openCheck, current.server.openCheck),
    hover: metric(base.server.hover, current.server.hover),
    completion: metric(base.server.completion, current.server.completion),
    recheck: metric(base.server.recheck, current.server.recheck),
  };

  return {
    baseline: { ref: baseline, sha: baselineSha },
    current: {
      branch: currentBranch === 'HEAD' ? null : currentBranch,
      sha: currentSha,
      hasUncommittedChanges: hasChanges,
    },
    runs,
    noticeable: isNoticeable(baseMetrics, currentMetrics),
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
      num(baseMetrics.types),
      num(currentMetrics.types),
      delta(currentMetrics.types, baseMetrics.types),
    ],
    [
      'Instantiations',
      num(baseMetrics.instantiations),
      num(currentMetrics.instantiations),
      delta(currentMetrics.instantiations, baseMetrics.instantiations),
    ],
    [
      'Memory',
      `${num(Math.round(baseMetrics.memory / 1024))} MB`,
      `${num(Math.round(currentMetrics.memory / 1024))} MB`,
      delta(currentMetrics.memory, baseMetrics.memory),
    ],
    [
      'Check time',
      `${num(baseMetrics.checkTime / 1000, 2)} s`,
      `${num(currentMetrics.checkTime / 1000, 2)} s`,
      delta(currentMetrics.checkTime, baseMetrics.checkTime),
    ],
    [
      'Total time',
      `${num(baseMetrics.totalTime / 1000, 2)} s`,
      `${num(currentMetrics.totalTime / 1000, 2)} s`,
      delta(currentMetrics.totalTime, baseMetrics.totalTime),
    ],
  ];

  const meta =
    `Baseline: ${baseline} (${baselineSha.slice(0, 10)})\n` +
    `Current:  ${currentBranch === 'HEAD' ? currentSha.slice(0, 10) : currentBranch} (${currentSha.slice(0, 10)})${hasChanges ? ' + uncommitted changes' : ''}\n` +
    `Runs:     ${runs}`;

  process.stdout.write(`\n${REPORT_DELIMITER}\n\n`);
  process.stdout.write('## TypeScript performance impact\n\n');
  process.stdout.write(`${meta}\n\n`);
  process.stdout.write('### tsc type-check\n\n');
  printTable(rows);
  printServerSummary(base.server, current.server);
  process.stdout.write(`\n${REPORT_DELIMITER}\n`);

  printOutliers('Baseline', base.outliers);
  printOutliers('Current', current.outliers);

  const verdict = isNoticeable(baseMetrics, currentMetrics)
    ? 'Detected a noticeable performance change.'
    : 'No noticeable performance change to report.';

  process.stdout.write(`\n${verdict}\n`);
}

function printTable(rows: string[][]): void {
  const header = rows[0];

  if (header == null) {
    throw new Error("Couldn't find table header row.");
  }

  const widths = header.map((_, column) =>
    Math.max(3, ...rows.map((row) => row[column]?.length ?? 0))
  );

  const line = (cells: string[]) =>
    `| ${cells
      .map((cell, column) =>
        column === 0
          ? cell.padEnd(widths[column] ?? 0)
          : cell.padStart(widths[column] ?? 0)
      )
      .join(' | ')} |`;

  const alignment = widths.map((width, column) =>
    column === 0 ? '-'.repeat(width) : `${'-'.repeat(width - 1)}:`
  );

  process.stdout.write(`${line(header)}\n| ${alignment.join(' | ')} |\n`);

  rows.slice(1).forEach((row) => {
    process.stdout.write(`${line(row)}\n`);
  });
}

function printServerSummary(base: ServerMetrics, current: ServerMetrics): void {
  const row = (
    name: string,
    baseValue: number,
    currentValue: number,
    unit: 'ms' | 's'
  ) => {
    const scale = unit === 's' ? 1000 : 1;
    const fraction = unit === 's' ? 2 : 1;

    return [
      name,
      `${num(baseValue / scale, fraction)} ${unit}`,
      `${num(currentValue / scale, fraction)} ${unit}`,
      baseValue < 1 ? '—' : delta(currentValue, baseValue),
    ];
  };

  process.stdout.write('\n### tsserver latency\n\n');

  printTable([
    ['Operation', 'Baseline', 'Current', 'Δ'],
    row('Open + first check', base.openCheck, current.openCheck, 's'),
    row('Hover', base.hover, current.hover, 'ms'),
    row('Completion', base.completion, current.completion, 'ms'),
    row('Re-check after edit', base.recheck, current.recheck, 's'),
  ]);
}

function printOutliers(label: string, outliers: MetricOutliers): void {
  const rows = [
    { name: 'Types', values: outliers.types.map((v) => num(v)) },
    {
      name: 'Instantiations',
      values: outliers.instantiations.map((v) => num(v)),
    },
    {
      name: 'Memory',
      values: outliers.memory.map((v) => `${num(Math.round(v / 1024))} MB`),
    },
    {
      name: 'Check time',
      values: outliers.checkTime.map((v) => `${num(v / 1000, 2)} s`),
    },
    {
      name: 'Total time',
      values: outliers.totalTime.map((v) => `${num(v / 1000, 2)} s`),
    },
  ].filter((row) => row.values.length > 0);

  if (rows.length === 0) {
    return;
  }

  process.stdout.write(`\nRemoved ${label.toLowerCase()} outliers:\n`);

  rows.forEach(({ name, values }) => {
    process.stdout.write(`  ${name}: ${values.join(', ')}\n`);
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

log('Measuring CURRENT (working tree)...');

const stashLabel = `measure-typescript ${new Date().toISOString()}`;

let stashed = false;

function restore(): void {
  log('Restoring your working tree...');

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
  const current = await measure();

  if (hasChanges) {
    log('Stashing your uncommitted changes...');

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
    log(`Checking out baseline (${baseline})...`);

    git(['checkout', '--quiet', baselineSha]);

    yarnInstall();

    log(`\nMeasuring BASELINE (${baseline})...`);

    const base = await measure();

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
