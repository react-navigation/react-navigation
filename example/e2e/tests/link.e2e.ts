import { beforeEach, type Browser, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

/**
 * Dispatch a synthetic mouse event on the link with the given name.
 * Returns whether the default action was prevented.
 */
const dispatchMouseEvent = (
  browser: Browser,
  options: {
    name: string;
    type: 'click' | 'auxclick';
    button: number;
    modifier?: 'Alt' | 'Control' | 'Meta' | 'Shift';
  }
) =>
  browser.evaluate(({ name, type, button, modifier }) => {
    const link = Array.from(document.querySelectorAll('a')).find(
      (element) => element.textContent === name
    );

    if (link == null) {
      throw new Error(`Couldn't find a link named '${name}'`);
    }

    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button,
      altKey: modifier === 'Alt',
      ctrlKey: modifier === 'Control',
      metaKey: modifier === 'Meta',
      shiftKey: modifier === 'Shift',
    });

    link.dispatchEvent(event);

    return event.defaultPrevented;
  }, options);

describe('Link', { requires: ['browser'] }, () => {
  beforeEach(async ({ app, screen, browser }) => {
    await app.open('/');
    await screen.getByText('Link', { visible: true }).tap();
    await browser.waitForURL('/components-link/article/gandalf');
  });

  test('loads the article screen', async ({ screen, browser }) => {
    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await expect(
      screen.getByRole('heading', 'Article by Gandalf')
    ).toBeVisible();

    await expect(screen.getByRole('link', 'Go to Home')).toHaveAttribute(
      'href',
      '/'
    );
  });

  test('replaces and pushes params', async ({ screen, browser }) => {
    await screen.getByRole('button', 'Push params').tap();

    await browser.waitForURL('/components-link/article/babel-fish');

    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await screen.getByRole('button', 'Push params').tap();

    await browser.waitForURL('/components-link/article/gandalf');

    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await screen.getByRole('link', 'Go back').tap();

    await browser.waitForURL('/components-link/article/babel-fish');

    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await expect(
      screen.getByRole('heading', 'Article by Babel fish')
    ).toBeVisible();

    await screen.getByRole('link', 'Go back').tap();

    await browser.waitForURL('/components-link/article/gandalf');

    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await expect(
      screen.getByRole('heading', 'Article by Gandalf')
    ).toBeVisible();

    await screen.getByRole('button', 'Replace params').tap();

    await browser.waitForURL('/components-link/article/babel-fish');

    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await expect(
      screen.getByRole('heading', 'Article by Babel fish')
    ).toBeVisible();
  });

  test('goes to the album screen and goes back', async ({
    screen,
    browser,
  }) => {
    const link = screen.getByRole('link', 'Go to albums');

    await expect(link).toHaveAttribute('href', '/components-link/albums');

    await link.tap();

    await browser.waitForURL('/components-link/albums');

    await expect(browser).toHaveTitle('Albums - React Navigation Example');

    await expect(screen.getByRole('heading', 'Albums')).toBeVisible();

    await expect(screen.getByLabel('Home, back')).toBeHidden();

    await screen.getByLabel('Article by Gandalf, back').tap();

    await browser.waitForURL('/components-link/article/gandalf');

    await expect(browser).toHaveTitle(
      'Article by Gandalf - React Navigation Example'
    );

    await expect(
      screen.getByRole('heading', 'Article by Gandalf')
    ).toBeVisible();
  });

  test('does not navigate when a link is disabled', async ({
    screen,
    browser,
  }) => {
    const link = screen.getByRole('link', 'Go to albums (Disabled)');

    await expect(link).toHaveAttribute('href', '/components-link/albums');
    await expect(link).toHaveAttribute('aria-disabled', 'true');

    // Ensure disabled link clicks don't bubble up
    await browser.evaluate(() => {
      document.body.dataset.disabledLinkClicks = '0';
      document.addEventListener(
        'click',
        () => {
          document.body.dataset.disabledLinkClicks = '1';
        },
        { once: true }
      );

      return null;
    });

    // Tapping at a position skips the actionability checks for disabled elements
    await link.tap({ position: { x: 5, y: 5 } });

    await expect(browser.locator('body')).toHaveAttribute(
      'data-disabled-link-clicks',
      '0'
    );

    await expect(browser).toHaveURL('/components-link/article/gandalf');
    await expect(
      screen.getByRole('heading', 'Article by Gandalf')
    ).toBeVisible();
  });

  for (const modifier of ['Alt', 'Control', 'Meta', 'Shift'] as const) {
    test(`lets the browser handle clicks with the ${modifier} key`, async ({
      screen,
      browser,
    }) => {
      await browser.evaluate(() => {
        document.addEventListener('click', (event) => event.preventDefault(), {
          once: true,
        });

        return null;
      });

      await screen
        .getByRole('link', 'Go to albums')
        .tap({ modifiers: [modifier] });

      await expect(browser).toHaveURL('/components-link/article/gandalf');
      await expect(
        screen.getByRole('heading', 'Article by Gandalf')
      ).toBeVisible();
    });
  }

  for (const modifier of ['Alt', 'Control', 'Meta', 'Shift'] as const) {
    test(`does not open a disabled link with the ${modifier} key`, async ({
      browser,
    }) => {
      // Taps can't skip the actionability checks while holding modifiers
      const prevented = await dispatchMouseEvent(browser, {
        name: 'Go to albums (Disabled)',
        type: 'click',
        button: 0,
        modifier,
      });

      expect(prevented).toBe(true);

      await expect(browser).toHaveURL('/components-link/article/gandalf');
    });
  }

  test('does not open a disabled link with a middle click', async ({
    browser,
  }) => {
    await browser.evaluate(() => {
      document.body.dataset.disabledLinkClicks = '0';
      document.addEventListener(
        'auxclick',
        () => {
          document.body.dataset.disabledLinkClicks = '1';
        },
        { once: true }
      );

      return null;
    });

    const prevented = await dispatchMouseEvent(browser, {
      name: 'Go to albums (Disabled)',
      type: 'auxclick',
      button: 1,
    });

    expect(prevented).toBe(true);

    await expect(browser.locator('body')).toHaveAttribute(
      'data-disabled-link-clicks',
      '0'
    );

    await expect(browser).toHaveURL('/components-link/article/gandalf');
  });

  test('navigates in the current page with target=_self', async ({
    screen,
    browser,
  }) => {
    const link = screen.getByRole('link', 'Open albums in current tab');

    const timeOrigin = await browser.evaluate(() => performance.timeOrigin);

    await expect(link).toHaveAttribute('target', '_self');

    await link.tap();

    await browser.waitForURL('/components-link/albums');

    await expect(screen.getByRole('heading', 'Albums')).toBeVisible();

    expect(await browser.evaluate(() => performance.timeOrigin)).toBe(
      timeOrigin
    );
  });

  test('lets the browser open a new page with target=_blank', async ({
    screen,
    browser,
  }) => {
    const link = screen.getByRole('link', 'Open albums in new tab');

    await expect(link).toHaveAttribute('target', '_blank');

    // The browser opens a new page if the link doesn't prevent the default action
    await browser.evaluate(() => {
      document.addEventListener(
        'click',
        (event) => {
          document.body.dataset.newPageClickPrevented = String(
            event.defaultPrevented
          );

          event.preventDefault();
        },
        { once: true }
      );

      return null;
    });

    await link.tap();

    await expect(browser.locator('body')).toHaveAttribute(
      'data-new-page-click-prevented',
      'false'
    );

    await expect(browser).toHaveURL('/components-link/article/gandalf');
  });

  test('replaces article with the album screen', async ({
    screen,
    browser,
  }) => {
    const link = screen.getByRole('link', 'Replace with albums');

    await expect(link).toHaveAttribute('href', '/components-link/albums');

    await link.tap();

    await browser.waitForURL('/components-link/albums');

    await expect(browser).toHaveTitle('Albums - React Navigation Example');

    await expect(screen.getByRole('heading', 'Albums')).toBeVisible();

    await expect(screen.getByLabel('Article by Gandalf, back')).toBeHidden();

    await screen.getByLabel('Home, back').tap();

    await browser.waitForURL('/');
  });

  test('preserves hash for navigation', async ({ screen, browser }) => {
    await screen.getByRole('button', 'Add hash to URL').tap();

    await browser.waitForURL('/components-link/article/gandalf#frodo');

    await screen.getByRole('button', 'Replace params').tap();

    await browser.waitForURL('/components-link/article/babel-fish#frodo');

    await browser.reload();

    await browser.waitForURL('/components-link/article/babel-fish#frodo');

    await expect(browser).toHaveTitle(
      'Article by Babel fish - React Navigation Example'
    );

    await screen.getByRole('link', 'Replace with albums').tap();

    await browser.waitForURL('/components-link/albums');
  });
});
