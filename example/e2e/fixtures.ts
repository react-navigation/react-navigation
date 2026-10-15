import type { Device } from '@e2e-dev/mobile';
import type { Browser } from '@e2e-dev/web';
import { expect, type Locator, type Screen, test as base } from 'e2e';

import config from '../app.json' with { type: 'json' };

const scheme = `${config.expo.scheme}://`;

export const test = base.extend<{
  /**
   * Open a deep link, e.g. `stack-basic`, without restarting the app.
   */
  open: (path: string) => Promise<void>;
  /**
   * Restart the app with a deep link, and wait for the given text to show.
   */
  launch: (path: string, text: string) => Promise<void>;
  /**
   * Scroll the content in the given direction.
   * On the web, the wheel is used over the target element if specified.
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
   * Respond to the next browser dialog, e.g. `confirm`. Only available on the web.
   */
  dialog: (action: 'accept' | 'dismiss') => Promise<void>;
  /**
   * Dismiss the error overlay that development builds show on native.
   */
  dismissErrorOverlay: () => Promise<void>;
}>({
  open: async (fixtures, provide) => {
    await provide(async (path) => {
      if (fixtures.platform === 'web') {
        await fixtures.app.open(`/${path}`);
      } else {
        // The device fixture only exists on device targets, so read it lazily
        const { device } = fixtures as typeof fixtures & { device: Device };

        await device.openLink(`${scheme}${path}`);
      }
    });
  },
  launch: async (fixtures, provide) => {
    await provide(async (path, text) => {
      if (fixtures.platform === 'web') {
        await fixtures.app.open(`/${path}`);
      } else {
        const { device } = fixtures as typeof fixtures & { device: Device };

        // Opening the app first binds the device session, so the app can be closed
        // Then opening the link cold starts the app with the link as initial URL
        await fixtures.app.open();
        await device.closeApp();
        await device.openLink(`${scheme}${path}`);
      }

      await expect(
        fixtures.screen.getByText(text, { visible: true }).first()
      ).toBeVisible({
        timeout: 60_000,
      });
    });
  },
  scroll: async (fixtures, provide) => {
    await provide(async (direction = 'down', target) => {
      if (fixtures.platform === 'web') {
        // Swiping the screen on the web always uses the wheel at the center
        const { browser } = fixtures as typeof fixtures & { browser: Browser };
        const { width, height } = await getViewport(browser);
        const box = target ? await target.boundingBox() : null;

        await browser.mouse.move(
          box ? box.x + box.width / 2 : width / 2,
          box ? box.y + box.height / 2 : height / 2
        );

        const horizontal = direction === 'left' || direction === 'right';
        const distance =
          (horizontal ? width : height) *
          0.75 *
          (direction === 'up' || direction === 'left' ? -1 : 1);

        await browser.mouse.wheel(
          horizontal ? distance : 0,
          horizontal ? 0 : distance
        );
      } else if (
        fixtures.platform === 'ios' &&
        (direction === 'left' || direction === 'right')
      ) {
        // Scrolling the screen is too slow to move paging scroll views on iOS
        await swipeHorizontally(fixtures.screen, direction);
      } else {
        await fixtures.screen.swipe({ direction });
      }
    });
  },
  swipe: async (fixtures, provide) => {
    await provide(async (direction) => {
      if (fixtures.platform === 'web') {
        // Swiping in a direction scrolls with the wheel on the web, which doesn't move pagers
        const { browser } = fixtures as typeof fixtures & { browser: Browser };
        const { width, height } = await getViewport(browser);

        const [start, end] =
          direction === 'right'
            ? [width * 0.8, width * 0.2]
            : [width * 0.2, width * 0.8];

        // Selecting text or dragging images with the mouse cancels the gesture
        await browser.evaluate(() => {
          document.documentElement.style.setProperty(
            'user-select',
            'none',
            'important'
          );
          document.ondragstart = (e) => e.preventDefault();

          return null;
        });

        await fixtures.screen.swipe({
          from: { x: start, y: height / 2 },
          to: { x: end, y: height / 2 },
          duration: 300,
        });
      } else {
        await swipeHorizontally(fixtures.screen, direction);
      }
    });
  },
  expectInViewport: async (fixtures, provide) => {
    await provide(async (locator) => {
      await expect(locator).toBeVisible();

      if (fixtures.platform === 'web') {
        // Off-screen pages of pagers are still visible on the web
        const { browser } = fixtures as typeof fixtures & { browser: Browser };
        const { width } = await getViewport(browser);

        await expect
          .poll(async () => {
            const box = await locator.boundingBox();

            return box != null && box.x >= 0 && box.x + box.width <= width;
          })
          .toBe(true);
      }
    });
  },
  dialog: async (fixtures, provide) => {
    await provide(async (action) => {
      if (fixtures.platform !== 'web') {
        throw new Error('Browser dialogs are only available on the web.');
      }

      const { browser } = fixtures as typeof fixtures & { browser: Browser };

      // Respond to the next dialog only
      const off = await browser.onDialog(async (dialog) => {
        await off();
        await dialog[action]();
      });
    });
  },
  dismissErrorOverlay: async (fixtures, provide) => {
    await provide(async () => {
      if (fixtures.platform === 'web') {
        return;
      }

      // Development builds show errors in an overlay on native
      const dismiss =
        fixtures.platform === 'ios'
          ? fixtures.screen.getByLabel('Dismiss', { visible: true })
          : fixtures.screen.getByText('Dismiss', { visible: true });

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

      await fixtures.screen.tapAt({
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
      });
    });
  },
});

/**
 * Swipe horizontally across the screen on native.
 * Swiping the screen in a direction scrolls slowly, which doesn't reliably move pagers.
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
 * Get the size of the browser viewport.
 */
function getViewport(browser: Browser) {
  return browser.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
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
