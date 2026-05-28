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
const flows = await getFlows(new URL('e2e/maestro/', cwd));
const maxAttempts = ci ? 4 : 1;
const results: FlowResult[] = [];

await fs.mkdir(artifactsDir, { recursive: true });
await fs.mkdir(new URL('agent-device-state/', cwd), { recursive: true });

const preflight = await runAgentDevice('devices', [], 'preflight-daemon.log');

if (preflight.exitCode !== 0) {
  process.stderr.write(
    `Failed to start agent-device before running ${flows.length} flows. See ${preflight.logFile}.\n`
  );

  if (ci) {
    await writeJUnit([
      {
        attempt: 1,
        durationMs: preflight.durationMs,
        exitCode: preflight.exitCode,
        flow: 'agent-device daemon preflight',
        logFile: preflight.logFile,
        output: preflight.output,
      },
    ]);
  }

  process.exit(preflight.exitCode);
}

for (const flow of flows) {
  let result: FlowResult | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    result = await runFlow(flow, attempt);
    results.push(result);

    if (result.exitCode === 0) {
      break;
    }

    if (isDaemonStartupFailure(result.output)) {
      process.stderr.write(
        `Stopping after ${flow} because agent-device daemon startup failed.\n`
      );
      await finish(results);
    }

    if (attempt < maxAttempts) {
      process.stdout.write(`Retrying ${flow} (${attempt}/${maxAttempts})...\n`);
    }
  }

  if (result?.exitCode !== 0 && !ci) {
    break;
  }
}

await finish(results);

type CommandResult = {
  durationMs: number;
  exitCode: number;
  logFile: string;
  output: string;
};

type FlowResult = CommandResult & {
  attempt: number;
  flow: string;
};

async function finish(results: FlowResult[]): Promise<never> {
  if (ci) {
    await writeJUnit(results);
  }

  const failed = latestResults(results).filter(
    (result) => result.exitCode !== 0
  );

  if (failed.length > 0) {
    process.stderr.write(
      `Failed agent-device flows:\n${failed
        .map((result) => `- ${result.flow}`)
        .join('\n')}\n`
    );
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

async function getFlows(dir: URL): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.yml'))
    .map((entry) => path.join('e2e', 'maestro', entry.name))
    .sort();
}

async function runFlow(flow: string, attempt: number): Promise<FlowResult> {
  const result = await runAgentDevice(
    'replay',
    ['--maestro', '-e', `APP_ID=${appId}`, '-e', `APP_SCHEME=${scheme}`, flow],
    `${sanitize(flow)}-attempt-${attempt}.log`
  );

  return {
    ...result,
    attempt,
    flow,
  };
}

async function runAgentDevice(
  command: string,
  commandArgs: string[],
  logFile: string
): Promise<CommandResult> {
  const args = [agentDeviceBin, command, ...commandArgs];

  if (platform) {
    args.push('--platform', platform);
  }

  process.stdout.write(`Running agent-device with args: ${args.join(' ')}\n`);

  const startedAt = Date.now();
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      AGENT_DEVICE_STATE_DIR: 'agent-device-state',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const output = [result.stdout ?? '', result.stderr ?? ''].join('\n');

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  await fs.writeFile(
    new URL(logFile, artifactsDir),
    [`$ ${[process.execPath, ...args].join(' ')}`, '', output].join('\n')
  );

  return {
    durationMs: Date.now() - startedAt,
    exitCode: result.status ?? 1,
    logFile,
    output,
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

function isDaemonStartupFailure(output: string) {
  return (
    output.includes('Failed to start daemon') ||
    output.includes('did not observe reachable daemon metadata')
  );
}
