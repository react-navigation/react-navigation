import { beforeEach, type Browser, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

const getHydrationErrors = (browser: Browser) =>
  browser.evaluate(() =>
    Array.isArray(window.__hydrationErrors) ? window.__hydrationErrors : []
  );

declare global {
  interface Window {
    __hydrationErrors?: string[];
  }
}

describe('hydration', { requires: ['browser'] }, () => {
  beforeEach(async ({ browser }) => {
    // There is no console listener, so collect the errors in the page
    await browser.addInitScript(() => {
      const errors: string[] = [];
      const pattern = /hydration|hydrate/i;

      window.__hydrationErrors = errors;

      const consoleError = console.error;

      console.error = (...args: unknown[]) => {
        const message = args.map(String).join(' ');

        if (pattern.test(message)) {
          errors.push(message);
        }

        consoleError(...args);
      };

      window.addEventListener('error', (event) => {
        if (pattern.test(event.message)) {
          errors.push(event.message);
        }
      });
    });
  });

  test('hydrates the example app without errors', async ({
    screen,
    browser,
  }) => {
    await browser.goto('/', { waitUntil: 'networkidle' });

    await expect(browser).toHaveTitle('Examples - React Navigation Example');
    await expect(screen.getByRole('heading', 'Examples')).toBeVisible();

    expect(await getHydrationErrors(browser)).toEqual([]);
  });

  test('hydrates a linked route without errors', async ({
    screen,
    browser,
  }) => {
    await browser.goto('/native-stack/article/gandalf', {
      waitUntil: 'networkidle',
    });

    await expect(
      screen.getByRole('heading', 'Article by Gandalf')
    ).toBeVisible();

    expect(await getHydrationErrors(browser)).toEqual([]);
  });

  test('hydrates a route with a loader without errors', async ({
    screen,
    browser,
  }) => {
    await browser.goto('/loaders/dino/1', { waitUntil: 'networkidle' });

    await expect(
      screen.getByText('Tyrannosaurus rex', { visible: true }).first()
    ).toBeVisible();

    expect(await getHydrationErrors(browser)).toEqual([]);
  });

  test('hydrates a suspended screen without errors', async ({
    screen,
    browser,
  }) => {
    await browser.goto('/screen-layout/suspense', { waitUntil: 'networkidle' });

    await expect(screen.getByText('Suspend', { visible: true })).toBeVisible();

    expect(await getHydrationErrors(browser)).toEqual([]);
  });
});
