import { execSync, spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

import config from '../example/app.json' with { type: 'json' };

const root = new URL('..', import.meta.url);

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
const flowByFilename = new Map(
  flows.map((flow) => [path.basename(flow, path.extname(flow)), flow])
);

const cwd = new URL('example/', root);
const debugOutputDir = new URL('example/maestro-debug-output/', root);

const deviceIds = platform ? undefined : await getConnectedDeviceIds();

if (!platform && !deviceIds?.length) {
  throw new Error('No connected devices found');
}

let result = runMaestro(['e2e/maestro'], {
  appId,
  scheme,
  cwd,
  platform,
  deviceIds,
  ci,
});

if (ci && result.exitCode !== 0) {
  let failedFlows = await getFailedFlows({
    debugOutputDir,
    flowByFilename,
    since: result.startedAt,
  });

  for (let attempt = 1; attempt <= 3 && failedFlows.length > 0; attempt += 1) {
    process.stdout.write(`Retry #${attempt}...\n`);

    result = runMaestro(failedFlows, {
      appId,
      scheme,
      cwd,
      platform,
      deviceIds,
      ci,
    });

    if (result.exitCode === 0) {
      failedFlows = [];
      break;
    }

    failedFlows = await getFailedFlows({
      debugOutputDir,
      flowByFilename,
      since: result.startedAt,
    });
  }
}

process.exit(result.exitCode);

async function getFlows(dir: URL): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map((entry) => path.join('e2e', 'maestro', entry.name))
    .sort();
}

async function getConnectedDeviceIds(): Promise<string[]> {
  const ids: string[] = [];

  try {
    const data = JSON.parse(
      execSync('xcrun simctl list devices booted --json').toString()
    ) as {
      devices: Record<string, { state: string; udid: string }[]>;
    };
    const iosIds = Object.values(data.devices)
      .flat()
      .filter((d) => d.state === 'Booted')
      .map((d) => d.udid);

    ids.push(...iosIds);
  } catch {
    // No iOS devices available
  }

  try {
    const androidIds = execSync('adb devices')
      .toString()
      .split('\n')
      .slice(1)
      .map((line) => line.split('\t')[0].trim())
      .filter((id) => id.length > 0);

    ids.push(...androidIds);
  } catch {
    // No Android devices available
  }

  return ids;
}

function runMaestro(
  flows: string[],
  options: {
    appId: string;
    scheme: string;
    cwd: URL;
    platform: string | undefined;
    deviceIds: string[] | undefined;
    ci: boolean;
  }
): { exitCode: number; startedAt: number } {
  const args: string[] = [];

  if (options.platform) {
    args.push('--platform', options.platform);
  } else if (options.deviceIds) {
    args.push('--device', options.deviceIds.join(','));
  }

  args.push(
    'test',
    '--debug-output',
    'maestro-debug-output',
    '-e',
    `APP_ID=${options.appId}`,
    '-e',
    `APP_SCHEME=${options.scheme}`
  );

  if (options.deviceIds) {
    args.push('--shard-all', String(options.deviceIds.length));
  }

  if (options.ci) {
    args.push('--flatten-debug-output');
  }

  args.push(...flows);

  process.stdout.write(`Running Maestro with args: ${args.join(' ')}\n`);

  const startedAt = Date.now();
  const result = spawnSync('maestro', args, {
    cwd: options.cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  return { exitCode: result.status ?? 1, startedAt };
}

async function getFailedFlows(options: {
  debugOutputDir: URL;
  flowByFilename: Map<string, string>;
  since: number;
}): Promise<string[]> {
  const files = await getCommandFiles(options.debugOutputDir, options.since);
  const failed = new Set<string>();

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    let entries: unknown;

    try {
      entries = JSON.parse(content);
    } catch {
      continue;
    }

    if (!Array.isArray(entries)) {
      continue;
    }

    let filename: string | undefined;
    let hasFailure = false;

    for (const entry of entries) {
      const item = entry as {
        command?: {
          defineVariablesCommand?: { env?: { MAESTRO_FILENAME?: string } };
        };
        metadata?: { status?: string };
      };

      if (item.metadata?.status === 'FAILED') {
        hasFailure = true;
      }

      const env = item.command?.defineVariablesCommand?.env;

      if (!filename && env?.MAESTRO_FILENAME) {
        filename = env.MAESTRO_FILENAME;
      }
    }

    if (hasFailure && filename) {
      const flow = options.flowByFilename.get(filename);

      if (flow) {
        failed.add(flow);
      }
    }
  }

  return [...failed];
}

async function getCommandFiles(dir: URL, since: number): Promise<URL[]> {
  const files: URL[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryUrl = new URL(entry.name, dir);

      if (entry.isDirectory()) {
        files.push(
          ...(await getCommandFiles(new URL(`${entry.name}/`, dir), since))
        );
        continue;
      }

      if (!entry.isFile() || !/^commands-.*\.json$/i.test(entry.name)) {
        continue;
      }

      const stat = await fs.stat(entryUrl);

      if (stat.mtimeMs < since - 1000) {
        continue;
      }

      files.push(entryUrl);
    }
  } catch {
    return files;
  }

  return files;
}
