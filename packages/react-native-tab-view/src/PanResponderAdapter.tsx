import * as React from 'react';
import {
  Animated,
  type GestureResponderEvent,
  Keyboard,
  PanResponder,
  type PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type {
  EventEmitterProps,
  Layout,
  Listener,
  NavigationState,
  PagerProps,
  Route,
} from './types';
import { useAnimatedValue } from './useAnimatedValue';

type Props<T extends Route> = PagerProps & {
  layout: Layout;
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

const DEAD_ZONE = 12;

const DefaultTransitionSpec = {
  timing: Animated.spring,
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
};

export function PanResponderAdapter<T extends Route>({
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
  animationEnabled = false,
  layoutDirection = 'ltr',
}: Props<T>) {
  const { routes, index } = navigationState;

  const panX = useAnimatedValue(0);

  const listenersRef = React.useRef<Listener[]>([]);

  const navigationStateRef = React.useRef(navigationState);
  const layoutRef = React.useRef(layout);
  const onIndexChangeRef = React.useRef(onIndexChange);
  const onTabSelectRef = React.useRef(onTabSelect);
  const currentIndexRef = React.useRef(index);
  const pendingIndexRef = React.useRef<number>(undefined);

  const swipeVelocityThreshold = 0.15;
  const swipeDistanceThreshold = layout.width / 1.75;

  const jumpToIndex = useLatestCallback(
    (index: number, animate = animationEnabled) => {
      const offset = -index * layoutRef.current.width;

      const { timing, ...transitionConfig } = DefaultTransitionSpec;

      if (animate) {
        Animated.parallel([
          timing(panX, {
            ...transitionConfig,
            toValue: offset,
            useNativeDriver: false,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            onIndexChangeRef.current(index);
            onTabSelectRef.current?.({ index });
            pendingIndexRef.current = undefined;
          }
        });
        pendingIndexRef.current = index;
      } else {
        panX.setValue(offset);
        onIndexChangeRef.current(index);
        onTabSelectRef.current?.({ index });
        pendingIndexRef.current = undefined;
      }
    }
  );

  React.useEffect(() => {
    navigationStateRef.current = navigationState;
    layoutRef.current = layout;
    onIndexChangeRef.current = onIndexChange;
    onTabSelectRef.current = onTabSelect;
  });

  React.useEffect(() => {
    const offset = -navigationStateRef.current.index * layout.width;

    panX.setValue(offset);
  }, [layout.width, panX]);

  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }

    if (layout.width && currentIndexRef.current !== index) {
      currentIndexRef.current = index;
      jumpToIndex(index);
    }
  }, [jumpToIndex, keyboardDismissMode, layout.width, index]);

  const isMovingHorizontally = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    return (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 2)
    );
  };

  const canMoveScreen = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    if (swipeEnabled === false) {
      return false;
    }

    const diffX =
      layoutDirection === 'rtl' ? -gestureState.dx : gestureState.dx;

    return (
      isMovingHorizontally(event, gestureState) &&
      ((diffX >= DEAD_ZONE && currentIndexRef.current > 0) ||
        (diffX <= -DEAD_ZONE && currentIndexRef.current < routes.length - 1))
    );
  };

  const startGesture = () => {
    onSwipeStart?.();

    if (keyboardDismissMode === 'on-drag') {
      Keyboard.dismiss();
    }

    panX.stopAnimation();
    // @ts-expect-error: _value is private, but docs use it as well
    panX.setOffset(panX._value);
  };

  const respondToGesture = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    const diffX =
      layoutDirection === 'rtl' ? -gestureState.dx : gestureState.dx;

    if (
      // swiping left
      (diffX > 0 && index <= 0) ||
      // swiping right
      (diffX < 0 && index >= routes.length - 1)
    ) {
      return;
    }

    if (layout.width) {
      // @ts-expect-error: _offset is private, but docs use it as well
      const position = (panX._offset + diffX) / -layout.width;
      const next =
        position > index ? Math.ceil(position) : Math.floor(position);

      if (next !== index) {
        listenersRef.current.forEach((listener) => listener(next));
      }
    }

    panX.setValue(diffX);
  };

  const finishGesture = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    panX.flattenOffset();

    onSwipeEnd?.();

    const currentIndex =
      typeof pendingIndexRef.current === 'number'
        ? pendingIndexRef.current
        : currentIndexRef.current;

    let nextIndex = currentIndex;

    if (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
      (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
        Math.abs(gestureState.vx) > swipeVelocityThreshold)
    ) {
      nextIndex = Math.round(
        Math.min(
          Math.max(
            0,
            layoutDirection === 'rtl'
              ? currentIndex + gestureState.dx / Math.abs(gestureState.dx)
              : currentIndex - gestureState.dx / Math.abs(gestureState.dx)
          ),
          routes.length - 1
        )
      );

      currentIndexRef.current = nextIndex;
    }

    if (!isFinite(nextIndex)) {
      nextIndex = currentIndex;
    }

    jumpToIndex(nextIndex, true);
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

  const jumpTo = useLatestCallback((key: string) => {
    const index = navigationStateRef.current.routes.findIndex(
      (route: { key: string }) => route.key === key
    );

    jumpToIndex(index);
    onIndexChange(index);
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: canMoveScreen,
    onMoveShouldSetPanResponderCapture: canMoveScreen,
    onPanResponderGrant: startGesture,
    onPanResponderMove: respondToGesture,
    onPanResponderTerminate: finishGesture,
    onPanResponderRelease: finishGesture,
    onPanResponderTerminationRequest: () => true,
  });

  const maxTranslate = layout.width * (routes.length - 1);
  const translateX = Animated.multiply(
    panX.interpolate({
      inputRange: [-maxTranslate, 0],
      outputRange: [-maxTranslate, 0],
      extrapolate: 'clamp',
    }),
    layoutDirection === 'rtl' ? -1 : 1
  );

  const position = React.useMemo(
    () => (layout.width ? Animated.divide(panX, -layout.width) : null),
    [layout.width, panX]
  );

  return children({
    position: position ?? new Animated.Value(index),
    addEnterListener,
    jumpTo,
    render: (children) => (
      <Animated.View
        style={[
          styles.sheet,
          layout.width
            ? {
                width: routes.length * layout.width,
                transform: [{ translateX }],
              }
            : null,
          style,
        ]}
        {...panResponder.panHandlers}
      >
        {React.Children.map(children, (child, i) => {
          const route = routes[i];
          const focused = i === index;

          return (
            <View
              key={route.key}
              style={
                layout.width
                  ? { width: layout.width }
                  : focused
                    ? StyleSheet.absoluteFill
                    : null
              }
            >
              {focused || layout.width ? child : null}
            </View>
          );
        })}
      </Animated.View>
    ),
  });
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
