import * as React from 'react';
import {
  Animated,
  InteractionManager,
  Keyboard,
  type ScrollView,
  StyleSheet,
  type ViewProps,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { AdapterProps, Listener } from './types';

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
  layout,
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
  layoutDirection: _, // Not supported in ScrollViewAdapter
  decelerationRate = 'fast',
  bounces = false,
  overScrollMode = 'never',
  keyboardShouldPersistTaps = 'always',
  ...rest
}: ScrollViewAdapterProps) {
  const { index, routes } = navigationState;

  const listeners = React.useRef<Set<Listener>>(new Set()).current;

  const wasTouchedRef = React.useRef<boolean>(false);
  const interactionHandleRef = React.useRef<number | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const [contentOffset, setInitialOffset] = React.useState(() => ({
    x: index * layout.width,
    y: 0,
  }));

  const [offsetX] = React.useState(() => new Animated.Value(contentOffset.x));

  const scrollToIndex = useLatestCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * layout.width,
      animated: animationEnabled,
    });
  });

  const jumpTo = useLatestCallback((key: string) => {
    wasTouchedRef.current = false;

    const i = routes.findIndex((route) => route.key === key);

    if (index === i) {
      scrollToIndex(i);
    } else {
      onIndexChange(i);

      if (keyboardDismissMode === 'auto') {
        Keyboard.dismiss();
      }
    }
  });

  const isInitialRef = React.useRef(true);

  React.useLayoutEffect(() => {
    if (!layout.width) {
      return;
    }

    if (isInitialRef.current) {
      const x = index * layout.width;

      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-layout-effect
      setInitialOffset({ x, y: 0 });

      offsetX.setValue(x);
    } else if (indexRef.current !== index) {
      scrollToIndex(index);
    }

    isInitialRef.current = false;
  }, [index, scrollToIndex, layout.width, offsetX]);

  React.useEffect(() => {
    return () => {
      if (interactionHandleRef.current !== null) {
        InteractionManager.clearInteractionHandle(interactionHandleRef.current);
      }
    };
  }, []);

  const handleSwipeStart = React.useCallback(() => {
    wasTouchedRef.current = false;
    onSwipeStart?.();
    interactionHandleRef.current = InteractionManager.createInteractionHandle();
  }, [onSwipeStart]);

  const handleSwipeEnd = React.useCallback(() => {
    wasTouchedRef.current = true;
    onSwipeEnd?.();
    if (interactionHandleRef.current !== null) {
      InteractionManager.clearInteractionHandle(interactionHandleRef.current);
    }
  }, [onSwipeEnd]);

  const subscribe = useLatestCallback((listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  });

  const position = React.useMemo(
    () =>
      layout.width
        ? Animated.divide(offsetX, layout.width)
        : new Animated.Value(index),
    [index, layout.width, offsetX]
  );

  const indexRef = React.useRef(index);

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { x: offsetX },
        },
      },
    ],
    {
      useNativeDriver: true,
      listener: (event: ScrollEvent) => {
        const value = clamp(
          event.nativeEvent.contentOffset.x / layout.width,
          0,
          routes.length - 1
        );

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
      },
    }
  );

  const onMomentumScrollEnd = (event: ScrollEvent) => {
    const value = clamp(
      event.nativeEvent.contentOffset.x / layout.width,
      0,
      routes.length - 1
    );

    if (value % 1 === 0) {
      indexRef.current = value;

      if (value !== index) {
        onIndexChange(value);
      }

      onTabSelect?.({ index: value });
    }
  };

  return children({
    position,
    subscribe,
    jumpTo,
    render: (children) => (
      <Animated.ScrollView
        {...rest}
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
        scrollEnabled={swipeEnabled}
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
        style={[styles.container, style]}
        contentContainerStyle={{
          width: `${routes.length * 100}%`,
        }}
        ref={scrollViewRef}
      >
        {children}
      </Animated.ScrollView>
    ),
  });
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
