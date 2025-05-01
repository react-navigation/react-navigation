import { expect, test } from '@playwright/test';

test('pops to the proper screen after going back and forward in history', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  const buttonToFeed = page.getByRole('button', {
    name: 'Navigate to feed',
  });

  await buttonToFeed.click();

  await page.goBack();

  await page.goForward();

  const buttonGoBack = page.getByRole('button', {
    name: 'Go back',
  });

  // After click, we have [not-found, home] on history stack
  await buttonGoBack.click();

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();
});

test('go back to the proper history entry after popping nested stack', async ({
  page,
}) => {
  await page.goto('/not-found');

  const buttonGoToHome = page.getByRole('button', {
    name: 'Go to home',
  });

  // After click, we have [not-found, home] on history stack
  await buttonGoToHome.click();

  const button = page.getByRole('button', {
    name: 'Simple Stack',
  });

  // Open nested stack
  await button.click();

  const buttonToFeed = page.getByRole('button', {
    name: 'Navigate to feed',
  });

  // Push second screen to the nested stack
  // After click, we have [not-found, home, article, feed] on history stack
  await buttonToFeed.click();

  const buttonPopToHome = page.getByRole('button', {
    name: 'Pop to home',
  });

  // After click, we have [not-found, home] on history stack
  await buttonPopToHome.click();

  await expect(page).toHaveTitle('Examples - React Navigation Example');

  await expect(page.getByRole('heading', { name: 'Examples' })).toBeVisible();

  await page.goBack();

  await expect(page).toHaveTitle('Oops! - React Navigation Example');

  await expect(page.getByRole('heading', { name: 'Oops!' })).toBeVisible();
});
