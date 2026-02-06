import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

import config from '../example/app.json' with { type: 'json' };

const root = new URL('..', import.meta.url);

const platformIndex = process.argv.indexOf('--platform');
const platform =
  platformIndex === -1 ? undefined : process.argv[platformIndex + 1];

if (platform !== 'ios' && platform !== 'android') {
  throw new Error('Expected --platform ios|android');
}

const appId =
  platform === 'ios'
    ? config.expo?.ios?.bundleIdentifier
    : config.expo?.android?.package;

const scheme = `${config.expo?.scheme}://`;
const ci = process.env.CI === 'true' || process.env.CI === '1';

const flows = await getFlows(new URL('example/e2e/maestro/', root));
const flowByFilename = new Map(
  flows.map((flow) => [path.basename(flow, path.extname(flow)), flow])
);

const cwd = new URL('example/', root);
const debugOutputDir = new URL('example/maestro-debug-output/', root);

let result = await runMaestro(['e2e/maestro'], {
  appId,
  scheme,
  cwd,
  platform,
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

    result = await runMaestro(failedFlows, {
      appId,
      scheme,
      cwd,
      platform,
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

function runMaestro(
  flows: string[],
  options: {
    appId: string;
    scheme: string;
    cwd: URL;
    platform: string;
    ci: boolean;
  }
): Promise<{ exitCode: number; startedAt: number }> {
  const args = [
    '--platform',
    options.platform,
    'test',
    '--debug-output',
    'maestro-debug-output',
    '-e',
    `APP_ID=${options.appId}`,
    '-e',
    `APP_SCHEME=${options.scheme}`,
  ];

  if (options.ci) {
    args.push('--flatten-debug-output');
  }

  args.push(...flows);

  return new Promise((resolve) => {
    const startedAt = Date.now();

    const child = spawn('maestro', args, {
      cwd: options.cwd,
      stdio: ['ignore', 'inherit', 'inherit'],
    });

    child.on('close', (code) => {
      resolve({ exitCode: code ?? 1, startedAt });
    });

    child.on('error', () => {
      resolve({ exitCode: 1, startedAt });
    });
  });
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
