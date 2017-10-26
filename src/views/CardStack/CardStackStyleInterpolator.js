/* @flow */

import { I18nManager } from 'react-native';

import type {
  NavigationSceneRendererProps,
  AnimatedViewStyleProp,
} from '../../TypeDefinition';

import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

/**
 * Utility that builds the style for the card in the cards stack.
 *
 *     +------------+
 *   +-+            |
 * +-+ |            |
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { navigation, scene } = props;

  const focused = navigation.state.index === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    transform: [{ translateX: translate }, { translateY: translate }],
  };
}

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontal(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, first + 0.01, index, last - 0.01, last],
    outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
  });

  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: ([first, index, last]: Array<number>),
    outputRange: I18nManager.isRTL
      ? ([-width, 0, width * 0.3]: Array<number>)
      : ([width, 0, width * -0.3]: Array<number>),
  });
  const translateY = 0;

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, first + 0.01, index, last - 0.01, last],
    outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
  });

  const height = layout.initHeight;
  const translateY = position.interpolate({
    inputRange: ([first, index, last]: Array<number>),
    outputRange: ([height, 0, 0]: Array<number>),
  });
  const translateX = 0;

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
function forFadeFromBottomAndroid(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = ([first, index, last - 0.01, last]: Array<number>);

  const opacity = position.interpolate({
    inputRange,
    outputRange: ([0, 1, 1, 0]: Array<number>),
  });

  const translateY = position.interpolate({
    inputRange,
    outputRange: ([50, 0, 0, 0]: Array<number>),
  });
  const translateX = 0;

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 *  fadeIn and fadeOut
 */
function forFade(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: ([first, index, last]: Array<number>),
    outputRange: ([0, 1, 1]: Array<number>),
  });

  return {
    opacity,
  };
}

function canUseNativeDriver(): boolean {
  // The native driver can be enabled for this interpolator animating
  // opacity, translateX, and translateY is supported by the native animation
  // driver on iOS and Android.
  return true;
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  forFade,
  canUseNativeDriver,
};
