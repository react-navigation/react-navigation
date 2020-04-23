module.exports = {
  testRegex: '/__integration_tests__/.*\\.(test|spec)\\.(js|tsx?)$',
  globalSetup: './e2e/config/setup-server.tsx',
  globalTeardown: './e2e/config/teardown-server.tsx',
  setupFilesAfterEnv: ['./e2e/config/setup-playwright.tsx'],
};
