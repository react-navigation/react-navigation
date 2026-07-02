import process from 'node:process';

import { defineConfig } from '@playwright/test';
import path from 'path';

const PORT = 5173;

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  timeout: 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : null),
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
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      cwd: path.join(__dirname, '..'),
      command: `pnpm web --port ${PORT}`,
      url: `http://localhost:${PORT}`,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      cwd: path.join(__dirname, '..'),
      command: 'pnpm server',
      url: 'http://localhost:3275',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
