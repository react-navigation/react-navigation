import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { URL } from 'node:url';
import { parseArgs } from 'node:util';

import config from '../example/app.json' with { type: 'json' };

const DEBUG_OUTPUT_DIR = 'maestro-debug-output';

const root = new URL('..', import.meta.url);

const { values, tokens } = parseArgs({
  options: {
    platform: { type: 'string' },
    retry: { type: 'string' },
  },
  allowPositionals: true,
  tokens: true,
  strict: false,
});

const platform = values.platform;

if (platform !== 'ios' && platform !== 'android') {
  throw new Error('--platform ios or --platform android is required');
}

const retryCount =
  typeof values.retry === 'string' ? parseInt(values.retry, 10) || 1 : 0;

const flows = tokens
  .filter((token) => token.kind === 'positional')
  .map((token) => token.value);

const forwardedArgs = tokens.reduce<string[]>((acc, token) => {
  if (
    token.kind !== 'option' ||
    token.name === 'platform' ||
    token.name === 'retry'
  ) {
    return acc;
  }

  return token.value != null
    ? [...acc, token.rawName, token.value]
    : [...acc, token.rawName];
}, []);

const appId =
  platform === 'ios'
    ? config.expo?.ios?.bundleIdentifier
    : config.expo?.android?.package;

if (!appId) {
  throw new Error('Could not determine app ID.');
}

const scheme = `${config.expo?.scheme}://`;

const cwd = new URL('example/', root);
const reportFile = new URL(`example/${DEBUG_OUTPUT_DIR}/report.json`, root);

let result = runMaestro(flows.length > 0 ? flows : ['e2e/maestro'], {
  appId,
  scheme,
  cwd,
  platform,
  forwardedArgs,
});

if (retryCount > 0 && result !== 0) {
  let failedFlows = await getFailedFlows(reportFile);

  for (
    let attempt = 1;
    attempt <= retryCount && failedFlows.length > 0;
    attempt += 1
  ) {
    process.stdout.write(`Retry #${attempt}...\n`);

    result = runMaestro(failedFlows, {
      appId,
      scheme,
      cwd,
      platform,
      forwardedArgs,
    });

    if (result === 0) {
      break;
    }

    failedFlows = await getFailedFlows(reportFile);
  }
}

process.exit(result);

function runMaestro(
  flows: string[],
  options: {
    appId: string;
    scheme: string;
    cwd: URL;
    platform: 'ios' | 'android';
    forwardedArgs: string[];
  }
): number {
  const maestroArgs: string[] = [
    '--platform',
    options.platform,
    'test',
    '--output',
    DEBUG_OUTPUT_DIR,
    '-e',
    `APP_ID=${options.appId}`,
    '-e',
    `APP_SCHEME=${options.scheme}`,
    ...options.forwardedArgs,
    ...flows,
  ];

  if (options.platform === 'android') {
    maestroArgs.unshift('--driver', 'devicelab');
  }

  process.stdout.write(
    `Running maestro-runner with args: ${maestroArgs.join(' ')}\n`
  );

  const result = spawnSync('maestro-runner', maestroArgs, {
    cwd: options.cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  return result.status ?? 1;
}

async function getFailedFlows(reportFile: URL): Promise<string[]> {
  const content = await fs.readFile(reportFile, 'utf8');
  const report = JSON.parse(content) as {
    flows: { sourceFile: string; status: string }[];
  };

  return report.flows
    .filter((flow) => flow.status === 'failed')
    .map((flow) => flow.sourceFile);
}
