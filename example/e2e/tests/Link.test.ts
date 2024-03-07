import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:19006');
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
    name: 'Go to Albums',
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
    name: 'Replace with Albums',
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

test('correct hash for navigation', async ({ page }) => {
  await page.waitForURL('**/link-component/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  const addHashText = page.getByText('Add hash to current URL');
  expect(addHashText).toBeVisible();

  await addHashText.click();

  await page.waitForURL('**/link-component/article/gandalf#frodo');

  const updateParamsButton = page.getByRole('button', {
    name: 'Update author param',
  });
  expect(updateParamsButton).toBeVisible();

  updateParamsButton.click();

  await page.waitForURL('**/link-component/article/bilbo-baggins#frodo');
  await expect(page).toHaveTitle(
    'Article by Bilbo Baggins - React Navigation Example'
  );

  const link = page.getByRole('link', {
    name: 'Replace with Albums',
  });

  await expect(link).toHaveAttribute('href', '/link-component/albums');

  await link.click();

  await page.waitForURL('**/link-component/albums');
});
