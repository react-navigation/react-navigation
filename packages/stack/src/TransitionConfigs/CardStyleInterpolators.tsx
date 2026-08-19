import { Animated, Platform } from 'react-native';

import type {
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
} from '../types';
import { conditional } from '../utils/conditional';
import {
  accelerate,
  ACTIVITY_CLOSE_DIM,
  clamp,
  decelerate,
  FAST_OUT_EXTRA_SLOW_IN,
  FAST_OUT_SLOW_IN,
  LINEAR_OUT_SLOW_IN,
  timeline,
} from './TransitionEasings';

const { add, multiply } = Animated;

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
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.width, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screen.width * -0.3],
          extrapolate: 'clamp',
        }),
        inverted
      )
    : 0;

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
    extrapolate: 'clamp',
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
    shadowStyle: { shadowOpacity: 0.04 },
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
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  return {
    cardStyle: {
      transform: [{ translateY }],
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
  const hasNotchIos =
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    insets.top > 20;
  const isLandscape = screen.width > screen.height;
  const topOffset = isLandscape ? 0 : 10;
  const statusBarHeight = insets.top;
  const aspectRatio = screen.height / screen.width;

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

  const isFirst = index === 0;

  if (Platform.OS !== 'ios' || parseInt(Platform.Version, 10) >= 26) {
    const scaleValue = screen.width ? 1 - (topOffset * 3) / screen.width : 1;
    const recede = ((screen.height - statusBarHeight) * (1 - scaleValue)) / 2;

    const translateY = multiply(
      progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
          screen.height,
          // The front modal rests below the one behind it to reveal a peek.
          index > 1 ? topOffset : 0,
          isFirst ? 0 : -recede,
        ],
      }),
      inverted
    );

    const scale = isFirst
      ? 1
      : progress.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [1, 1, scaleValue],
        });

    const dimOpacity = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 0, isFirst ? 0.2 : 0.12],
    });

    const borderRadius = isFirst ? 0 : 38;

    return {
      cardStyle: {
        overflow: 'hidden',
        borderCurve: 'continuous',
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        marginTop: isFirst ? 0 : statusBarHeight,
        transform: [{ translateY }, { scale }],
      },
      dimStyle: { opacity: dimOpacity },
    };
  }

  const translateY = multiply(
    progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        screen.height,
        isFirst ? 0 : topOffset,
        (isFirst ? statusBarHeight : 0) - topOffset * aspectRatio,
      ],
    }),
    inverted
  );

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0.3, 1, 1],
  });

  const scale = isLandscape
    ? 1
    : progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
          1,
          1,
          screen.width ? 1 - (topOffset * 2) / screen.width : 1,
        ],
      });

  const borderRadius = isLandscape
    ? 0
    : isFirst
      ? progress.interpolate({
          inputRange: [0, 1, 1.0001, 2],
          outputRange: [0, 0, hasNotchIos ? 38 : 0, 10],
        })
      : 10;

  return {
    cardStyle: {
      overflow: 'hidden',
      borderCurve: 'continuous',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      // We don't need these for the animation
      // But different border radius for corners improves animation perf
      borderBottomLeftRadius: hasNotchIos ? borderRadius : 0,
      borderBottomRightRadius: hasNotchIos ? borderRadius : 0,
      marginTop: isFirst ? 0 : statusBarHeight,
      marginBottom: isFirst ? 0 : topOffset,
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
  next,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateY = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height * 0.08, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const opacity = conditional(
    current.closing,
    current.progress.interpolate(
      timeline({
        duration: 250,
        easing: (value) => accelerate(4, value),
        closing: true,
        stops: [100],
        output: (time) => 1 - clamp((time - 100) / 150),
      })
    ),
    current.progress.interpolate(
      timeline({
        duration: 350,
        easing: (value) => decelerate(5, value),
        stops: [200],
        output: (time) => decelerate(4, clamp(time / 200)),
      })
    )
  );

  return {
    cardStyle: {
      opacity,
      transform: [{ translateY }],
    },
    dimStyle: next
      ? {
          opacity: conditional(
            next.closing,
            next.progress.interpolate(
              timeline({
                duration: 250,
                easing: (value) => accelerate(4, value),
                closing: true,
                output: (time) => 0.3 * (1 - LINEAR_OUT_SLOW_IN(time / 250)),
              })
            ),
            next.progress.interpolate(
              timeline({
                duration: 350,
                easing: (value) => decelerate(5, value),
                stops: [217],
                output: (time) => 0.3 * FAST_OUT_SLOW_IN(clamp(time / 217)),
              })
            )
          ),
        }
      : undefined,
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
  const translationOpenRanges = timeline({
    duration: 425,
    easing: FAST_OUT_EXTRA_SLOW_IN,
    output: (time) => FAST_OUT_SLOW_IN(time / 425),
  });

  const translationCloseRanges = timeline({
    duration: 425,
    easing: FAST_OUT_EXTRA_SLOW_IN,
    closing: true,
    output: (time) => 1 - FAST_OUT_SLOW_IN(time / 425),
  });

  const clipProgress = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const translationProgress = conditional(
    current.closing,
    current.progress.interpolate(translationCloseRanges),
    current.progress.interpolate(translationOpenRanges)
  );

  const containerTranslateY = multiply(
    multiply(
      add(
        add(1, multiply(clipProgress, -0.959)),
        multiply(translationProgress, -0.041)
      ),
      screen.height
    ),
    inverted
  );

  const cardTranslateYFocused = multiply(
    multiply(add(clipProgress, -1), screen.height * 0.959),
    inverted
  );

  const cardTranslateYUnfocused = next
    ? multiply(
        multiply(
          conditional(
            next.closing,
            next.progress.interpolate(translationCloseRanges),
            next.progress.interpolate(translationOpenRanges)
          ),
          screen.height * -0.02
        ),
        inverted
      )
    : 0;

  const overlayOpacity = conditional(
    current.closing,
    current.progress.interpolate(
      timeline({
        duration: 425,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        closing: true,
        output: (time) => 0.1 * (1 - ACTIVITY_CLOSE_DIM(time / 425)),
      })
    ),
    current.progress.interpolate(
      timeline({
        duration: 425,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        stops: [117],
        output: (time) => 0.1 * clamp(time / 117),
      })
    )
  );

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
 * Standard Android-style scale from center for Android 10.
 */
export function forScaleFromCenterAndroid({
  current,
  next,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const opacity = conditional(
    current.closing,
    current.progress.interpolate(
      timeline({
        duration: 400,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        closing: true,
        stops: [33, 83],
        output: (time) => 1 - clamp((time - 33) / 50),
      })
    ),
    current.progress.interpolate(
      timeline({
        duration: 400,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        stops: [50, 100],
        output: (time) => clamp((time - 50) / 50),
      })
    )
  );

  const scale = next
    ? conditional(
        next.closing,
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
          extrapolate: 'clamp',
        }),
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
          extrapolate: 'clamp',
        })
      )
    : conditional(
        current.closing,
        current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
          extrapolate: 'clamp',
        }),
        current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
          extrapolate: 'clamp',
        })
      );

  return {
    cardStyle: {
      opacity,
      transform: [{ scale }],
    },
    dimStyle: next
      ? {
          opacity: multiply(
            next.closing.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            next.progress.interpolate(
              timeline({
                duration: 400,
                easing: FAST_OUT_EXTRA_SLOW_IN,
                stops: [83, 250],
                output: (time) => 0.6 * clamp((time - 83) / 167),
              })
            )
          ),
        }
      : undefined,
  };
}

/**
 * Standard Android-style fade from right for Android 14 and later.
 */
export function forFadeFromRightAndroid({
  current,
  next,
  inverted,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [96, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -96],
          extrapolate: 'clamp',
        }),
        inverted
      )
    : 0;

  const opacity = conditional(
    current.closing,
    current.progress.interpolate(
      timeline({
        duration: 450,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        closing: true,
        stops: [35, 118],
        output: (time) => 1 - clamp((time - 35) / 83),
      })
    ),
    current.progress.interpolate(
      timeline({
        duration: 450,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        stops: [50, 133],
        output: (time) => clamp((time - 50) / 83),
      })
    )
  );

  return {
    cardStyle: {
      opacity,
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
    },
  };
}

/**
 * Standard bottom sheet slide in from the bottom for Android.
 */
export function forBottomSheetAndroid({
  current,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateY = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height * 0.2, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const opacity = conditional(
    current.closing,
    current.progress.interpolate(
      timeline({
        duration: 350,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        closing: true,
        stops: [300],
        output: (time) => 1 - FAST_OUT_EXTRA_SLOW_IN(clamp(time / 300)),
      })
    ),
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    })
  );

  // We follow Android's window dim timing for the 0.32 scrim.
  // This makes it reach full opacity after 128 ms and clear after 112 ms.
  // See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/services/core/java/com/android/server/wm/DimmerAnimationHelper.java
  const overlayOpacity = conditional(
    current.closing,
    current.progress.interpolate(
      timeline({
        duration: 350,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        closing: true,
        stops: [112],
        output: (time) => 0.32 * (1 - clamp(time / 112)),
      })
    ),
    current.progress.interpolate(
      timeline({
        duration: 400,
        easing: FAST_OUT_EXTRA_SLOW_IN,
        stops: [128],
        output: (time) => 0.32 * clamp(time / 128),
      })
    )
  );

  return {
    cardStyle: {
      opacity,
      transform: [{ translateY }],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}

/**
 * Standard Android dialog transition.
 */
export function forDialogAndroid({
  current: { progress, closing },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const opacity = conditional(
    closing,
    progress.interpolate(
      timeline({
        duration: 220,
        easing: (value) => decelerate(5, value),
        closing: true,
        stops: [150],
        output: (time) => 1 - decelerate(3, clamp(time / 150)),
      })
    ),
    progress.interpolate(
      timeline({
        duration: 220,
        easing: (value) => decelerate(5, value),
        stops: [150],
        output: (time) => decelerate(3, clamp(time / 150)),
      })
    )
  );

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
    extrapolate: 'clamp',
  });

  // We follow Android's window dim timing for the 0.6 dialog dim.
  // This makes it reach or clear full opacity after 132 ms.
  // See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/services/core/java/com/android/server/wm/DimmerAnimationHelper.java
  const overlayOpacity = conditional(
    closing,
    progress.interpolate(
      timeline({
        duration: 220,
        easing: (value) => decelerate(5, value),
        closing: true,
        stops: [132],
        output: (time) => 0.6 * (1 - clamp(time / 132)),
      })
    ),
    progress.interpolate(
      timeline({
        duration: 220,
        easing: (value) => decelerate(5, value),
        stops: [132],
        output: (time) => 0.6 * clamp(time / 132),
      })
    )
  );

  return {
    cardStyle: {
      opacity,
      transform: [{ scale }],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}

/**
 * Simple fade animation.
 */
export function forFadeFromCenter({
  current: { progress },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  return {
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
        extrapolate: 'clamp',
      }),
    },
  };
}

/**
 * Standard iOS cross-dissolve transition.
 */
export function forCrossDissolveIOS({
  current,
  next,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  // UIKit cross-dissolve darkens identical light screens at the midpoint.
  // Dimming the outgoing card reproduces this without exposing earlier screens.
  return {
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    },
    dimStyle: next
      ? {
          opacity: next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }
      : undefined,
  };
}

/**
 * Standard iOS horizontal flip transition.
 */
export function forFlipIOS({
  current,
  next,
  inverted,
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const progress = add(current.progress, next ? next.progress : 0);

  const rotateY = multiply(
    progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [180, 0, -180],
    }),
    inverted
  ).interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['-180deg', '0deg', '180deg'],
  });

  return {
    cardStyle: {
      backfaceVisibility: 'hidden',
      transform: [{ perspective: 1000 }, { rotateY }],
    },
  };
}

export function forNoAnimation(): StackCardInterpolatedStyle {
  return {};
}
