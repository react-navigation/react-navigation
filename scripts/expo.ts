import { spawnSync } from 'node:child_process';
import path from 'node:path';

// eslint-disable-next-line import-x/no-extraneous-dependencies
import { getConfig } from '@expo/config';

const project = path.join(import.meta.dirname, '../example');

const { exp } = getConfig(project, {
  skipSDKVersionRequirement: true,
});

const port = String(exp.extra?.metroPort);
const result = spawnSync('expo', [...process.argv.slice(2), '--port', port], {
  cwd: project,
  stdio: 'inherit',
  env: {
    ...process.env,
    RCT_METRO_PORT: port,
  },
});

process.exit(result.status ?? 1);
