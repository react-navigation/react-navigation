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

const calculateSize = (
  value: ViewStyle['width'] | undefined,
  referenceWidth: number
): number | undefined => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.endsWith('%')) {
    const parsed = parseFloat(value);

    if (Number.isFinite(parsed)) {
      return referenceWidth * (parsed / 100);
    }
  }

  return undefined;
};

const getIndicatorWidthWithMargins = (
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
    width -
      (calculateSize(leftMargin, width) ?? 0) -
      (calculateSize(rightMargin, width) ?? 0)
  );
};

const getIndicatorWidth = (
  tabWidth: number,
  width: number | `${number}%`,
  style: ViewStyle | undefined,
  direction: LocaleDirection
): number | `${number}%` => {
  const customWidth = calculateSize(style?.width, tabWidth);

  if (customWidth !== undefined) {
    return customWidth;
  }

  if (typeof width === 'number') {
    return getIndicatorWidthWithMargins(width, style, direction);
  }

  return width;
};

const getTranslateX = (
  position: Animated.AnimatedInterpolation<number>,
  routes: Route[],
  getTabWidth: GetTabWidth,
  direction: LocaleDirection,
  gap?: number,
  getWidth?: (index: number) => number | undefined
) => {
  const inputRange = routes.map((_, i) => i);
  const outputRange = routes.map((_, i) => {
    let sumTabWidth = 0;

    for (let j = 0; j < i; j++) {
      sumTabWidth += getTabWidth(j);
    }

    const indicatorWidth = getWidth?.(i);
    const tabOffset = sumTabWidth + (gap ? gap * i : 0);

    if (indicatorWidth === undefined) {
      return tabOffset;
    }

    return tabOffset + getTabWidth(i) / 2 - indicatorWidth / 2;
  });

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

  const flattenedStyle = StyleSheet.flatten(style);

  const hasCustomIndicatorWidth =
    typeof flattenedStyle?.width === 'number' ||
    (typeof flattenedStyle?.width === 'string' &&
      flattenedStyle?.width.endsWith('%'));

  const constantIndicatorWidth =
    typeof flattenedStyle?.width === 'number'
      ? flattenedStyle.width
      : undefined;

  const isCentered =
    hasCustomIndicatorWidth &&
    (flattenedStyle?.margin === 'auto' ||
      flattenedStyle?.marginHorizontal === 'auto');

  // If indicator has a custom width, we need to adjust calculations to account for it
  // It should be centered relative to the tab if the margin is set to auto
  const getCenteredIndicatorWidth = (tabWidth: number) => {
    if (isCentered) {
      return calculateSize(flattenedStyle?.width, tabWidth);
    }

    if (typeof width === 'number') {
      return width;
    }

    return undefined;
  };

  const opacity = useAnimatedValue(isWidthDynamic ? 0 : 1);

  // We should fade-in the indicator when we have widths for all the tab items
  const indicatorVisible = isWidthDynamic
    ? layout.width &&
      navigationState.routes
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
    layout.width && routes.length > 1
      ? getTranslateX(position, routes, getTabWidth, direction, gap, (index) =>
          getCenteredIndicatorWidth(getTabWidth(index))
        )
      : 0;

  transform.push({ translateX });

  if (width === 'auto' && constantIndicatorWidth == null) {
    const inputRange = routes.map((_, i) => i);
    const outputRange = inputRange.map((i) => {
      const tabW = getTabWidth(i);

      return (
        calculateSize(flattenedStyle?.width, tabW) ??
        getIndicatorWidthWithMargins(tabW, flattenedStyle, direction)
      );
    });

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
  if (
    Platform.OS === 'web' &&
    width === 'auto' &&
    constantIndicatorWidth == null
  ) {
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
            ? // if the indicator has a constant width, use it as is
              // we don't need to scale it to match tab width
              (constantIndicatorWidth ?? 1)
            : getIndicatorWidth(
                getTabWidth(navigationState.index),
                width,
                flattenedStyle,
                direction
              ),
      },
      { start: `${(100 / routes.length) * navigationState.index}%` },
      { transform }
    );
  }

  let finalStyle;

  if (hasCustomIndicatorWidth && style != null) {
    const rest = { ...flattenedStyle };

    delete rest.width;

    if (isCentered) {
      if (rest.margin === 'auto') {
        delete rest.margin;
      }

      if (rest.marginHorizontal === 'auto') {
        delete rest.marginHorizontal;
      }
    }

    finalStyle = rest;
  } else {
    finalStyle = style;
  }

  return (
    <Animated.View
      style={[
        styles.indicator,
        styleList,
        width === 'auto' ? { opacity: opacity } : null,
        finalStyle,
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
