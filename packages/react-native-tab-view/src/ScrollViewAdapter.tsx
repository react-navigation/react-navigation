import * as React from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { AdapterProps, Listener } from './types';
import { useMeasureLayout } from './useMeasureLayout';

export type ScrollViewAdapterProps = AdapterProps &
  Omit<ViewProps, 'children'> & {
    decelerationRate?: 'fast' | 'normal';
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
    bounces?: boolean;
    overScrollMode?: 'always' | 'never' | 'auto';
  };

type ScrollEvent = Parameters<
  NonNullable<React.ComponentProps<typeof Animated.ScrollView>['onScroll']>
>[0];

export function ScrollViewAdapter({
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
  decelerationRate = 'fast',
  bounces = false,
  overScrollMode = 'never',
  keyboardShouldPersistTaps = 'always',
  ...rest
}: ScrollViewAdapterProps) {
  const { index, routes } = navigationState;

  const isRTL = layoutDirection === 'rtl';

  // Android reports RTL scroll offsets from the opposite end (0 at the max scroll offset)
  // So we need to invert them to get the logical route index
  const shouldInvertOffset = Platform.OS === 'android' && isRTL;

  // Web uses negative scroll offsets in RTL
  // So we need to negate them to get the logical route index
  const shouldNegateOffset = Platform.OS === 'web' && isRTL;

  const listeners = React.useRef<Set<Listener>>(new Set()).current;

  const scrollViewRef = React.useRef<ScrollView>(null);
  const containerRef = React.useRef<View>(null);

  const isInitialRef = React.useRef(true);

  const getScrollOffsetForIndex = React.useCallback(
    (index: number, width: number) =>
      (shouldNegateOffset ? -index : index) * width,
    [shouldNegateOffset]
  );

  const getReportedOffsetForIndex = React.useCallback(
    (index: number, width: number) =>
      shouldInvertOffset
        ? (routes.length - 1 - index) * width
        : getScrollOffsetForIndex(index, width),
    [getScrollOffsetForIndex, routes.length, shouldInvertOffset]
  );

  const getIndexFromOffset = React.useCallback(
    (x: number, width: number) => {
      const offset = clamp(
        x / width,
        shouldNegateOffset ? -(routes.length - 1) : 0,
        routes.length - 1
      );

      if (shouldInvertOffset) {
        return routes.length - 1 - offset;
      }

      if (shouldNegateOffset) {
        return -offset;
      }

      return offset;
    },
    [routes.length, shouldInvertOffset, shouldNegateOffset]
  );

  const [layout, onLayout] = useMeasureLayout(containerRef, ({ width }) => {
    if (isInitialRef.current) {
      const x = getScrollOffsetForIndex(index, width);

      setContentOffset({ x, y: 0 });

      offsetX.setValue(getReportedOffsetForIndex(index, width));
    } else if (indexRef.current !== index) {
      scrollToIndex(index);
    }

    isInitialRef.current = false;
  });

  const [contentOffset, setContentOffset] = React.useState(() => ({
    x: getScrollOffsetForIndex(index, layout.width),
    y: 0,
  }));

  React.useEffect(() => {
    // FIXME: contentOffset is not supported on Android and Web
    // So we manually scroll after state update
    if (Platform.OS === 'android' || Platform.OS === 'web') {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          x: contentOffset.x,
          animated: false,
        });
      });
    }
  }, [contentOffset.x]);

  const [offsetX] = React.useState(() => new Animated.Value(contentOffset.x));

  const scrollToIndex = useLatestCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: getScrollOffsetForIndex(index, layout.width),
      animated: animationEnabled,
    });
  });

  const jumpTo = useLatestCallback((key: string) => {
    const i = routes.findIndex((route) => route.key === key);

    scrollToIndex(i);

    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }
  });

  const handleSwipeStart = React.useCallback(() => {
    onSwipeStart?.();
  }, [onSwipeStart]);

  const handleSwipeEnd = React.useCallback(() => {
    onSwipeEnd?.();
  }, [onSwipeEnd]);

  const subscribe = useLatestCallback((listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  });

  const position = React.useMemo(() => {
    if (!layout.width) {
      return null;
    }

    const value = Animated.divide(offsetX, layout.width);

    // Convert platform scroll offsets back to logical route index
    return shouldInvertOffset
      ? Animated.subtract(routes.length - 1, value)
      : shouldNegateOffset
        ? Animated.multiply(value, -1)
        : value;
  }, [
    layout.width,
    offsetX,
    routes.length,
    shouldInvertOffset,
    shouldNegateOffset,
  ]);

  const indexRef = React.useRef(index);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const onScrollEnd = (x: number) => {
    const nextIndex = getIndexFromOffset(x, layout.width);

    if (nextIndex % 1 === 0) {
      indexRef.current = nextIndex;

      if (nextIndex !== index) {
        onIndexChange(nextIndex);
      }

      onTabSelect?.({ index: nextIndex });
    }
  };

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { x: offsetX },
        },
      },
    ],
    {
      useNativeDriver: Platform.OS !== 'web',
      listener: (event: ScrollEvent) => {
        const { x } = event.nativeEvent.contentOffset;
        const value = getIndexFromOffset(x, layout.width);

        // The offset will overlap the current and the adjacent page
        // So we need to get the index of the adjacent page
        const next = [Math.ceil(value), Math.floor(value)].find(
          (i) => i !== index
        );

        if (next != null) {
          listeners.forEach((listener) =>
            listener({
              type: 'enter',
              index: next,
            })
          );
        }

        // FIXME: onMomentumScrollEnd is not supported on Web
        // So we workaround by using a timer
        if (Platform.OS === 'web') {
          clearTimeout(timerRef.current);

          timerRef.current = setTimeout(() => {
            onScrollEnd(x);
          }, 100);
        }
      },
    }
  );

  const onMomentumScrollEnd = (event: ScrollEvent) => {
    onScrollEnd(event.nativeEvent.contentOffset.x);
  };

  return children({
    position: position ?? new Animated.Value(index),
    subscribe,
    jumpTo,
    render: (children) => (
      <View ref={containerRef} onLayout={onLayout} style={styles.container}>
        <Animated.ScrollView
          {...rest}
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          directionalLockEnabled
          decelerationRate={decelerationRate}
          bounces={bounces}
          overScrollMode={overScrollMode}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          keyboardDismissMode={
            keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
          }
          scrollEnabled={swipeEnabled && Boolean(layout.width)}
          scrollToOverflowEnabled={false}
          scrollsToTop={false}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={onScroll}
          onScrollBeginDrag={handleSwipeStart}
          onScrollEndDrag={handleSwipeEnd}
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentOffset={contentOffset}
          contentContainerStyle={{
            width: layout.width ? `${routes.length * 100}%` : '100%',
          }}
          style={[styles.scroll, style]}
        >
          {children
            .map((child, i) => {
              const route = routes[i];
              const focused = i === index;

              if (!layout.width && !focused) {
                return null;
              }

              return (
                <View
                  key={route.key}
                  style={
                    layout.width
                      ? // FIXME: percentage width doesn't work on web
                        // So we use a fixed width instead
                        { width: layout.width }
                      : { width: '100%' }
                  }
                >
                  {child}
                </View>
              );
            })
            .filter((child) => child !== null)}
        </Animated.ScrollView>
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
  scroll: {
    flex: 1,
  },
});
