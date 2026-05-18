import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { TAB_BAR_PRIMARY_ACTIVE_COLOR } from './constants';
import type {
  LocaleDirection,
  NavigationState,
  Route,
  SceneRendererProps,
} from './types';

const CAP_FILL_OVERLAP = 1;
const EASING_SAMPLE_COUNT = 16;

const samplePoints = (easing: (t: number) => number) =>
  Array.from({ length: EASING_SAMPLE_COUNT + 1 }, (_, i) =>
    easing(i / EASING_SAMPLE_COUNT)
  );

const TRAILING_EDGE_SAMPLES = samplePoints(Easing.bezier(0.3, 0, 0.8, 0.15));
const LEADING_EDGE_SAMPLES = samplePoints(Easing.bezier(0.05, 0.7, 0.1, 1));

export type Props<T extends Route> = SceneRendererProps & {
  variant?: 'primary' | 'secondary' | undefined;
  navigationState: NavigationState<T>;
  widths: number[];
  offsets: number[];
  direction: LocaleDirection;
  style?: StyleProp<ViewStyle>;
};

export function TabBarIndicator<T extends Route>({
  variant = 'primary',
  widths,
  offsets,
  navigationState,
  position,
  direction,
  style,
}: Props<T>) {
  const isRTL = direction === 'rtl';

  const flattenedStyle: ViewStyle =
    StyleSheet.flatten([styles.defaults, style]) || {};

  const {
    backgroundColor,
    borderRadius,
    borderBottomEndRadius = borderRadius,
    borderBottomLeftRadius = borderRadius,
    borderBottomRightRadius = borderRadius,
    borderBottomStartRadius = borderRadius,
    borderTopEndRadius = borderRadius,
    borderTopLeftRadius = borderRadius,
    borderTopRightRadius = borderRadius,
    borderTopStartRadius = borderRadius,
    height,
    start: indicatorStart,
    end: indicatorEnd,
    left: indicatorLeft,
    right: indicatorRight,
    ...restStyle
  } = flattenedStyle;

  delete restStyle.width;
  delete restStyle.margin;
  delete restStyle.marginHorizontal;
  delete restStyle.marginStart;
  delete restStyle.marginEnd;
  delete restStyle.marginLeft;
  delete restStyle.marginRight;

  const containerStart =
    indicatorStart ?? (isRTL ? indicatorRight : indicatorLeft);
  const containerEnd = indicatorEnd ?? (isRTL ? indicatorLeft : indicatorRight);

  if (
    (borderBottomEndRadius != null &&
      typeof borderBottomEndRadius !== 'number') ||
    (borderBottomStartRadius != null &&
      typeof borderBottomStartRadius !== 'number') ||
    (borderBottomLeftRadius != null &&
      typeof borderBottomLeftRadius !== 'number') ||
    (borderBottomRightRadius != null &&
      typeof borderBottomRightRadius !== 'number') ||
    (borderTopEndRadius != null && typeof borderTopEndRadius !== 'number') ||
    (borderTopStartRadius != null &&
      typeof borderTopStartRadius !== 'number') ||
    (borderTopLeftRadius != null && typeof borderTopLeftRadius !== 'number') ||
    (borderTopRightRadius != null && typeof borderTopRightRadius !== 'number')
  ) {
    throw new Error(
      'Only numeric border radii are supported in TabBarIndicator.'
    );
  }

  const leftRadiusWidth = Math.max(
    borderTopStartRadius ?? 0,
    borderBottomStartRadius ?? 0,
    (isRTL ? borderTopRightRadius : borderTopLeftRadius) ?? 0,
    (isRTL ? borderBottomRightRadius : borderBottomLeftRadius) ?? 0
  );

  const rightRadiusWidth = Math.max(
    borderTopEndRadius ?? 0,
    borderBottomEndRadius ?? 0,
    (isRTL ? borderTopLeftRadius : borderTopRightRadius) ?? 0,
    (isRTL ? borderBottomLeftRadius : borderBottomRightRadius) ?? 0
  );

  const leftPieceWidth = leftRadiusWidth + CAP_FILL_OVERLAP;
  const rightPieceWidth = rightRadiusWidth + CAP_FILL_OVERLAP;

  const { routes } = navigationState;

  const easedInterpolate = (values: number[], samples: number[] | null) => {
    if (routes.length <= 1) {
      return values[0] ?? 0;
    }

    // On multi-tab jumps, slide directly from source to destination and
    // Settle one tab before the pager finishes scrolling
    // This makes the animation feel snappier
    // Especially on Android where the pager animation is slow
    if (jumpRange) {
      const inputRange =
        jumpRange.from > jumpRange.to
          ? [jumpRange.to, jumpRange.to + 1, jumpRange.from]
          : [jumpRange.from, jumpRange.to - 1, jumpRange.to];

      const outputRange = inputRange.map((i) =>
        i === jumpRange.from ? values[jumpRange.from] : values[jumpRange.to]
      );

      return position.interpolate({
        inputRange,
        outputRange,
        extrapolate: 'clamp',
      });
    }

    if (samples == null) {
      return position.interpolate({
        inputRange: values.map((_, i) => i),
        outputRange: values,
        extrapolate: 'clamp',
      });
    }

    const inputRange: number[] = [];
    const outputRange: number[] = [];

    for (let i = 0; i < values.length - 1; i++) {
      const start = values[i];
      const end = values[i + 1];

      for (let j = 0; j < samples.length - 1; j++) {
        inputRange.push(i + j / EASING_SAMPLE_COUNT);
        outputRange.push(start + (end - start) * samples[j]);
      }
    }

    inputRange.push(values.length - 1);
    outputRange.push(values[values.length - 1]);

    return position.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  };

  let containerLayout: ViewStyle;
  let leftFillStyle: ViewStyle;
  let centerFillStyle: ViewStyle;
  let rightCapStyle: ViewStyle;
  let rightFillStyle: ViewStyle;

  const rightEdges = widths.map((w, i) => offsets[i] + w);

  const [lastIndex, setLastIndex] = React.useState(navigationState.index);
  const [jumpRange, setJumpRange] = React.useState<{
    from: number;
    to: number;
  } | null>(null);

  if (navigationState.index !== lastIndex) {
    setLastIndex(navigationState.index);

    if (Math.abs(navigationState.index - lastIndex) > 1) {
      setJumpRange({ from: lastIndex, to: navigationState.index });
    }
  }

  React.useEffect(() => {
    if (jumpRange == null) {
      return;
    }

    const timer = setTimeout(() => {
      setJumpRange(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [jumpRange]);

  // Primary tabs use stretch animation
  // Secondary tabs and multi-tab jumps slide linearly
  const shouldStretch = variant === 'primary' && jumpRange == null;

  const trailingSamples = shouldStretch ? TRAILING_EDGE_SAMPLES : null;
  const leadingSamples = shouldStretch ? LEADING_EDGE_SAMPLES : null;

  const offset = easedInterpolate(offsets, trailingSamples);
  const rightEdge = easedInterpolate(rightEdges, leadingSamples);

  const containerWidth = Animated.subtract(rightEdge, offset);
  const sideFillWidth = Animated.divide(
    Animated.subtract(containerWidth, leftPieceWidth + rightPieceWidth),
    2
  );
  const sideFillScale = Animated.add(sideFillWidth, CAP_FILL_OVERLAP);

  if (Platform.OS === 'web') {
    const centerFillStart = Animated.add(sideFillWidth, leftPieceWidth);

    const positioned =
      typeof containerStart === 'number'
        ? Animated.add(offset, containerStart)
        : offset;

    // Web can't reliably scale via transforms
    // So the fills use animated `width` instead of `scaleX`
    // See https://github.com/react-navigation/react-navigation/pull/11440
    containerLayout = {
      width: containerWidth,
      ...(direction === 'rtl' ? { right: positioned } : { left: positioned }),
    };

    leftFillStyle = {
      position: 'absolute',
      start: leftRadiusWidth,
      width: sideFillScale,
    };

    centerFillStyle = {
      position: 'absolute',
      start: centerFillStart,
      width: sideFillWidth,
    };

    rightCapStyle = {
      position: 'absolute',
      end: 0,
    };

    rightFillStyle = {
      position: 'absolute',
      end: rightRadiusWidth,
      width: sideFillScale,
    };
  } else {
    const directionSign = direction === 'rtl' ? -1 : 1;
    const translateX = Animated.multiply(offset, directionSign);

    const centerFillTranslateX = Animated.multiply(
      Animated.divide(sideFillWidth, 2),
      directionSign
    );

    const rightCapTranslateX = Animated.multiply(
      Animated.subtract(containerWidth, rightPieceWidth),
      directionSign
    );

    containerLayout = {
      start: containerStart ?? 0,
      end: containerEnd ?? 0,
      transform: [{ translateX }],
    };

    leftFillStyle = {
      position: 'absolute',
      start: leftRadiusWidth,
      width: 1,
      transformOrigin: isRTL ? 'right center' : 'left center',
      transform: [{ scaleX: sideFillScale }],
    };

    centerFillStyle = {
      position: 'absolute',
      start: leftPieceWidth,
      width: 1,
      transformOrigin: isRTL ? 'right center' : 'left center',
      transform: [
        {
          translateX: centerFillTranslateX,
        },
        { scaleX: sideFillWidth },
      ],
    };

    rightCapStyle = {
      position: 'absolute',
      start: 0,
      transform: [{ translateX: rightCapTranslateX }],
    };

    rightFillStyle = {
      position: 'absolute',
      end: rightRadiusWidth,
      width: 1,
      transformOrigin: isRTL ? 'left center' : 'right center',
      transform: [{ scaleX: sideFillScale }],
    };
  }

  // The tab widths may be measured asynchronously
  // So we show the indicator when we have widths till focused tab
  const indicatorVisible = widths
    .slice(0, navigationState.index + 1)
    .every((w, i) => w > 0 && offsets[i] >= 0);

  /**
   * We render the indicator in multiple pieces
   * So we can preserve border radii when the indicator is scaled with transform
   * We use 3 pieces for the inner fill as the math isn't correct on Android
   * So using 1 or 2 pieces result in misalignment or gaps.
   * Using 3 pieces lets us cover most space from all directions.
   *
   * [left fixed cap [left scaled fill >>>]]
   *                  [center scaled fill]
   *                [[<<< right scaled fill] right fixed cap]
   */
  return (
    <Animated.View
      style={[
        styles.indicator,
        {
          height,
          opacity: indicatorVisible ? 1 : 0,
        },
        containerLayout,
        restStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            backgroundColor,
            borderTopStartRadius,
            borderBottomStartRadius,
            ...(isRTL
              ? { borderTopRightRadius, borderBottomRightRadius }
              : { borderTopLeftRadius, borderBottomLeftRadius }),
            height,
            width: leftPieceWidth,
          },
          styles.cap,
        ]}
      >
        <Animated.View style={[{ backgroundColor, height }, leftFillStyle]} />
      </Animated.View>
      <Animated.View style={[{ backgroundColor, height }, centerFillStyle]} />
      <Animated.View
        style={[
          {
            backgroundColor,
            borderTopEndRadius,
            borderBottomEndRadius,
            ...(isRTL
              ? { borderTopLeftRadius, borderBottomLeftRadius }
              : { borderTopRightRadius, borderBottomRightRadius }),
            height,
            width: rightPieceWidth,
          },
          rightCapStyle,
        ]}
      >
        <Animated.View style={[{ backgroundColor, height }, rightFillStyle]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  defaults: {
    backgroundColor: TAB_BAR_PRIMARY_ACTIVE_COLOR,
    height: 2,
  },
  cap: {
    position: 'absolute',
    start: 0,
  },
});
