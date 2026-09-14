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

// `document.body.clientHeight`/`clientWidth` are always rounded integers,
// but `layout` is sub-pixel precise, so this tolerates a sub-pixel
// difference instead of requiring an exact match.
function approximatelyEqual(a: number, b: number) {
  return Math.abs(a - b) < 1;
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

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFill(
      approximatelyEqual(width, layout.width) &&
        approximatelyEqual(height, layout.height)
    );
  }, [layout.height, layout.width]);

  return enabled && fill;
}
