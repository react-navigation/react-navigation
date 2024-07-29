import { defineConfig } from '@playwright/test';
import path from 'path';

const PORT = process.env.CI ? 3579 : 19006;

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      cwd: path.join(__dirname, '..'),
      command: process.env.CI
        ? `yarn serve --no-port-switching --single --listen ${PORT} dist`
        : `yarn start --web --port ${PORT}`,
      url: `http://127.0.0.1:${PORT}`,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'yarn server',
      url: 'http://127.0.0.1:3275',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
