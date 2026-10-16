import { type Browser, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

const getHistoryLength = (browser: Browser) =>
  browser.evaluate(() => window.history.length);

/**
 * Index of the current entry in the session history.
 * Returns `null` if the browser doesn't support the Navigation API.
 */
const getHistoryIndex = (browser: Browser) =>
  browser.evaluate(() =>
    'navigation' in window
      ? (window.navigation.currentEntry?.index ?? null)
      : null
  );

describe('browser history', { requires: ['browser'] }, () => {
  test('pops to the proper screen after going back and forward in history', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');

    await browser.back();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.forward();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');

    await screen.getByRole('button', 'Go back').tap();

    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await expect(
      screen.getByRole('heading', 'Article by Gandalf')
    ).toBeVisible();
  });

  test('restores browser forward entry after programmatic go back', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');

    const feedUrl = await browser.url();

    await screen.getByRole('button', 'Go back').tap();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.forward();

    await expect(browser).toHaveURL(feedUrl);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');
  });

  test('keeps state in sync when browser back and forward interrupt navigation', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    await browser.evaluate(() => {
      const goForward = () => {
        window.removeEventListener('popstate', goForward);
        window.history.forward();
      };

      window.addEventListener('popstate', goForward);
      window.history.back();

      return null;
    });

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');

    await screen.getByRole('button', 'Go back').tap();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );
  });

  test('replaces the current browser history entry on replace', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    await screen.getByRole('button', 'Replace with contacts').tap();

    await expect(browser).toHaveURL('/native-stack/contacts');
    await expect(browser).toHaveTitle('Contacts - React Navigation Example');

    await browser.back();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.forward();

    await expect(browser).toHaveURL('/native-stack/contacts');
    await expect(browser).toHaveTitle('Contacts - React Navigation Example');
  });

  test('truncates browser forward history after navigating from a previous entry', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    const buttonToFeed = screen.getByRole('button', 'Navigate to feed');

    await buttonToFeed.tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    const firstFeedUrl = await browser.url();

    await browser.back();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');

    await buttonToFeed.tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);
    await expect(browser).not.toHaveURL(firstFeedUrl);

    const secondFeedUrl = await browser.url();

    await browser.forward();

    await expect(browser).toHaveURL(secondFeedUrl);
  });

  test('goes back to the proper history entry after popping nested stack', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/not-found');

    // After tap, we have [not-found, home] on history stack
    await screen.getByRole('button', 'Go to home').tap();

    // Open nested stack
    await screen.getByTestId('StackBasic', { visible: true }).tap();

    // Push second screen to the nested stack
    // After tap, we have [not-found, home, article, feed] on history stack
    await screen.getByRole('button', 'Navigate to feed').tap();

    // After tap, we have [not-found, home] on history stack
    await screen.getByRole('button', 'Pop to home').tap();

    await expect(browser).toHaveTitle('Examples - React Navigation Example');

    await expect(screen.getByRole('heading', 'Examples')).toBeVisible();

    await browser.back();

    await expect(browser).toHaveTitle('Oops! - React Navigation Example');

    await expect(screen.getByRole('heading', 'Oops!')).toBeVisible();
  });

  test('rolls back browser history when browser back is prevented', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/');

    await expect(browser).toHaveURL('/');

    const initialHistoryLength = await getHistoryLength(browser);
    const initialHistoryIndex = await getHistoryIndex(browser);

    await screen
      .getByTestId('NativeStackPreventRemove', { visible: true })
      .tap();

    await expect(browser).toHaveURL('/native-stack-prevent-remove/input');

    const inputHistoryLength = initialHistoryLength + 1;

    expect(await getHistoryLength(browser)).toBe(inputHistoryLength);

    if (initialHistoryIndex != null) {
      expect(await getHistoryIndex(browser)).toBe(initialHistoryIndex + 1);
    }

    await expect(screen.getByText('Discard and go back')).toBeVisible();

    const input = screen.getByPlaceholder('Type something…');

    await input.fill('hello');

    await expect(input).toHaveValue('hello');

    const messages: string[] = [];

    await browser.onDialog(async (dialog) => {
      messages.push(dialog.message);

      await dialog.dismiss();
    });

    await browser.back();

    await expect
      .poll(() => messages)
      .toEqual([
        'You have unsaved changes. Discard them and leave the screen?',
      ]);

    await expect(browser).toHaveURL('/native-stack-prevent-remove/input');

    expect(await getHistoryLength(browser)).toBe(inputHistoryLength);

    if (initialHistoryIndex != null) {
      expect(await getHistoryIndex(browser)).toBe(initialHistoryIndex + 1);
    }
  });

  test('keeps browser history in sync when prevented browser back is continued', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/');

    await expect(browser).toHaveURL('/');

    const initialHistoryLength = await getHistoryLength(browser);
    const initialHistoryIndex = await getHistoryIndex(browser);

    await screen
      .getByTestId('NativeStackPreventRemove', { visible: true })
      .tap();

    await expect(browser).toHaveURL('/native-stack-prevent-remove/input');

    const inputHistoryLength = initialHistoryLength + 1;

    const input = screen.getByPlaceholder('Type something…');

    await input.fill('hello');

    await expect(input).toHaveValue('hello');

    const messages: string[] = [];

    await browser.onDialog(async (dialog) => {
      messages.push(dialog.message);

      await dialog.accept();
    });

    await browser.back();

    await expect
      .poll(() => messages)
      .toEqual([
        'You have unsaved changes. Discard them and leave the screen?',
      ]);

    await expect(browser).toHaveURL('/');

    expect(await getHistoryLength(browser)).toBe(inputHistoryLength);

    if (initialHistoryIndex != null) {
      expect(await getHistoryIndex(browser)).toBe(initialHistoryIndex);
    }
  });

  test('restores previous params on browser back after pushing params', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/components-link/article/gandalf');

    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await screen.getByRole('button', 'Push params').tap();

    await expect(browser).toHaveURL('/components-link/article/babel-fish');
    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await browser.back();

    await expect(browser).toHaveURL('/components-link/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.forward();

    await expect(browser).toHaveURL('/components-link/article/babel-fish');
    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );
  });

  test('goes back through params history when the URL contains a hash', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/components-link/article/gandalf');

    await screen.getByRole('button', 'Push params').tap();

    await expect(browser).toHaveURL('/components-link/article/babel-fish');

    await screen.getByRole('button', 'Add hash to URL').tap();

    await expect(browser).toHaveURL(
      '/components-link/article/babel-fish#frodo'
    );

    await screen.getByRole('button', 'Push params').tap();

    await expect(browser).toHaveURL('/components-link/article/gandalf#frodo');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.back();

    await expect(browser).toHaveURL(
      '/components-link/article/babel-fish#frodo'
    );
    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await browser.back();

    await expect(browser).toHaveURL('/components-link/article/babel-fish');
    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await browser.back();

    await expect(browser).toHaveURL('/components-link/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );
  });

  test('replaces browser history entry when params are updated with setParams', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    const historyLength = await getHistoryLength(browser);

    await screen.getByRole('button', 'Update params').tap();

    await expect(browser).toHaveURL('/native-stack/article/babel-fish');
    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    expect(await getHistoryLength(browser)).toBe(historyLength);

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    await browser.back();

    await expect(browser).toHaveURL('/native-stack/article/babel-fish');
    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );
  });

  test('syncs browser history when switching tabs with fullHistory back behavior', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/bottom-tabs-full-history');

    await expect(browser).toHaveURL('/bottom-tabs-full-history/first');
    await expect(screen.getByText('Tab First (-)')).toBeVisible();

    await screen.getByRole('button', 'Navigate to Second').tap();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/second/1');
    await expect(screen.getByText('Tab Second (1)')).toBeVisible();

    await screen.getByRole('button', 'Navigate to Third').tap();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/third/2');
    await expect(screen.getByText('Tab Third (2)')).toBeVisible();

    await browser.back();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/second/1');
    await expect(screen.getByText('Tab Second (1)')).toBeVisible();

    await browser.back();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/first');
    await expect(screen.getByText('Tab First (-)')).toBeVisible();

    await browser.forward();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/second/1');
    await expect(screen.getByText('Tab Second (1)')).toBeVisible();

    await screen.getByRole('button', 'Go back').tap();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/first');
    await expect(screen.getByText('Tab First (-)')).toBeVisible();

    await browser.forward();

    await expect(browser).toHaveURL('/bottom-tabs-full-history/second/1');
    await expect(screen.getByText('Tab Second (1)')).toBeVisible();
  });

  test('goes back to matching history entry when popping multiple screens', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    await screen.getByRole('button', 'Replace with contacts').tap();

    await expect(browser).toHaveURL('/native-stack/contacts');

    await screen.getByRole('button', 'Push albums').tap();

    await expect(browser).toHaveURL('/native-stack/albums');
    await expect(browser).toHaveTitle('Albums - React Navigation Example');

    await screen.getByRole('button', 'Pop by 2').tap();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.forward();

    await expect(browser).toHaveURL('/native-stack/contacts');
    await expect(browser).toHaveTitle('Contacts - React Navigation Example');

    await browser.forward();

    await expect(browser).toHaveURL('/native-stack/albums');
    await expect(browser).toHaveTitle('Albums - React Navigation Example');
  });

  test('restores state when jumping multiple entries in browser history', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    await screen.getByRole('button', 'Replace with contacts').tap();

    await expect(browser).toHaveURL('/native-stack/contacts');

    await screen.getByRole('button', 'Push albums').tap();

    await expect(browser).toHaveURL('/native-stack/albums');

    await browser.evaluate(() => {
      window.history.go(-2);

      return null;
    });

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.evaluate(() => {
      window.history.go(2);

      return null;
    });

    await expect(browser).toHaveURL('/native-stack/albums');
    await expect(browser).toHaveTitle('Albums - React Navigation Example');
  });

  test('restores screens on browser back and forward after page reload', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/native-stack/article/gandalf');

    await screen.getByRole('button', 'Navigate to feed').tap();

    await expect(browser).toHaveURL(/\/native-stack\/feed\/\d+$/);

    const feedUrl = await browser.url();

    // Avoid `browser.reload()` since it adds an extra history entry on Firefox
    await browser.evaluate(() => {
      document.documentElement.dataset.reloaded = 'false';
      window.location.reload();

      return null;
    });

    await expect(browser.locator('html')).not.toHaveAttribute('data-reloaded');
    await expect(screen.getByRole('button', 'Go back')).toBeVisible();

    await expect(browser).toHaveURL(feedUrl);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');

    await browser.back();

    await expect(browser).toHaveURL('/native-stack/article/gandalf');
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await browser.forward();

    await expect(browser).toHaveURL(feedUrl);
    await expect(browser).toHaveTitle('Feed - React Navigation Example');
  });

  test('preserves the URL for not found screens on browser back', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/foo/bar');

    await expect(browser).toHaveURL('/foo/bar');
    await expect(browser).toHaveTitle('Oops! - React Navigation Example');

    await screen.getByRole('button', 'Go to home').tap();

    await expect(browser).toHaveURL('/');
    await expect(browser).toHaveTitle('Examples - React Navigation Example');

    await browser.back();

    await expect(browser).toHaveURL('/foo/bar');
    await expect(browser).toHaveTitle('Oops! - React Navigation Example');

    await browser.forward();

    await expect(browser).toHaveURL('/');
    await expect(browser).toHaveTitle('Examples - React Navigation Example');
  });

  test('adds and removes browser history entry when drawer is opened and closed', async ({
    app,
    screen,
    browser,
  }) => {
    await app.open('/');

    const historyLength = await getHistoryLength(browser);

    const overlay = screen.getByRole('button', 'Close drawer');

    await screen.getByLabel('Show navigation menu', { visible: true }).tap();

    await expect(overlay).toBeVisible();

    expect(await getHistoryLength(browser)).toBe(historyLength + 1);

    await expect(browser).toHaveURL('/');

    await browser.back();

    await expect(overlay).toBeHidden();
    await expect(browser).toHaveURL('/');

    await browser.forward();

    await expect(overlay).toBeVisible();
    await expect(browser).toHaveURL('/');
  });
});
