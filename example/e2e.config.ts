import process from 'node:process';

import { mobile } from '@e2e-dev/mobile';
import { web } from '@e2e-dev/web';
import { gateway } from 'ai';
import type { E2EConfig } from 'e2e';

import appConfig from './app.json' with { type: 'json' };

const viewport = { width: 390, height: 844 };

const webApp = {
  url: 'http://127.0.0.1:0',
  command: {
    executable: 'pnpm',
    args: ['web', '--host', '127.0.0.1', '--port', '{port}', '--strictPort'],
    startupTimeout: 120_000,
    log: '.e2e/logs/web.log',
  },
  // Probing a server-rendered page aborts the stream midway and shows an error overlay
  readyUrl: 'http://127.0.0.1:{port}/@vite/client',
};

const metro = {
  executable: 'pnpm',
  args: ['start', '--port', '8081'],
  env: { CI: '1' },
  startupTimeout: 600_000,
  reuseExisting: true,
  log: '.e2e/logs/metro.log',
};

// Wait for navigation transitions to finish after an action
const settle = 500;

const bundleUrl = (platform: 'ios' | 'android') =>
  `http://localhost:8081/.expo/.virtual-metro-entry.bundle?platform=${platform}&dev=true&minify=false`;

// Annotated since the inferred model type isn't portable for declarations
const config: E2EConfig = {
  tests: 'e2e/tests/**/*.e2e.ts',
  targets: [
    {
      name: 'chromium',
      engine: web({ viewport }),
      app: webApp,
    },
    {
      name: 'firefox',
      engine: web({ browser: 'firefox', viewport }),
      app: webApp,
    },
    {
      name: 'ios',
      engine: mobile({
        platform: 'ios',
        device: process.env.E2E_IOS_DEVICE,
        settle,
      }),
      app: {
        bundleId: appConfig.expo.ios.bundleIdentifier,
        command: metro,
        readyUrl: bundleUrl('ios'),
      },
    },
    {
      name: 'android',
      engine: mobile({
        platform: 'android',
        device: process.env.E2E_ANDROID_DEVICE,
        settle,
      }),
      app: {
        bundleId: appConfig.expo.android.package,
        command: metro,
        readyUrl: bundleUrl('android'),
      },
    },
  ],
  timeout: 180_000,
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      context:
        'The React Navigation example app. It showcases navigators such as stacks, tabs and drawers.',
    },
  },
};

export default config;
