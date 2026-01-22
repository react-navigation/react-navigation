import * as React from 'react';
import { Animated, Keyboard, StyleSheet, View } from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { AdapterProps, Layout, Listener } from './types';

export type CSSAdapterProps = AdapterProps & {
  /**
   * Whether to show the scrollbar.
   * Defaults to `false`.
   */
  showScrollbar?: boolean;
};

/**
 * A pager adapter that uses CSS scroll-snap for native-feeling page transitions on the web.
 *
 * This adapter leverages the browser's native scroll behavior with CSS scroll-snap,
 * providing smooth, hardware-accelerated animations and native touch handling.
 *
 * Features:
 * - Uses CSS `scroll-snap-type` for paging behavior
 * - Hardware-accelerated smooth scrolling via `scroll-behavior: smooth`
 * - Native touch/trackpad momentum scrolling
 * - RTL support via CSS `direction` property
 *
 * This adapter is designed specifically for web and should not be used on native platforms.
 *
 * @example
 * ```tsx
 * import { TabView, CSSAdapter } from 'react-native-tab-view';
 *
 * <TabView
 *   renderAdapter={(props) => <CSSAdapter {...props} />}
 *   // ... other props
 * />
 * ```
 */
export function CSSAdapter({
  keyboardDismissMode,
  swipeEnabled = true,
  navigationState,
  onIndexChange,
  onTabSelect,
  onSwipeStart,
  onSwipeEnd,
  children,
  style,
  animationEnabled = true,
  layoutDirection = 'ltr',
  showScrollbar = false,
}: CSSAdapterProps) {
  const { index, routes } = navigationState;

  const listeners = React.useRef<Set<Listener>>(new Set()).current;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<View>(null);

  const [layout, setLayout] = React.useState<Layout>({ width: 0, height: 0 });

  const onLayout = useLatestCallback(
    (event: { nativeEvent: { layout: Layout } }) => {
      const { width, height } = event.nativeEvent.layout;

      setLayout((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height }
      );
    }
  );

  const [position] = React.useState(() => new Animated.Value(index));

  const indexRef = React.useRef(index);
  const isDraggingRef = React.useRef(false);
  const isAnimatingRef = React.useRef(false);

  const scrollToIndex = useLatestCallback(
    (targetIndex: number, animated: boolean) => {
      const scrollElement = scrollRef.current;

      if (!scrollElement || !layout.width) {
        return;
      }

      const scrollLeft =
        layoutDirection === 'rtl'
          ? -targetIndex * layout.width
          : targetIndex * layout.width;

      if (animated && animationEnabled) {
        isAnimatingRef.current = true;
        scrollElement.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      } else {
        scrollElement.scrollTo({
          left: scrollLeft,
          behavior: 'instant',
        });
      }
    }
  );

  const jumpTo = useLatestCallback((key: string) => {
    const i = routes.findIndex((route) => route.key === key);

    if (i >= 0) {
      scrollToIndex(i, true);
    }

    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }
  });

  // Scroll to the correct position when index changes externally
  React.useEffect(() => {
    if (indexRef.current !== index && !isDraggingRef.current) {
      scrollToIndex(index, true);
      indexRef.current = index;
    }
  }, [index, scrollToIndex]);

  // Set initial scroll position
  React.useLayoutEffect(() => {
    if (layout.width) {
      scrollToIndex(index, false);
    }
    // Only run on initial layout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.width > 0]);

  const handleScroll = useLatestCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollElement = event.currentTarget;
      const scrollLeft = scrollElement.scrollLeft;
      const scrollWidth = layout.width;

      if (!scrollWidth) {
        return;
      }

      // Calculate position (accounting for RTL)
      const rawPosition =
        layoutDirection === 'rtl'
          ? -scrollLeft / scrollWidth
          : scrollLeft / scrollWidth;

      const clampedPosition = clamp(rawPosition, 0, routes.length - 1);

      // Update the animated position value
      position.setValue(clampedPosition);

      // Notify listeners about entering adjacent pages
      const next = [
        Math.ceil(clampedPosition),
        Math.floor(clampedPosition),
      ].find((i) => i !== indexRef.current && i >= 0 && i < routes.length);

      if (next != null) {
        listeners.forEach((listener) =>
          listener({
            type: 'enter',
            index: next,
          })
        );
      }
    }
  );

  const handleScrollEnd = useLatestCallback(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement || !layout.width) {
      return;
    }

    const scrollLeft = scrollElement.scrollLeft;
    const rawPosition =
      layoutDirection === 'rtl'
        ? -scrollLeft / layout.width
        : scrollLeft / layout.width;

    const newIndex = Math.round(clamp(rawPosition, 0, routes.length - 1));

    // Check if scroll has settled on a page boundary
    const isSettled = Math.abs(rawPosition - newIndex) < 0.01;

    if (isSettled) {
      isDraggingRef.current = false;
      isAnimatingRef.current = false;

      if (newIndex !== indexRef.current) {
        indexRef.current = newIndex;
        onIndexChange(newIndex);
      }

      onTabSelect?.({ index: newIndex });
    }
  });

  // Use scrollend event if available, otherwise fall back to debounced scroll
  const scrollEndTimerRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const handleScrollWithEnd = useLatestCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      handleScroll(event);

      // Debounce scrollend detection for browsers that don't support scrollend
      if (!('onscrollend' in window)) {
        clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = setTimeout(handleScrollEnd, 100);
      }
    }
  );

  const handleScrollEndNative = useLatestCallback(() => {
    handleScrollEnd();
  });

  const handleTouchStart = useLatestCallback(() => {
    if (swipeEnabled) {
      isDraggingRef.current = true;
      onSwipeStart?.();

      if (keyboardDismissMode === 'on-drag') {
        Keyboard.dismiss();
      }
    }
  });

  const handleTouchEnd = useLatestCallback(() => {
    if (isDraggingRef.current) {
      onSwipeEnd?.();
    }
  });

  const handleMouseDown = useLatestCallback(() => {
    if (swipeEnabled) {
      isDraggingRef.current = true;
      onSwipeStart?.();

      if (keyboardDismissMode === 'on-drag') {
        Keyboard.dismiss();
      }
    }
  });

  const handleMouseUp = useLatestCallback(() => {
    if (isDraggingRef.current) {
      onSwipeEnd?.();
    }
  });

  const subscribe = useLatestCallback((listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  });

  // Attach scrollend event listener
  React.useEffect(() => {
    const scrollElement = scrollRef.current;

    if (scrollElement && 'onscrollend' in window) {
      scrollElement.addEventListener('scrollend', handleScrollEndNative);

      return () => {
        scrollElement.removeEventListener('scrollend', handleScrollEndNative);
      };
    }

    return undefined;
  }, [handleScrollEndNative]);

  const scrollContainerStyle = React.useMemo(
    (): React.CSSProperties => ({
      flex: 1,
      display: 'flex',
      overflowX: swipeEnabled ? 'auto' : 'hidden',
      overflowY: 'hidden',
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      direction: layoutDirection,
      scrollbarWidth: showScrollbar ? 'auto' : 'none',
      msOverflowStyle: showScrollbar ? 'auto' : 'none',
    }),
    [layoutDirection, swipeEnabled, showScrollbar]
  );

  const contentStyle = React.useMemo(
    (): React.CSSProperties => ({
      display: 'flex',
      flexDirection: 'row',
      width: layout.width ? `${routes.length * 100}%` : '100%',
      height: '100%',
    }),
    [layout.width, routes.length]
  );

  return children({
    position,
    subscribe,
    jumpTo,
    render: (childElements) => (
      <View
        ref={containerRef}
        onLayout={onLayout}
        style={[styles.container, style]}
      >
        <div
          ref={scrollRef}
          style={scrollContainerStyle}
          onScroll={handleScrollWithEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div style={contentStyle}>
            {childElements
              .map((child, i) => {
                const route = routes[i];
                const focused = i === index;

                if (!layout.width && !focused) {
                  return null;
                }

                return (
                  <div
                    key={route.key}
                    style={{
                      width: layout.width ? layout.width : '100%',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      scrollSnapStop: 'always',
                    }}
                  >
                    {child}
                  </div>
                );
              })
              .filter((child): child is React.ReactElement => child !== null)}
          </div>
        </div>
      </View>
    ),
  });
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
