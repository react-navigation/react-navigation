import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import type {
  LocaleDirection,
  NavigationState,
  Route,
  SceneRendererProps,
} from './types';
import { useAnimatedValue } from './useAnimatedValue';

export type GetTabWidth = (index: number) => number;

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  width: 'auto' | `${number}%` | number;
  getTabWidth: GetTabWidth;
  direction: LocaleDirection;
  style?: StyleProp<ViewStyle>;
  gap?: number;
  children?: React.ReactNode;
};

const getTranslateX = (
  position: Animated.AnimatedInterpolation<number>,
  routes: Route[],
  getTabWidth: GetTabWidth,
  direction: LocaleDirection,
  gap?: number
) => {
  const inputRange = routes.map((_, i) => i);

  // every index contains widths at all previous indices
  const outputRange = routes.reduce<number[]>((acc, _, i) => {
    if (i === 0) return [0];
    return [...acc, acc[i - 1] + getTabWidth(i - 1) + (gap ?? 0)];
  }, []);

  const translateX = position.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });

  return Animated.multiply(translateX, direction === 'rtl' ? -1 : 1);
};

export function TabBarIndicator<T extends Route>({
  getTabWidth,
  layout,
  navigationState,
  position,
  width,
  direction,
  gap,
  style,
  children,
}: Props<T>) {
  const isIndicatorShown = React.useRef(false);
  const isWidthDynamic = width === 'auto';

  const opacity = useAnimatedValue(isWidthDynamic ? 0 : 1);

  const indicatorVisible = isWidthDynamic
    ? layout.width &&
      navigationState.routes
        .slice(0, navigationState.index)
        .every((_, r) => getTabWidth(r))
    : true;

  React.useEffect(() => {
    const fadeInIndicator = () => {
      if (
        !isIndicatorShown.current &&
        isWidthDynamic &&
        // We should fade-in the indicator when we have widths for all the tab items
        indicatorVisible
      ) {
        isIndicatorShown.current = true;

        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.linear),
          useNativeDriver: true,
        }).start();
      }
    };

    fadeInIndicator();

    return () => opacity.stopAnimation();
  }, [indicatorVisible, isWidthDynamic, opacity]);

  const { routes } = navigationState;

  const transform = [];

  if (layout.width) {
    const translateX =
      routes.length > 1
        ? getTranslateX(position, routes, getTabWidth, direction, gap)
        : 0;

    transform.push({ translateX });
  }

  if (width === 'auto') {
    const inputRange = routes.map((_, i) => i);
    const outputRange = inputRange.map(getTabWidth);

    transform.push(
      {
        scaleX:
          routes.length > 1
            ? position.interpolate({
                inputRange,
                outputRange,
                extrapolate: 'clamp',
              })
            : outputRange[0],
      },
      { translateX: direction === 'rtl' ? -0.5 : 0.5 }
    );
  }

  return (
    <Animated.View
      style={[
        styles.indicator,
        { width: width === 'auto' ? 1 : width },
        // If layout is not available, use `left` property for positioning the indicator
        // This avoids rendering delay until we are able to calculate translateX
        // If platform is macos use `left` property as `transform` is broken at the moment.
        // See: https://github.com/microsoft/react-native-macos/issues/280
        layout.width && Platform.OS !== 'macos'
          ? { left: 0 }
          : { left: `${(100 / routes.length) * navigationState.index}%` },
        { transform },
        width === 'auto' ? { opacity: opacity } : null,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});
