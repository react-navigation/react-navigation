import { I18nManager } from 'react-native';
import Animated from 'react-native-reanimated';
import { CardInterpolationProps, CardInterpolatedStyle } from '../types';
import { getStatusBarHeight } from 'react-native-safe-area-view';

const { cond, add, multiply, interpolate } = Animated;

/**
 * Standard iOS-style slide in from the right.
 */
export function forHorizontalIOS({
  progress: { current, next },
  layouts: { screen },
}: CardInterpolationProps): CardInterpolatedStyle {
  const translateFocused = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [I18nManager.isRTL ? -screen.width : screen.width, 0],
  });
  const translateUnfocused = next
    ? interpolate(next, {
        inputRange: [0, 1],
        outputRange: [
          0,
          multiply(I18nManager.isRTL ? -screen.width : screen.width, -0.3),
        ],
      })
    : 0;

  const overlayOpacity = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [0, 0.07],
  });

  const shadowOpacity = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
    },
    overlayStyle: { opacity: overlayOpacity },
    shadowStyle: { shadowOpacity },
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
export function forVerticalIOS({
  progress: { current },
  layouts: { screen },
}: CardInterpolationProps): CardInterpolatedStyle {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateY },
      ],
    },
  };
}

/**
 * Standard iOS-style modal animation in iOS 13.
 */
export function forModalPresentationIOS({
  index,
  progress: { current, next },
  layouts: { screen },
}: CardInterpolationProps): CardInterpolatedStyle {
  const topOffset = 10;
  const statusBarHeight = getStatusBarHeight(screen.width > screen.height);
  const aspectRatio = screen.height / screen.width;

  const progress = add(current, next ? next : 0);

  const translateY = interpolate(progress, {
    inputRange: [0, 1, 2],
    outputRange: [
      screen.height,
      index === 0 ? 0 : topOffset,
      (index === 0 ? statusBarHeight : 0) - topOffset * aspectRatio,
    ],
  });

  const overlayOpacity = interpolate(progress, {
    inputRange: [0, 1, 2],
    outputRange: [0, 0.3, 1],
  });

  const scale = interpolate(progress, {
    inputRange: [0, 1, 2],
    outputRange: [1, 1, screen.width ? 1 - (topOffset * 2) / screen.width : 1],
  });

  const borderRadius =
    index === 0
      ? interpolate(progress, {
          inputRange: [0, 1, 2],
          outputRange: [0, 0, 10],
        })
      : 10;

  return {
    cardStyle: {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      marginTop: index === 0 ? 0 : statusBarHeight,
      transform: [{ translateY }, { scale }],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}

/**
 * Standard Android-style fade in from the bottom for Android Oreo.
 */
export function forFadeFromBottomAndroid({
  progress: { current },
  layouts: { screen },
  closing,
}: CardInterpolationProps): CardInterpolatedStyle {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [multiply(screen.height, 0.08), 0],
  });

  const opacity = cond(
    closing,
    current,
    interpolate(current, {
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.25, 0.7, 1],
    })
  );

  return {
    cardStyle: {
      opacity,
      transform: [{ translateY }],
    },
  };
}

/**
 * Standard Android-style wipe from the bottom for Android Pie.
 */
export function forWipeFromBottomAndroid({
  progress: { current, next },
  layouts: { screen },
}: CardInterpolationProps): CardInterpolatedStyle {
  const containerTranslateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
  });
  const cardTranslateYFocused = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [multiply(screen.height, 95.9 / 100, -1), 0],
  });
  const cardTranslateYUnfocused = next
    ? interpolate(next, {
        inputRange: [0, 1],
        outputRange: [0, multiply(screen.height, 2 / 100, -1)],
      })
    : 0;
  const overlayOpacity = interpolate(current, {
    inputRange: [0, 0.36, 1],
    outputRange: [0, 0.1, 0.1],
  });

  return {
    containerStyle: {
      transform: [{ translateY: containerTranslateY }],
    },
    cardStyle: {
      transform: [
        { translateY: cardTranslateYFocused },
        { translateY: cardTranslateYUnfocused },
      ],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}
