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
});
