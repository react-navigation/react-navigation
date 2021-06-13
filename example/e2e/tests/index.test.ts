import { expect, it } from './baseFixture';

it('loads the example app', async ({ page }) => {
  const snapshot = await page.accessibility.snapshot();

  expect(
    (snapshot?.children as Record<string, unknown>[])?.find(
      (it) => it.role === 'heading'
    )?.name
  ).toBe('Examples');
  const title = await page.$eval('[role=heading]', (el) => el.textContent);

  expect(title).toBe('Examples');
});
