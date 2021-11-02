import { test as baseTest } from '@playwright/test';

const test = baseTest.extend({
  page: async ({ page }, use) => {
    await page.goto('http://localhost:3579');
    await use(page);
  },
});

export const it = test;
export const expect = test.expect;
