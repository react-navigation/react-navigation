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

  const button = page.getByTestId('StackBasic').filter({ visible: true });

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

test('keeps browser history in sync when prevented browser back is continued', async ({
  browserName,
  page,
}) => {
  await page.goto('/');

  const cdpSession =
    browserName === 'chromium'
      ? await page.context().newCDPSession(page)
      : undefined;

  const initialHistoryLength = await page.evaluate(() => window.history.length);

  await expect(page).toHaveURL('/');

  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength
  );

  if (cdpSession) {
    expect(
      (await cdpSession.send('Page.getNavigationHistory')).currentIndex
    ).toBe(1);
  }

  await page
    .getByTestId('NativeStackPreventRemove')
    .filter({ visible: true })
    .click();

  await expect(page).toHaveURL('/native-stack-prevent-remove/input');

  const inputHistoryLength = initialHistoryLength + 1;

  expect(await page.evaluate(() => window.history.length)).toBe(
    inputHistoryLength
  );

  if (cdpSession) {
    expect(
      (await cdpSession.send('Page.getNavigationHistory')).currentIndex
    ).toBe(2);
  }

  await expect(page.getByText('Discard and go back')).toBeVisible();

  await page.getByPlaceholder('Type something…').fill('hello');

  await expect(page.getByPlaceholder('Type something…')).toHaveValue('hello');

  await Promise.all([
    page.waitForEvent('dialog').then((dialog) => {
      expect(dialog.message()).toBe(
        'You have unsaved changes. Discard them and leave the screen?'
      );

      return dialog.dismiss();
    }),
    page.goBack(),
  ]);

  await expect(page).toHaveURL('/native-stack-prevent-remove/input');

  expect(await page.evaluate(() => window.history.length)).toBe(
    inputHistoryLength
  );

  if (cdpSession) {
    expect(
      (await cdpSession.send('Page.getNavigationHistory')).currentIndex
    ).toBe(2);
  }

  await Promise.all([
    page.waitForEvent('dialog').then((dialog) => {
      expect(dialog.message()).toBe(
        'You have unsaved changes. Discard them and leave the screen?'
      );

      return dialog.accept();
    }),
    page.goBack(),
  ]);

  await expect(page).toHaveURL('/');

  expect(await page.evaluate(() => window.history.length)).toBe(
    inputHistoryLength
  );

  if (cdpSession) {
    expect(
      (await cdpSession.send('Page.getNavigationHistory')).currentIndex
    ).toBe(1);
  }
});
