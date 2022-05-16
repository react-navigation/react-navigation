import type { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
  testDir: path.join(__dirname, 'tests'),
  globalSetup: require.resolve('./config/setup-server.ts'),
  globalTeardown: require.resolve('./config/teardown-server.ts'),
  workers: 1,
  reporter: 'list',
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
  ],
};

export default config;
