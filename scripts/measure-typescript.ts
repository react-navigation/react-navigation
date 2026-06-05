import { execFileSync, execSync } from 'node:child_process';
import * as fs from 'node:fs';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { parseArgs } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));

// A generated deep navigator tree (cycling through every navigator type) where
// every screen declares a parsed deep-link path, derives its options from the
// route params, and is consumed through useNavigation/useRoute/
// useNavigationState. It's added to the program only while measuring, so the
// numbers reflect realistic nested-navigation type inference.
const BENCHMARK = { depth: 10, width: 100 };

// Every navigator type in the repo, paired with its screen-config helper and
// package. Levels cycle through them so the benchmark exercises all of them.
const NAVIGATORS = [
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

const benchmarkFile = fileURLToPath(
  new URL('example/__typechecks__/_generated-benchmark.tsx', `file://${root}/`)
);

type Metrics = {
  types: number;
  instantiations: number;
  memoryKB: number;
  checkTimeSec: number;
  totalTimeSec: number;
};

type MetricOutliers = {
  types: number[];
  instantiations: number[];
  memoryKB: number[];
  checkTimeSec: number[];
  totalTimeSec: number[];
};

type Measurement = {
  metrics: Metrics;
  outliers: MetricOutliers;
};

// Minimum |Δ%| for a metric to count as a noticeable change.
// - Types/Instantiations are deterministic, so 1% flags any real type-graph change.
// - Memory has GC/allocator jitter across runs.
// - Check time has 2-3x natural variance on CI runners.
const NOTICEABLE_THRESHOLDS = {
  types: 1,
  instantiations: 1,
  memoryKB: 5,
  checkTimeSec: 10,
} as const;

// Median absolute deviation based threshold to detect outliers.
const OUTLIER_THRESHOLD = 1.4826 * 10;

const HELP = `Usage: node scripts/measure-typescript.ts [baseline-ref] [--runs N] [--json]

Compares \`tsc --noEmit --extendedDiagnostics\` metrics between the
current working tree and a baseline git ref.

Arguments:
  baseline-ref   Git branch, tag, or commit (default: main)
  --runs N       Number of tsc runs per side (default: 5)
  --json         Output a machine-readable JSON report instead of a table
`;

let parsed;

try {
  parsed = parseArgs({
    options: {
      runs: { type: 'string', default: '7' },
      json: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
    allowPositionals: true,
  });
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n\n${HELP}`);
  process.exit(1);
}

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
  const read = (pattern: RegExp, label: string): string => {
    const match = output.match(pattern);

    if (!match) {
      throw new Error(
        `Could not parse "${label}" from tsc output. Is --extendedDiagnostics supported by this tsc version?`
      );
    }

    return match[1];
  };

  const asNumber = (value: string) =>
    Number.parseFloat(value.replace(/,/g, ''));

  return {
    types: asNumber(read(/Types:\s+(\d[\d,]*)/, 'Types')),
    instantiations: asNumber(
      read(/Instantiations:\s+(\d[\d,]*)/, 'Instantiations')
    ),
    memoryKB: asNumber(read(/Memory used:\s+(\d[\d,]*)K/, 'Memory used')),
    checkTimeSec: asNumber(read(/Check time:\s+([\d.]+)s/, 'Check time')),
    totalTimeSec: asNumber(read(/Total time:\s+([\d.]+)s/, 'Total time')),
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function summarizeValues(
  values: number[],
  selectValue: (values: number[]) => number
) {
  if (values.length <= 1) {
    return {
      value: selectValue(values),
      outliers: [],
    };
  }

  const middle = median(values);
  const mad = median(values.map((value) => Math.abs(value - middle)));

  const isOutlier = (value: number) =>
    Math.abs((value - middle) / (mad > 0 ? mad : Number.EPSILON)) >
    OUTLIER_THRESHOLD;

  const kept = values.filter((value) => !isOutlier(value));

  return {
    value: selectValue(kept.length > 0 ? kept : values),
    outliers: values.filter(isOutlier),
  };
}

function runTsc(): Metrics {
  const buildInfo = new URL('tsconfig.tsbuildinfo', `file://${root}/`);

  try {
    fs.rmSync(fileURLToPath(buildInfo));
  } catch {
    // Ignore if the file doesn't exist
  }

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
    const [navigator, screen] = NAVIGATORS[level % NAVIGATORS.length];
    const entries: string[] = [];

    for (let i = 0; i < BENCHMARK.width; i++) {
      const name = `Screen${level}_${i}`;
      // Use the navigator's screen helper so the params parsed from the
      // deep-link path are inferred and flow into `options`, like a real screen.
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

  // One consumer per screen using the three hooks, as a real screen would.
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
  try {
    fs.rmSync(benchmarkFile);
  } catch {
    // Ignore if it doesn't exist
  }
}

function measure(label: string): Measurement {
  const results: Metrics[] = [];

  generateBenchmark();

  try {
    for (let i = 0; i < runs; i++) {
      if (!jsonOutput) {
        process.stdout.write(`  ${label} run ${i + 1}/${runs}...\n`);
      }
      results.push(runTsc());
    }
  } finally {
    removeBenchmark();
  }

  const first = (values: number[]) => values[0];
  const min = (values: number[]) => Math.min(...values);

  const types = summarizeValues(
    results.map((r) => r.types),
    first
  );
  const instantiations = summarizeValues(
    results.map((r) => r.instantiations),
    first
  );
  const memoryKB = summarizeValues(
    results.map((r) => r.memoryKB),
    min
  );
  const checkTimeSec = summarizeValues(
    results.map((r) => r.checkTimeSec),
    min
  );
  const totalTimeSec = summarizeValues(
    results.map((r) => r.totalTimeSec),
    min
  );

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

  const noticeable = Object.entries(NOTICEABLE_THRESHOLDS).some(
    ([key, threshold]) =>
      Math.abs(metrics[key as keyof typeof NOTICEABLE_THRESHOLDS].delta ?? 0) >=
      threshold
  );

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
    outliers: {
      baseline: base.outliers,
      current: current.outliers,
    },
  };
}

function printJson(base: Measurement, current: Measurement): void {
  process.stdout.write(`${JSON.stringify(toReport(base, current), null, 2)}\n`);
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

  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => row[column].length))
  );

  const separator = `+${widths.map((w) => '-'.repeat(w + 2)).join('+')}+`;

  process.stdout.write(`\n${separator}\n`);

  rows.forEach((row, index) => {
    const line = row
      .map((cell, column) => {
        const padded =
          column === 0 || index === 0
            ? cell.padEnd(widths[column])
            : cell.padStart(widths[column]);

        return ` ${padded} `;
      })
      .join('|');

    process.stdout.write(`|${line}|\n`);

    if (index === 0) {
      process.stdout.write(`${separator}\n`);
    }
  });

  process.stdout.write(`${separator}\n`);

  printOutliers('Baseline', base.outliers);
  printOutliers('Current', current.outliers);
}

function formatOutlierValues(values: number[]): string {
  return values.map(format).join(', ');
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
    process.stdout.write(`  ${name}: ${formatOutlierValues(values)}\n`);
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
    `Monorepo: ${root}\n` +
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
        `Underlying error: ${(error as Error).message}\n`
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
          `Underlying error: ${(error as Error).message}\n`
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

const current = measure('current');

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

  const base = measure('baseline');

  restore();

  if (jsonOutput) {
    printJson(base, current);
  } else {
    printSummary(base, current);
  }
} catch (error) {
  restore();
  throw error;
}
