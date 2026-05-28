import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import config from '../example/app.json' with { type: 'json' };

const root = new URL('..', import.meta.url);
const cwd = new URL('example/', root);
const artifactsDir = new URL('agent-device-artifacts/', cwd);
const agentDeviceBin = fileURLToPath(
  new URL('../node_modules/agent-device/bin/agent-device.mjs', import.meta.url)
);

const platformIndex = process.argv.indexOf('--platform');
const platform =
  platformIndex === -1 ? undefined : process.argv[platformIndex + 1];

const appId =
  platform === 'ios'
    ? config.expo?.ios?.bundleIdentifier
    : platform === 'android'
      ? config.expo?.android?.package
      : config.expo?.ios?.bundleIdentifier === config.expo?.android?.package
        ? config.expo?.ios?.bundleIdentifier
        : undefined;

if (!appId) {
  throw new Error('Could not determine app ID.');
}

const scheme = `${config.expo?.scheme}://`;
const ci = process.env.CI === 'true' || process.env.CI === '1';
const flows = await getFlows(new URL('example/e2e/maestro/', root));
const maxAttempts = ci ? 4 : 1;
const results: FlowResult[] = [];

await fs.mkdir(artifactsDir, { recursive: true });

for (const flow of flows) {
  let result: FlowResult | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    result = await runFlow(flow, attempt);
    results.push(result);

    if (result.exitCode === 0) {
      break;
    }

    if (attempt < maxAttempts) {
      process.stdout.write(`Retrying ${flow} (${attempt}/${maxAttempts})...\n`);
    }
  }

  if (result?.exitCode !== 0 && !ci) {
    break;
  }
}

if (ci) {
  await writeJUnit(results);
}

const failed = latestResults(results).filter((result) => result.exitCode !== 0);

if (failed.length > 0) {
  process.stderr.write(
    `Failed agent-device flows:\n${failed
      .map((result) => `- ${result.flow}`)
      .join('\n')}\n`
  );
}

process.exit(failed.length > 0 ? 1 : 0);

type FlowResult = {
  attempt: number;
  durationMs: number;
  exitCode: number;
  flow: string;
  logFile: string;
};

async function getFlows(dir: URL): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map((entry) => path.join('e2e', 'maestro', entry.name))
    .sort();
}

async function runFlow(flow: string, attempt: number): Promise<FlowResult> {
  const args = [
    agentDeviceBin,
    'replay',
    '--maestro',
    '-e',
    `APP_ID=${appId}`,
    '-e',
    `APP_SCHEME=${scheme}`,
  ];

  if (platform) {
    args.push('--platform', platform);
  }

  args.push(flow);

  process.stdout.write(`Running agent-device with args: ${args.join(' ')}\n`);

  const startedAt = Date.now();
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  const durationMs = Date.now() - startedAt;
  const logFile = `${sanitize(flow)}-attempt-${attempt}.log`;
  const log = [
    `$ ${[process.execPath, ...args].join(' ')}`,
    '',
    result.stdout ?? '',
    result.stderr ?? '',
  ].join('\n');

  await fs.writeFile(new URL(logFile, artifactsDir), log);

  return {
    attempt,
    durationMs,
    exitCode: result.status ?? 1,
    flow,
    logFile,
  };
}

function latestResults(results: FlowResult[]): FlowResult[] {
  return [...new Map(results.map((result) => [result.flow, result])).values()];
}

async function writeJUnit(results: FlowResult[]) {
  const latest = latestResults(results);
  const failures = latest.filter((result) => result.exitCode !== 0);
  const tests = latest
    .map((result) => {
      const failure =
        result.exitCode === 0
          ? ''
          : `<failure message="agent-device exited with code ${result.exitCode}">See ${escapeXml(
              result.logFile
            )}</failure>`;

      return `<testcase classname="agent-device" name="${escapeXml(
        result.flow
      )}" time="${(result.durationMs / 1000).toFixed(3)}">${failure}</testcase>`;
    })
    .join('\n');

  await fs.writeFile(
    new URL('junit.xml', artifactsDir),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<testsuite name="agent-device" tests="${latest.length}" failures="${failures.length}">`,
      tests,
      '</testsuite>',
    ].join('\n')
  );
}

function sanitize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
}
