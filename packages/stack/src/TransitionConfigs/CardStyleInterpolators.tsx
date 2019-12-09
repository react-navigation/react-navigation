import Animated from 'react-native-reanimated';
import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '../types';

const { cond, add, multiply, interpolate } = Animated;

/**
 * Standard iOS-style slide in from the right.
 */
export function forHorizontalIOS({
  current,
  next,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateFocused = multiply(
    interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [screen.width, 0],
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        interpolate(next.progress, {
          inputRange: [0, 1],
          outputRange: [0, multiply(screen.width, -0.3)],
        }),
        inverted
      )
    : 0;

  const overlayOpacity = interpolate(current.progress, {
    inputRange: [0, 1],
    outputRange: [0, 0.07],
  });

  const shadowOpacity = interpolate(current.progress, {
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
  current,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateY = multiply(
    interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
    }),
    inverted
  );

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
  current,
  next,
  inverted,
  layouts: { screen },
  insets,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const isLandscape = screen.width > screen.height;
  const topOffset = isLandscape ? 0 : 10;
  const statusBarHeight = insets.top;
  const aspectRatio = screen.height / screen.width;

  const progress = add(current.progress, next ? next.progress : 0);

  const translateY = multiply(
    interpolate(progress, {
      inputRange: [0, 1, 2],
      outputRange: [
        screen.height,
        index === 0 ? 0 : topOffset,
        (index === 0 ? statusBarHeight : 0) - topOffset * aspectRatio,
      ],
    }),
    inverted
  );

  const overlayOpacity = interpolate(progress, {
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0.3, 1, 1],
  });

  const scale = isLandscape
    ? 1
    : interpolate(progress, {
        inputRange: [0, 1, 2],
        outputRange: [
          1,
          1,
          screen.width ? 1 - (topOffset * 2) / screen.width : 1,
        ],
      });

  const borderRadius = isLandscape
    ? 0
    : index === 0
    ? interpolate(progress, {
        inputRange: [0, 1, 2],
        outputRange: [0, 0, 10],
      })
    : 10;

  return {
    cardStyle: {
      overflow: 'hidden',
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
  current,
  inverted,
  layouts: { screen },
  closing,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateY = multiply(
    interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [multiply(screen.height, 0.08), 0],
    }),
    inverted
  );

  const opacity = cond(
    closing,
    current.progress,
    interpolate(current.progress, {
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
 * Standard Android-style reveal from the bottom for Android Pie.
 */
export function forRevealFromBottomAndroid({
  current,
  next,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const containerTranslateY = multiply(
    interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
    }),
    inverted
  );

  const cardTranslateYFocused = multiply(
    interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [multiply(screen.height, 95.9 / 100, -1), 0],
    }),
    inverted
  );

  const cardTranslateYUnfocused = next
    ? multiply(
        interpolate(next.progress, {
          inputRange: [0, 1],
          outputRange: [0, multiply(screen.height, 2 / 100, -1)],
        }),
        inverted
      )
    : 0;

  const overlayOpacity = interpolate(current.progress, {
    inputRange: [0, 0.36, 1],
    outputRange: [0, 0.1, 0.1],
  });

  return {
    containerStyle: {
      overflow: 'hidden',
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

/**
 * Standard Android-style reveal from the bottom for Android Q.
 */
export function forScaleFromCenterAndroid({
  current,
  next,
  closing,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const progress = add(current.progress, next ? next.progress : 0);

  const opacity = interpolate(progress, {
    inputRange: [0, 0.8, 1, 1.2, 2],
    outputRange: [0, 0.5, 1, 0.33, 0],
  });

  const scale = cond(
    closing,
    interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    }),
    interpolate(progress, {
      inputRange: [0, 1, 2],
      outputRange: [0.85, 1, 1.1],
    })
  );

  return {
    containerStyle: {
      opacity,
      transform: [{ scale }],
    },
  };
}
