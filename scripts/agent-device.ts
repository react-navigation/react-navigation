import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import config from '../example/app.json' with { type: 'json' };

const root = new URL('..', import.meta.url);
const cwd = new URL('example/', root);
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

await fs.mkdir(new URL('agent-device-artifacts/', cwd), { recursive: true });

const args = [
  agentDeviceBin,
  'test',
  ...flows,
  '--maestro',
  '-e',
  `APP_ID=${appId}`,
  '-e',
  `APP_SCHEME=${scheme}`,
  '--artifacts-dir',
  'agent-device-artifacts',
];

if (platform) {
  args.push('--platform', platform);
}

if (ci) {
  args.push(
    '--retries',
    '3',
    '--report-junit',
    'agent-device-artifacts/junit.xml'
  );
}

process.stdout.write(`Running agent-device with args: ${args.join(' ')}\n`);

const result = spawnSync(process.execPath, args, {
  cwd,
  stdio: ['ignore', 'inherit', 'inherit'],
});

process.exit(result.status ?? 1);

async function getFlows(dir: URL): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map((entry) => path.join('e2e', 'maestro', entry.name))
    .sort();
}
