import * as React from 'react';

type Options = {
  /**
   * Whether the "fills window" behavior should be considered at all.
   */
  enabled: boolean;
  /**
   * The size of the content that might fill the window.
   */
  layout: { width: number; height: number };
};

const STYLE_ID = '__react-navigation-native-stack-mobile-chrome-viewport-fix';

// `document.body.clientHeight`/`clientWidth` are always rounded integers,
// but `layout` is sub-pixel precise, so this tolerates a sub-pixel
// difference instead of requiring an exact match.
function approximatelyEqual(a: number, b: number) {
  return Math.abs(a - b) < 1;
}

// This workaround is specifically for mobile Chrome's behavior of leaving
// an empty space at the bottom of the page after a navigation that happens
// while the address bar is collapsed. It must not run on Safari/WebKit:
// Safari fires `resize` *during* its own address bar collapse/expand
// animation, and forcing the body's height on every one of those events
// fights that animation and causes a visible flicker. iOS forces every
// browser, including Chrome ("CriOS"), to use WebKit, so checking for
// Android is enough to scope this to actual mobile Chrome (Blink).
function isMobileChrome() {
  const ua = navigator.userAgent;

  return /Android/.test(ua) && /Chrome\//.test(ua);
}

/**
 * On mobile browsers, the address bar collapses when the page scrolls,
 * but only if `document.body` is the element that grows/scrolls - not a
 * nested fixed-height container. This hook detects when the given `layout`
 * fills the whole page, so the caller can switch from a fixed-size container
 * to one that lets its content overflow naturally into `document.body`.
 *
 * This mirrors `packages/stack/src/views/Stack/CardContent.tsx`'s logic -
 * kept as a separate, local copy rather than a shared abstraction, since the
 * two packages apply it to differently-shaped container trees.
 */
export function useFillsWindow({ enabled, layout }: Options): boolean {
  const [fill, setFill] = React.useState(false);

  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    // Workaround necessary when a navigation happens when the address bar
    // has already collapsed, which resulted in an empty space at the
    // bottom of the page (matching the height of the address bar). To fix
    // this, it's necessary to update the height of the DOM with the
    // current height of the window.
    // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    const isFullHeight = approximatelyEqual(height, layout.height);

    let unsubscribe: (() => void) | undefined;

    if (isFullHeight && isMobileChrome()) {
      const style =
        document.getElementById(STYLE_ID) ?? document.createElement('style');

      style.id = STYLE_ID;

      const updateStyle = () => {
        const vh = window.innerHeight * 0.01;

        style.textContent = [
          `:root { --vh: ${vh}px; }`,
          `body { height: calc(var(--vh, 1vh) * 100); }`,
        ].join('\n');
      };

      updateStyle();

      if (!document.head.contains(style)) {
        document.head.appendChild(style);
      }

      // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
      window.addEventListener('resize', updateStyle);

      unsubscribe = () => {
        window.removeEventListener('resize', updateStyle);
      };
    } else {
      // Remove the workaround if the content does not occupy the whole
      // height of the page
      document.getElementById(STYLE_ID)?.remove();
    }

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFill(
      approximatelyEqual(width, layout.width) &&
        approximatelyEqual(height, layout.height)
    );

    return unsubscribe;
  }, [layout.height, layout.width]);

  return enabled && fill;
}
