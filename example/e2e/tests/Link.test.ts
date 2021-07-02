import type { Page } from '@playwright/test';

import { expect, it } from './baseFixture';

it.beforeEach(async ({ page }) => {
  await page.click('[data-testid=LinkComponent]');
});

const waitAndAssertPageHeading = async (
  page: Page,
  expectedHeading: string
) => {
  await page.waitForSelector(`text=${expectedHeading}`);
  const heading = (await page.accessibility.snapshot())?.children?.find(
    (it) => it.role === 'heading'
  )?.name;
  expect(heading).toBe(expectedHeading);
};

it('loads the article page', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');
  expect(await page.title()).toBe(
    'Article by Gandalf - React Navigation Example'
  );
  await waitAndAssertPageHeading(page, 'Article by Gandalf');
});

it('goes to the album page and goes back', async ({ page }) => {
  await page.click('[href="/link-component/music"]');

  await page.waitForURL('**/link-component/music');
  expect(await page.title()).toBe('Albums - React Navigation Example');
  await waitAndAssertPageHeading(page, 'Albums');

  await page.click('[aria-label="Article by Gandalf, back"]');
  await page.waitForNavigation();

  await page.waitForURL('**/link-component/article/gandalf');
  expect(await page.title()).toBe(
    'Article by Gandalf - React Navigation Example'
  );
  await waitAndAssertPageHeading(page, 'Article by Gandalf');
});
