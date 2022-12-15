import { expect, it } from './baseFixture';

it.beforeEach(async ({ page }) => {
  await page.click('[data-testid=LinkComponent]');
});

it('loads the article page', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');

  expect(await page.title()).toBe(
    'Article by Gandalf - React Navigation Example'
  );

  expect(
    await page.getByRole('heading', { name: 'Article by Gandalf' }).isVisible()
  ).toBe(true);
});

it('goes to the album page and goes back', async ({ page }) => {
  await page.click('[href="/link-component/music"]');

  await page.waitForURL('**/link-component/music');

  expect(await page.title()).toBe('Albums - React Navigation Example');

  expect(await page.getByRole('heading', { name: 'Albums' }).isVisible()).toBe(
    true
  );

  await page.click('[aria-label="Article by Gandalf, back"]');

  await page.waitForURL('**/link-component/article/gandalf');

  expect(await page.title()).toBe(
    'Article by Gandalf - React Navigation Example'
  );

  expect(
    await page.getByRole('heading', { name: 'Article by Gandalf' }).isVisible()
  ).toBe(true);
});
