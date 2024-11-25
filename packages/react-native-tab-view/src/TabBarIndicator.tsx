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

const useNativeDriver = Platform.OS !== 'web';

const getTranslateX = (
  position: Animated.AnimatedInterpolation<number>,
  routes: Route[],
  getTabWidth: GetTabWidth,
  direction: LocaleDirection,
  gap?: number,
  width?: number | string
) => {
  const inputRange = routes.map((_, i) => i);

  // every index contains widths at all previous indices
  const outputRange = routes.reduce<number[]>((acc, _, i) => {
    if (typeof width === 'number') {
      if (i === 0) return [getTabWidth(i) / 2 - width / 2];

      let sumTabWidth = 0;
      for (let j = 0; j < i; j++) {
        sumTabWidth += getTabWidth(j);
      }

      return [
        ...acc,
        sumTabWidth + getTabWidth(i) / 2 + (gap ? gap * i : 0) - width / 2,
      ];
    } else {
      if (i === 0) return [0];
      return [...acc, acc[i - 1] + getTabWidth(i - 1) + (gap ?? 0)];
    }
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
          useNativeDriver,
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
        ? getTranslateX(position, routes, getTabWidth, direction, gap, width)
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

  const styleList: StyleProp<ViewStyle> = [];

  // scaleX doesn't work properly on chrome and opera for linux and android
  if (Platform.OS === 'web' && width === 'auto') {
    styleList.push(
      { width: transform[1].scaleX },
      { left: transform[0].translateX }
    );
  } else {
    styleList.push(
      { width: width === 'auto' ? 1 : width },
      { start: `${(100 / routes.length) * navigationState.index}%` },
      { transform }
    );
  }

  return (
    <Animated.View
      style={[
        styles.indicator,
        styleList,
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
    start: 0,
    bottom: 0,
    end: 0,
    height: 2,
  },
});
