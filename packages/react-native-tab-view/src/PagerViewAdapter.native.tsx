import * as React from 'react';
import { Animated, Keyboard, Platform, StyleSheet } from 'react-native';
import ViewPager, {
  type PagerViewProps,
  type PageScrollStateChangedNativeEvent,
} from 'react-native-pager-view';
import useLatestCallback from 'use-latest-callback';

import type { AdapterProps, Listener } from './types';
import { useAnimatedValue } from './useAnimatedValue';

const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager);

export type PagerViewAdapterProps = AdapterProps &
  Omit<
    PagerViewProps,
    | keyof AdapterProps
    | 'initialPage'
    | 'scrollEnabled'
    | 'onPageScroll'
    | 'onPageSelected'
    | 'onPageScrollStateChanged'
    | 'children'
  >;

const useNativeDriver = Platform.OS !== 'web';

export function PagerViewAdapter({
  keyboardDismissMode = 'auto',
  swipeEnabled = true,
  navigationState,
  onIndexChange,
  onTabSelect,
  onSwipeStart,
  onSwipeEnd,
  children,
  style,
  animationEnabled,
  layoutDirection = 'ltr',
  ...rest
}: PagerViewAdapterProps) {
  const { index, routes } = navigationState;

  const isRTL = layoutDirection === 'rtl';

  // iOS reports RTL pager offsets from the opposite end
  // So we need to invert them to get the logical route index
  const shouldInvertOffset = Platform.OS === 'ios' && isRTL;
  const initialPosition = shouldInvertOffset
    ? routes.length - 1 - index
    : index;

  const listeners = React.useRef<Set<Listener>>(new Set()).current;

  const pagerRef = React.useRef<ViewPager>(null);
  const indexRef = React.useRef<number>(index);
  const navigationStateRef = React.useRef(navigationState);

  const position = useAnimatedValue(initialPosition);
  const offset = useAnimatedValue(0);

  React.useEffect(() => {
    navigationStateRef.current = navigationState;
  });

  const setReportedOffset = useLatestCallback((index: number) => {
    position.setValue(shouldInvertOffset ? routes.length - 1 - index : index);
    offset.setValue(0);
  });

  const setPage = useLatestCallback((index: number) => {
    if (animationEnabled) {
      pagerRef.current?.setPage(index);
    } else {
      pagerRef.current?.setPageWithoutAnimation(index);
      setReportedOffset(index);
    }
  });

  const jumpTo = useLatestCallback((key: string) => {
    const index = navigationStateRef.current.routes.findIndex(
      (route: { key: string }) => route.key === key
    );

    setPage(index);
    onIndexChange(index);
  });

  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }

    if (indexRef.current !== index) {
      setPage(index);
    }
  }, [keyboardDismissMode, index, setPage]);

  const onPageScrollStateChanged = (
    state: PageScrollStateChangedNativeEvent
  ) => {
    const { pageScrollState } = state.nativeEvent;

    switch (pageScrollState) {
      case 'idle':
        onSwipeEnd?.();
        return;
      case 'dragging': {
        const subscription = offset.addListener(({ value }) => {
          const next =
            index + (value > 0 ? Math.ceil(value) : Math.floor(value));

          if (next !== index) {
            listeners.forEach((listener) =>
              listener({
                type: 'enter',
                index: next,
              })
            );
          }

          offset.removeListener(subscription);
        });

        onSwipeStart?.();
        return;
      }
    }
  };

  const subscribe = useLatestCallback((listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  });

  const memoizedPosition = React.useMemo(() => {
    const value = Animated.add(position, offset);

    // Convert the native RTL offset back to the logical route index
    return shouldInvertOffset
      ? Animated.subtract(routes.length - 1, value)
      : value;
  }, [offset, position, routes.length, shouldInvertOffset]);

  return children({
    position: memoizedPosition,
    subscribe,
    jumpTo,
    render: (children) => (
      <AnimatedViewPager
        {...rest}
        ref={pagerRef}
        style={[styles.container, style]}
        initialPage={index}
        layoutDirection={layoutDirection}
        keyboardDismissMode={
          keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
        }
        onPageScroll={Animated.event(
          [
            {
              nativeEvent: {
                position: position,
                offset: offset,
              },
            },
          ],
          { useNativeDriver }
        )}
        onPageSelected={(e) => {
          const index = e.nativeEvent.position;
          indexRef.current = index;
          onIndexChange(index);
          onTabSelect?.({ index });
        }}
        onPageScrollStateChanged={onPageScrollStateChanged}
        scrollEnabled={swipeEnabled}
      >
        {children}
      </AnimatedViewPager>
    ),
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
