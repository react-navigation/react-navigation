import { isLiquidGlassSupported } from '@react-navigation/elements/internal';
import { Animated } from 'react-native';

import type {
  StackHeaderInterpolatedStyle,
  StackHeaderInterpolationProps,
} from '../types';

const { add, multiply } = Animated;

/**
 * Standard UIKit style animation for the header where the title fades into the back button label.
 */
export function forUIKit({
  current,
  next,
  direction,
  layouts,
}: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle {
  const multiplier = direction === 'rtl' ? -1 : 1;

  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  if (isLiquidGlassSupported) {
    const opacity = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        // FIXME: Liquid glass views don't work properly with `opacity: 0`
        // So we use a small value instead to workaround this issue.
        0.1, 1, 1,
      ],
    });

    const translateX = multiply(
      multiplier,
      progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [layouts.screen.width, 0, -layouts.screen.width * 0.3],
      })
    );

    return {
      leftButtonStyle: { opacity },
      rightButtonStyle: { opacity },
      titleStyle: {
        transform: [{ translateX }],
      },
      backgroundStyle: {
        transform: [{ translateX }],
      },
    };
  }

  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1, 1.9, 2],
        outputRange: [0, 1, 1, 0],
      }),
    },
  };
}

/**
 * Simple fade animation for the header elements.
 */
export function forFade({
  current,
  next,
}: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle {
  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1, 1.9, 2],
        outputRange: [0, 1, 1, 0],
      }),
    },
  };
}

/**
 * Simple translate animation to translate the header to left.
 */
export function forSlideLeft({
  current,
  next,
  direction,
  layouts: { screen },
}: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle {
  const isRTL = direction === 'rtl';
  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  const translateX = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: isRTL
      ? [-screen.width, 0, screen.width]
      : [screen.width, 0, -screen.width],
  });

  const transform = [{ translateX }];

  return {
    leftButtonStyle: { transform },
    rightButtonStyle: { transform },
    titleStyle: { transform },
    backgroundStyle: { transform },
  };
}

/**
 * Simple translate animation to translate the header to right.
 */
export function forSlideRight({
  current,
  next,
  direction,
  layouts: { screen },
}: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle {
  const isRTL = direction === 'rtl';
  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  const translateX = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: isRTL
      ? [screen.width, 0, -screen.width]
      : [-screen.width, 0, screen.width],
  });

  const transform = [{ translateX }];

  return {
    leftButtonStyle: { transform },
    rightButtonStyle: { transform },
    titleStyle: { transform },
    backgroundStyle: { transform },
  };
}

/**
 * Simple translate animation to translate the header to slide up.
 */
export function forSlideUp({
  current,
  next,
  layouts: { header },
}: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle {
  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  const translateY = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-header.height, 0, -header.height],
  });

  const transform = [{ translateY }];

  return {
    leftButtonStyle: { transform },
    rightButtonStyle: { transform },
    titleStyle: { transform },
    backgroundStyle: { transform },
  };
}

export function forNoAnimation(): StackHeaderInterpolatedStyle {
  return {};
}
