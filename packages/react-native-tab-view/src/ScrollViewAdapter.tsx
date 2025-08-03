import * as React from 'react';
import {
  Animated,
  InteractionManager,
  Keyboard,
  type ScrollView,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { CommonPagerProps, Listener, Route } from './types';

type ScrollPagerProps<T extends Route> = Props<T> & {
  keyboardDismissMode?: 'none' | 'on-drag' | 'auto';
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
};

type Props<T extends Route> = CommonPagerProps<T> & {
  style?: StyleProp<ViewStyle>;
};

export function ScrollViewAdapter<T extends Route>({
  layout,
  keyboardDismissMode = 'auto',
  swipeEnabled = true,
  navigationState,
  onIndexChange,
  onTabSelect,
  onSwipeStart,
  onSwipeEnd,
  children,
  style,
  animationEnabled = true,
  ...rest
}: ScrollPagerProps<T>) {
  const { index, routes } = navigationState;

  const listeners = React.useRef<Set<Listener>>(new Set()).current;

  const wasTouchedRef = React.useRef<boolean>(false);
  const interactionHandleRef = React.useRef<number | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const initialOffset = React.useMemo(
    () => ({
      x: index * layout.width,
      y: 0,
    }),
    [index, layout.width]
  );

  const [offsetX] = React.useState(() => new Animated.Value(initialOffset.x));

  const [layoutWidth] = React.useState(() => new Animated.Value(layout.width));

  React.useLayoutEffect(() => {
    layoutWidth.setValue(layout.width);
  }, [layout.width, layoutWidth]);

  const scrollToIndex = useLatestCallback(
    (index: number, animated = animationEnabled) => {
      scrollViewRef.current?.scrollTo({
        x: index * layout.width,
        animated,
      });
    }
  );

  const jumpTo = useLatestCallback((key: string) => {
    wasTouchedRef.current = false;

    const i = navigationState.routes.findIndex((route: T) => route.key === key);

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
    scrollToIndex(index, isInitialRef.current ? false : animationEnabled);

    isInitialRef.current = false;
  }, [animationEnabled, index, routes.length, scrollToIndex]);

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

  const addEnterListener = useLatestCallback((listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  });

  const position = React.useMemo(
    () => Animated.divide(offsetX, layoutWidth),
    [offsetX, layoutWidth]
  );

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
      listener: (event) => {
        // TODO: call listeners when the scroll position changes
      },
    }
  );

  return children({
    position,
    addEnterListener,
    jumpTo,
    render: (children: React.ReactNode) => (
      <Animated.ScrollView
        {...rest}
        pagingEnabled
        directionalLockEnabled
        keyboardShouldPersistTaps="always"
        scrollToOverflowEnabled
        scrollEnabled={swipeEnabled}
        automaticallyAdjustContentInsets={false}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={onScroll}
        onScrollBeginDrag={handleSwipeStart}
        onScrollEndDrag={handleSwipeEnd}
        onMomentumScrollEnd={onScroll}
        contentOffset={initialOffset}
        style={[styles.container, style]}
        contentContainerStyle={
          layout.width
            ? {
                flexDirection: 'row',
                width: layout.width * navigationState.routes.length,
                flex: 1,
              }
            : null
        }
        ref={scrollViewRef}
      >
        {children}
      </Animated.ScrollView>
    ),
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
