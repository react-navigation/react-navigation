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

test('restores browser forward entry after programmatic go back', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);
  await expect(page).toHaveTitle('Feed - React Navigation Example');

  const feedUrl = page.url();

  await page
    .getByRole('button', {
      name: 'Go back',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/article/gandalf');
  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await page.goForward();

  await expect(page).toHaveURL(feedUrl);
  await expect(page).toHaveTitle('Feed - React Navigation Example');
});

test('keeps state in sync when browser back and forward interrupt navigation', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  await page.evaluate(() => {
    const goForward = () => {
      window.removeEventListener('popstate', goForward);
      window.history.forward();
    };

    window.addEventListener('popstate', goForward);
    window.history.back();
  });

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);
  await expect(page).toHaveTitle('Feed - React Navigation Example');

  await page
    .getByRole('button', {
      name: 'Go back',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/article/gandalf');
  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );
});

test('replaces the current browser history entry on replace', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  await page
    .getByRole('button', {
      name: 'Replace with contacts',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/contacts');
  await expect(page).toHaveTitle('Contacts - React Navigation Example');

  await page.goBack();

  await expect(page).toHaveURL('/native-stack/article/gandalf');
  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await page.goForward();

  await expect(page).toHaveURL('/native-stack/contacts');
  await expect(page).toHaveTitle('Contacts - React Navigation Example');
});

test('truncates browser forward history after navigating from a previous entry', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  const buttonToFeed = page.getByRole('button', {
    name: 'Navigate to feed',
  });

  await buttonToFeed.click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  const firstFeedUrl = page.url();

  await page.goBack();

  await expect(page).toHaveURL('/native-stack/article/gandalf');

  await buttonToFeed.click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);
  await expect(page).not.toHaveURL(firstFeedUrl);

  const secondFeedUrl = page.url();

  await page.goForward();

  await expect(page).toHaveURL(secondFeedUrl);
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
    .getByRole('button', { name: 'Prevent removing screen in Native Stack' })
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

test('replaces browser history entry when params are updated with setParams', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  const historyLength = await page.evaluate(() => window.history.length);

  await page.getByRole('button', { name: 'Update params' }).click();

  await expect(page).toHaveURL('/native-stack/article/babel-fish');
  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );

  expect(await page.evaluate(() => window.history.length)).toBe(historyLength);

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  await page.goBack();

  await expect(page).toHaveURL('/native-stack/article/babel-fish');
  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );
});

test('syncs browser history when switching tabs with fullHistory back behavior', async ({
  page,
}) => {
  await page.goto('/full-history-tabs');

  await expect(page).toHaveURL('/full-history-tabs/first');
  await expect(page.getByText('Tab First (-)')).toBeVisible();

  await page
    .getByRole('button', { name: 'Navigate to Second' })
    .filter({ visible: true })
    .click();

  await expect(page).toHaveURL('/full-history-tabs/second/1');
  await expect(page.getByText('Tab Second (1)')).toBeVisible();

  await page
    .getByRole('button', { name: 'Navigate to Third' })
    .filter({ visible: true })
    .click();

  await expect(page).toHaveURL('/full-history-tabs/third/2');
  await expect(page.getByText('Tab Third (2)')).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL('/full-history-tabs/second/1');
  await expect(page.getByText('Tab Second (1)')).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL('/full-history-tabs/first');
  await expect(page.getByText('Tab First (-)')).toBeVisible();

  await page.goForward();

  await expect(page).toHaveURL('/full-history-tabs/second/1');
  await expect(page.getByText('Tab Second (1)')).toBeVisible();

  await page
    .getByRole('button', { name: 'Go back' })
    .filter({ visible: true })
    .click();

  await expect(page).toHaveURL('/full-history-tabs/first');
  await expect(page.getByText('Tab First (-)')).toBeVisible();

  await page.goForward();

  await expect(page).toHaveURL('/full-history-tabs/second/1');
  await expect(page.getByText('Tab Second (1)')).toBeVisible();
});

test('goes back to matching history entry when popping multiple screens', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  await page
    .getByRole('button', {
      name: 'Replace with contacts',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/contacts');

  await page
    .getByRole('button', {
      name: 'Push albums',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/albums');
  await expect(page).toHaveTitle('Albums - React Navigation Example');

  await page
    .getByRole('button', {
      name: 'Pop by 2',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/article/gandalf');
  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await page.goForward();

  await expect(page).toHaveURL('/native-stack/contacts');
  await expect(page).toHaveTitle('Contacts - React Navigation Example');

  await page.goForward();

  await expect(page).toHaveURL('/native-stack/albums');
  await expect(page).toHaveTitle('Albums - React Navigation Example');
});

test('restores state when jumping multiple entries in browser history', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  await page
    .getByRole('button', {
      name: 'Replace with contacts',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/contacts');

  await page
    .getByRole('button', {
      name: 'Push albums',
    })
    .click();

  await expect(page).toHaveURL('/native-stack/albums');

  await page.evaluate(() => window.history.go(-2));

  await expect(page).toHaveURL('/native-stack/article/gandalf');
  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await page.evaluate(() => window.history.go(2));

  await expect(page).toHaveURL('/native-stack/albums');
  await expect(page).toHaveTitle('Albums - React Navigation Example');
});

test('restores screens on browser back and forward after page reload', async ({
  page,
}) => {
  await page.goto('/native-stack/article/gandalf');

  await page
    .getByRole('button', {
      name: 'Navigate to feed',
    })
    .click();

  await expect(page).toHaveURL(/\/native-stack\/feed\/\d+$/);

  const feedUrl = page.url();

  const loaded = page.waitForEvent('load');

  await page.evaluate(() => window.location.reload());
  await loaded;

  await expect(page).toHaveURL(feedUrl);
  await expect(page).toHaveTitle('Feed - React Navigation Example');

  await page.goBack();

  await expect(page).toHaveURL('/native-stack/article/gandalf');
  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await page.goForward();

  await expect(page).toHaveURL(feedUrl);
  await expect(page).toHaveTitle('Feed - React Navigation Example');
});

test('preserves the URL for not found screens on browser back', async ({
  page,
}) => {
  await page.goto('/foo/bar');

  await expect(page).toHaveURL('/foo/bar');
  await expect(page).toHaveTitle('Oops! - React Navigation Example');

  await page
    .getByRole('button', {
      name: 'Go to home',
    })
    .click();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Examples - React Navigation Example');

  await page.goBack();

  await expect(page).toHaveURL('/foo/bar');
  await expect(page).toHaveTitle('Oops! - React Navigation Example');

  await page.goForward();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Examples - React Navigation Example');
});
