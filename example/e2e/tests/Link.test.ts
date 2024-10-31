import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('<Link />').click();
});

test('loads the article screen', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();

  await expect(page.getByRole('link', { name: 'Go to Home' })).toHaveAttribute(
    'href',
    '/'
  );
});

test('goes to the album screen and goes back', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');

  const link = page.getByRole('link', {
    name: 'Go to albums',
  });

  await expect(link).toHaveAttribute('href', '/link-component/albums');

  await link.click();

  await page.waitForURL('**/link-component/albums');

  await expect(page).toHaveTitle('Albums - React Navigation Example');

  await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();

  await expect(page.getByLabel('Home, back')).not.toBeVisible();

  await page.getByLabel('Article by Gandalf, back').click();

  await page.waitForURL('**/link-component/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();
});

test('replaces article with the album screen', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');

  const link = page.getByRole('link', {
    name: 'Replace with albums',
  });

  await expect(link).toHaveAttribute('href', '/link-component/albums');

  await link.click();

  await page.waitForURL('**/link-component/albums');

  await expect(page).toHaveTitle('Albums - React Navigation Example');

  await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();

  await expect(page.getByLabel('Article by Gandalf, back')).not.toBeVisible();

  // FIXME: workaround for waiting for the transition to finish
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  await page.getByLabel('Home, back').click();

  await page.waitForURL('**/');
});

test('preserves hash for navigation', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');

  await page.getByText('Add hash to URL').click();

  await page.waitForURL('**/link-component/article/gandalf#frodo');

  await page.getByRole('button', { name: 'Update params' }).click();

  await page.waitForURL('**/link-component/article/babel-fish#frodo');

  await page.reload();

  await page.waitForURL('**/link-component/article/babel-fish#frodo');

  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );

  await page.getByRole('link', { name: 'Replace with albums' }).click();

  await page.waitForURL('**/link-component/albums');
});
