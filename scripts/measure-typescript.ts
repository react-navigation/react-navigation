import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { parseArgs } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));

type Metrics = {
  types: number;
  instantiations: number;
  memoryKB: number;
  checkTimeSec: number;
  totalTimeSec: number;
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
      runs: { type: 'string', default: '5' },
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

function git(command: string): string {
  return execSync(`git ${command}`, { cwd: root, encoding: 'utf-8' }).trim();
}

function yarnInstall(): void {
  execSync('yarn install', {
    cwd: root,
    stdio: jsonOutput ? 'ignore' : 'inherit',
  });
}

function resolveRef(ref: string): string {
  try {
    return git(`rev-parse --verify ${JSON.stringify(ref)}`);
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

function measure(label: string): Metrics {
  const results: Metrics[] = [];

  for (let i = 0; i < runs; i++) {
    if (!jsonOutput) {
      process.stdout.write(`  ${label} run ${i + 1}/${runs}...\n`);
    }
    results.push(runTsc());
  }

  return {
    types: results[0].types,
    instantiations: results[0].instantiations,
    memoryKB: Math.min(...results.map((r) => r.memoryKB)),
    checkTimeSec: Math.min(...results.map((r) => r.checkTimeSec)),
    totalTimeSec: Math.min(...results.map((r) => r.totalTimeSec)),
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

function toReport(base: Metrics, current: Metrics) {
  const metric = (baseValue: number, currentValue: number) => ({
    base: baseValue,
    current: currentValue,
    delta:
      baseValue === 0 ? null : ((currentValue - baseValue) / baseValue) * 100,
  });

  const metrics = {
    types: metric(base.types, current.types),
    instantiations: metric(base.instantiations, current.instantiations),
    memoryKB: metric(base.memoryKB, current.memoryKB),
    checkTimeSec: metric(base.checkTimeSec, current.checkTimeSec),
    totalTimeSec: metric(base.totalTimeSec, current.totalTimeSec),
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
  };
}

function printJson(base: Metrics, current: Metrics): void {
  process.stdout.write(`${JSON.stringify(toReport(base, current), null, 2)}\n`);
}

function printSummary(base: Metrics, current: Metrics): void {
  const rows: string[][] = [
    ['Metric', 'Baseline', 'Current', 'Δ'],
    [
      'Types',
      format(base.types),
      format(current.types),
      delta(current.types, base.types),
    ],
    [
      'Instantiations',
      format(base.instantiations),
      format(current.instantiations),
      delta(current.instantiations, base.instantiations),
    ],
    [
      'Memory (MB)',
      format(Math.round(base.memoryKB / 1024)),
      format(Math.round(current.memoryKB / 1024)),
      delta(current.memoryKB, base.memoryKB),
    ],
    [
      'Check time (s)',
      base.checkTimeSec.toFixed(2),
      current.checkTimeSec.toFixed(2),
      delta(current.checkTimeSec, base.checkTimeSec),
    ],
    [
      'Total time (s)',
      base.totalTimeSec.toFixed(2),
      current.totalTimeSec.toFixed(2),
      delta(current.totalTimeSec, base.totalTimeSec),
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
}

if (git('rev-parse --is-inside-work-tree') !== 'true') {
  process.stderr.write('Not inside a git working tree.\n');

  process.exit(1);
}

const baselineSha = resolveRef(baseline);
const currentSha = git('rev-parse HEAD');
const currentBranch = git('rev-parse --abbrev-ref HEAD');
const hasChanges = git('status --porcelain').length > 0;

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

const current = measure('current');

const stashLabel = `measure-typescript ${new Date().toISOString()}`;

let stashed = false;

function restore(): void {
  try {
    const ref = currentBranch === 'HEAD' ? currentSha : currentBranch;

    git(`checkout --quiet ${JSON.stringify(ref)}`);
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
      git('stash pop --quiet');

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

  restore();

  process.exit(130);
});

if (hasChanges) {
  git(
    `stash push --quiet --include-untracked --message ${JSON.stringify(stashLabel)}`
  );

  stashed = true;
}

try {
  git(`checkout --quiet ${JSON.stringify(baselineSha)}`);

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
