import { expect, it } from './baseFixture';

it('loads the example app', async ({ page }) => {
  expect(await page.title()).toBe('Examples - React Navigation Example');

  expect(
    await page.getByRole('heading', { name: 'Examples' }).isVisible()
  ).toBe(true);
});
