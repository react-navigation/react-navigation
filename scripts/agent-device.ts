import { execSync, spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
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
const ciTimeoutMs = process.env.AGENT_DEVICE_E2E_TIMEOUT_MS ?? '240000';
const ciRetries = process.env.AGENT_DEVICE_E2E_RETRIES ?? '3';
const testInputs = (process.env.AGENT_DEVICE_E2E_INPUTS ?? 'e2e/maestro')
  .split(/\s+/)
  .filter(Boolean);
const deviceIds = platform ? undefined : getConnectedDeviceIds();

if (!platform && !deviceIds?.length) {
  throw new Error('No connected devices found');
}

await fs.mkdir(new URL('agent-device-artifacts/', cwd), { recursive: true });
await fs.mkdir(new URL('agent-device-state/', cwd), { recursive: true });

const args = [
  agentDeviceBin,
  'test',
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
} else if (deviceIds) {
  args.push(
    '--device',
    deviceIds.join(','),
    '--shard-all',
    String(deviceIds.length)
  );
}

if (ci) {
  args.push(
    '--verbose',
    '--timeout',
    ciTimeoutMs,
    '--retries',
    ciRetries,
    '--report-junit',
    'agent-device-artifacts/junit.xml'
  );
}

if (process.env.AGENT_DEVICE_E2E_RECORD_VIDEO === 'true') {
  args.push('--record-video');
}

args.push(...testInputs);

process.stdout.write(`Running agent-device with args: ${args.join(' ')}\n`);

const result = spawnSync(process.execPath, args, {
  cwd,
  env: {
    ...process.env,
    AGENT_DEVICE_STATE_DIR: 'agent-device-state',
  },
  stdio: ['ignore', 'inherit', 'inherit'],
});

process.exit(result.status ?? 1);

function getConnectedDeviceIds(): string[] {
  const ids: string[] = [];

  try {
    const data = JSON.parse(
      execSync('xcrun simctl list devices booted --json').toString()
    ) as {
      devices: Record<string, { state: string; udid: string }[]>;
    };
    const iosIds = Object.values(data.devices)
      .flat()
      .filter((device) => device.state === 'Booted')
      .map((device) => device.udid);

    ids.push(...iosIds);
  } catch {
    // No iOS devices available
  }

  try {
    const androidIds = execSync('adb devices')
      .toString()
      .split('\n')
      .slice(1)
      .map((line) => line.split('\t')[0]?.trim() ?? '')
      .filter((id) => id.length > 0);

    ids.push(...androidIds);
  } catch {
    // No Android devices available
  }

  return ids;
}
