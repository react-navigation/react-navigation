import type { Browser } from '@e2e-dev/web';
import { expect, type Locator, type Screen, test as base } from 'e2e';

import { viewport } from '../e2e.config';

// Platforms with an app that was started and can be reused
const warmApps = new Set<string>();

// The browser fixture only exists on the web, so tests that use it need `requires: ['browser']`
export const test = base.extend<{ browser: Browser }>().extend<{
  /**
   * Open a deep link, e.g. `stack-basic`, without restarting the app.
   */
  open: (path: string) => Promise<void>;
  /**
   * Open a deep link from a clean state, and wait for the given text to show.
   * The app is restarted unless it can be reused.
   */
  launch: (path: string, text: string) => Promise<void>;
  /**
   * Scroll the content in the given direction.
   * On the web, the wheel is used at the pointer, so specify the element to scroll over.
   */
  scroll: (
    direction?: 'up' | 'down' | 'left' | 'right',
    target?: Locator
  ) => Promise<void>;
  /**
   * Swipe across the screen to move pagers, e.g. tabs.
   * The direction is where the content moves, `right` shows the next page.
   */
  swipe: (direction: 'left' | 'right') => Promise<void>;
  /**
   * Assert that the element is visible and inside the viewport.
   */
  expectInViewport: (locator: Locator) => Promise<void>;
  /**
   * Dismiss the error overlay that development builds show on native.
   */
  dismissErrorOverlay: () => Promise<void>;
}>({
  open: async ({ app }, provide) => {
    await provide(async (path) => {
      await app.open(`/${path}`);
    });
  },
  launch: async ({ app, screen, platform }, provide) => {
    await provide(async (path, text) => {
      const target = screen.getByText(text, { visible: true }).first();

      if (platform === 'web') {
        await app.open(`/${path}`);
        await expect(target).toBeVisible({ timeout: 60_000 });

        return;
      }

      // Reloading the app is slow on Android, so reuse the running app when possible
      // On iOS, the accessibility tree of a reused app can report stale states
      if (platform === 'android' && warmApps.has(platform)) {
        try {
          // Going home first unmounts the previous example to start from a clean state
          await app.open('/');
          await app.open(`/${path}`);
          await expect(target).toBeVisible({ timeout: 10_000 });

          return;
        } catch {
          // The previous test may have left the app unusable, so restart it
          warmApps.delete(platform);
        }
      }

      await app.open();

      // The restarted app restores the previous state, and drops links until it loads
      // So keep going home until it shows, then open the link from a clean state
      await expect
        .poll(
          async () => {
            await app.open('/');

            return screen.getByRole('heading', 'Examples').isVisible();
          },
          { timeout: 60_000, interval: 1000 }
        )
        .toBe(true);

      await app.open(`/${path}`);
      await expect(target).toBeVisible({ timeout: 60_000 });

      warmApps.add(platform);
    });
  },
  scroll: async ({ screen, platform }, provide) => {
    await provide(async (direction = 'down', target) => {
      if (platform === 'web') {
        // Swiping the screen on the web uses the wheel at the pointer
        await target?.hover();
        await screen.swipe({ direction, momentum: 'slow' });
      } else if (
        platform === 'ios' &&
        (direction === 'left' || direction === 'right')
      ) {
        // Scrolling the screen is too slow to move paging scroll views on iOS
        await swipeHorizontally(screen, direction);
      } else {
        await screen.swipe({ direction });
      }
    });
  },
  swipe: async ({ screen }, provide) => {
    await provide(async (direction) => {
      await swipeHorizontally(screen, direction);
    });
  },
  expectInViewport: async ({ platform }, provide) => {
    await provide(async (locator) => {
      await expect(locator).toBeVisible();

      if (platform === 'web') {
        // Off-screen pages of pagers are still visible on the web
        await expect
          .poll(async () => {
            const box = await locator.boundingBox();

            return (
              box != null && box.x >= 0 && box.x + box.width <= viewport.width
            );
          })
          .toBe(true);
      }
    });
  },
  dismissErrorOverlay: async ({ screen, platform }, provide) => {
    await provide(async () => {
      if (platform === 'web') {
        return;
      }

      // Development builds show errors in an overlay on native
      const dismiss =
        platform === 'ios'
          ? screen.getByLabel('Dismiss', { visible: true })
          : screen.getByText('Dismiss', { visible: true });

      try {
        await dismiss.waitFor({ state: 'visible', timeout: 5000 });
      } catch {
        return;
      }

      // The overlay is reported as covered, so tap its position instead
      const box = await dismiss.boundingBox();

      if (box == null) {
        throw new Error("Couldn't find the position of the dismiss button.");
      }

      await screen.tapAt({
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
      });
    });
  },
});

/**
 * Swipe horizontally across the screen.
 * Swiping the screen in a direction scrolls slowly on native, which doesn't reliably move pagers.
 * On the web, swiping in a direction uses the wheel, which doesn't move pagers.
 */
async function swipeHorizontally(screen: Screen, direction: 'left' | 'right') {
  // Phone-sized screens are at least 375 points wide
  // Stay away from the edges, which trigger back gestures
  const [start, end] = direction === 'right' ? [320, 80] : [120, 360];

  await screen.swipe({
    from: { x: start, y: 450 },
    to: { x: end, y: 450 },
    duration: 300,
  });
}

/**
 * Get a tab by its label.
 * Labels of tabs may contain additional info, e.g. "Albums, selected".
 */
export function getTab(screen: Screen, name: string) {
  return screen.getByRole('tab', new RegExp(`^${RegExp.escape(name)}(,|$)`));
}

/**
 * Assert that the element is hidden or scrolled above the viewport.
 */
export async function expectScrolledOutOfView(locator: Locator) {
  await expect
    .poll(async () => {
      if (!(await locator.isVisible())) {
        return true;
      }

      const box = await locator.boundingBox();

      return box == null || box.y + box.height <= 0;
    })
    .toBe(true);
}
