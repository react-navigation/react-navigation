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

const getInset = (
  value: ViewStyle['marginLeft'] | undefined,
  layoutWidth: number
) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.endsWith('%')) {
    const inset = parseFloat(value);

    if (Number.isFinite(inset)) {
      return layoutWidth * (inset / 100);
    }
  }

  return 0;
};

const getIndicatorWidth = (
  width: number,
  style: ViewStyle | undefined,
  direction: LocaleDirection
) => {
  const marginHorizontal = style?.marginHorizontal ?? style?.margin;

  const leftMargin =
    (direction === 'ltr' ? style?.marginStart : style?.marginEnd) ??
    style?.marginLeft ??
    marginHorizontal;

  const rightMargin =
    (direction === 'rtl' ? style?.marginStart : style?.marginEnd) ??
    style?.marginRight ??
    marginHorizontal;

  return Math.max(
    0,
    width - getInset(leftMargin, width) - getInset(rightMargin, width)
  );
};

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
  const flattenedStyle = StyleSheet.flatten(style);

  const opacity = useAnimatedValue(isWidthDynamic ? 0 : 1);

  // We should fade-in the indicator when we have widths for all the tab items
  const indicatorVisible = isWidthDynamic
    ? navigationState.routes
        .slice(0, navigationState.index + 1)
        .every((_, r) => getTabWidth(r))
    : true;

  React.useEffect(() => {
    const fadeInIndicator = () => {
      if (!isIndicatorShown.current && isWidthDynamic && indicatorVisible) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.linear),
          useNativeDriver,
        }).start(({ finished }) => {
          if (finished) {
            isIndicatorShown.current = true;
          }
        });
      }
    };

    fadeInIndicator();

    return () => opacity.stopAnimation();
  }, [indicatorVisible, isWidthDynamic, opacity]);

  const { routes } = navigationState;

  const transform = [];

  const translateX =
    routes.length > 1
      ? getTranslateX(position, routes, getTabWidth, direction, gap, width)
      : 0;

  transform.push({ translateX });

  if (width === 'auto') {
    const inputRange = routes.map((_, i) => i);
    const outputRange = inputRange.map((i) =>
      getIndicatorWidth(getTabWidth(i), flattenedStyle, direction)
    );

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

  // transform doesn't work properly on chrome and opera for linux and android
  // so we need to use width and left/right instead of scaleX and translateX
  // https://github.com/react-navigation/react-navigation/pull/11440
  if (Platform.OS === 'web' && width === 'auto') {
    const start = flattenedStyle?.start;
    const translate =
      direction === 'rtl' ? Animated.multiply(translateX, -1) : translateX;
    const offset =
      typeof start === 'number' ? Animated.add(translate, start) : translate;

    styleList.push(
      { width: transform[1].scaleX },
      direction === 'rtl' ? { right: offset } : { left: offset }
    );
  } else {
    styleList.push(
      {
        width:
          width === 'auto'
            ? 1
            : typeof width === 'number'
              ? getIndicatorWidth(width, flattenedStyle, direction)
              : width,
      },
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
    backgroundColor: 'rgb(0, 122, 255)',
    position: 'absolute',
    start: 0,
    bottom: 0,
    end: 0,
    height: 2,
  },
});
