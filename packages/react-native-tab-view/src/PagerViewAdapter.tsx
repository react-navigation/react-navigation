import * as React from 'react';
import { Animated, Keyboard, StyleSheet } from 'react-native';
import ViewPager, {
  type PageScrollStateChangedNativeEvent,
} from 'react-native-pager-view';
import useLatestCallback from 'use-latest-callback';

import type {
  EventEmitterProps,
  Listener,
  NavigationState,
  PagerProps,
  Route,
} from './types';
import { useAnimatedValue } from './useAnimatedValue';

const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager);

type Props<T extends Route> = PagerProps & {
  onIndexChange: (index: number) => void;
  onTabSelect?: (props: { index: number }) => void;
  navigationState: NavigationState<T>;
  children: (
    props: EventEmitterProps & {
      // Animated value which represents the state of current index
      // It can include fractional digits as it represents the intermediate value
      position: Animated.AnimatedInterpolation<number>;
      // Function to actually render the content of the pager
      // The parent component takes care of rendering
      render: (children: React.ReactNode) => React.ReactNode;
      // Callback to call when switching the tab
      // The tab switch animation is performed even if the index in state is unchanged
      jumpTo: (key: string) => void;
    }
  ) => React.ReactElement;
};

export function PagerViewAdapter<T extends Route>({
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
  ...rest
}: Props<T>) {
  const { index } = navigationState;

  const listenersRef = React.useRef<Listener[]>([]);

  const pagerRef = React.useRef<ViewPager>(null);
  const indexRef = React.useRef<number>(index);
  const navigationStateRef = React.useRef(navigationState);

  const position = useAnimatedValue(index);
  const offset = useAnimatedValue(0);

  React.useEffect(() => {
    navigationStateRef.current = navigationState;
  });

  const jumpTo = useLatestCallback((key: string) => {
    const index = navigationStateRef.current.routes.findIndex(
      (route: { key: string }) => route.key === key
    );

    if (animationEnabled) {
      pagerRef.current?.setPage(index);
    } else {
      pagerRef.current?.setPageWithoutAnimation(index);
      position.setValue(index);
    }

    onIndexChange(index);
  });

  React.useEffect(() => {
    let subscription: { detach: () => void } | null = null;
    if (pagerRef.current) {
      // @ts-expect-error - Typescript types are missing but this API is exported by Animated since React Native 0.60.2
      // https://github.com/facebook/react-native/commit/77b8c097277b5cf248d08e772ea8bb8d8583e9a1
      // It allows to attach native event using native element's ref instead of passing in an event callback
      subscription = Animated.attachNativeEvent(
        pagerRef.current,
        'onPageScroll',
        [
          {
            nativeEvent: {
              position: position,
              offset: offset,
            },
          },
        ]
      );
    }
    return () => {
      subscription?.detach();
    };
  }, [offset, position]);

  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }

    if (indexRef.current !== index) {
      if (animationEnabled) {
        pagerRef.current?.setPage(index);
      } else {
        pagerRef.current?.setPageWithoutAnimation(index);
        position.setValue(index);
      }
    }
  }, [keyboardDismissMode, index, animationEnabled, position]);

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
            listenersRef.current.forEach((listener) => listener(next));
          }

          offset.removeListener(subscription);
        });

        onSwipeStart?.();
        return;
      }
    }
  };

  const addEnterListener = useLatestCallback((listener: Listener) => {
    listenersRef.current.push(listener);

    return () => {
      const index = listenersRef.current.indexOf(listener);

      if (index > -1) {
        listenersRef.current.splice(index, 1);
      }
    };
  });

  const memoizedPosition = React.useMemo(
    () => Animated.add(position, offset),
    [offset, position]
  );

  return children({
    position: memoizedPosition,
    addEnterListener,
    jumpTo,
    render: (children) => (
      <AnimatedViewPager
        {...rest}
        ref={pagerRef}
        style={[styles.container, style]}
        initialPage={index}
        keyboardDismissMode={
          keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
        }
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
