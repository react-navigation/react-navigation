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

import type { AdapterProps, Listener } from './types';
import { useAnimatedValue } from './useAnimatedValue';
import { useMeasureLayout } from './useMeasureLayout';

export type PanResponderAdapterProps = AdapterProps;

const DEAD_ZONE = 12;

const DefaultTransitionSpec = {
  timing: Animated.spring,
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
};

export function PanResponderAdapter({
  keyboardDismissMode,
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
}: PanResponderAdapterProps) {
  const { routes, index } = navigationState;

  const containerRef = React.useRef<View>(null);
  const [layout, onLayout] = useMeasureLayout(containerRef);

  const panX = useAnimatedValue(0);

  const listeners = React.useRef<Set<Listener>>(new Set()).current;

  const navigationStateRef = React.useRef(navigationState);
  const onIndexChangeRef = React.useRef(onIndexChange);
  const onTabSelectRef = React.useRef(onTabSelect);
  const currentIndexRef = React.useRef(index);
  const pendingIndexRef = React.useRef<number>(undefined);

  const swipeVelocityThreshold = 0.15;
  const swipeDistanceThreshold = layout.width / 1.75;

  const jumpToIndex = useLatestCallback(
    (index: number, animate = animationEnabled) => {
      const offset = -index * layout.width;

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
        listeners.forEach((listener) =>
          listener({
            type: 'enter',
            index: next,
          })
        );
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

  const subscribe = useLatestCallback((listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
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
    subscribe,
    jumpTo,
    render: (children) => (
      <View ref={containerRef} onLayout={onLayout} style={styles.container}>
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
          {children.map((child, i) => {
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
                    ? { width: layout.width }
                    : focused
                      ? StyleSheet.absoluteFill
                      : null
                }
              >
                {child}
              </View>
            );
          })}
        </Animated.View>
      </View>
    ),
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
