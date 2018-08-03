import { I18nManager } from 'react-native';
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
function forInitial(props) {
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
function forHorizontal(props) {
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
    outputRange: [0, 1, 1, 0.85, 0],
  });

  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: [first, index, last],
    outputRange: I18nManager.isRTL
      ? [-width, 0, width * 0.3]
      : [width, 0, width * -0.3],
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
function forVertical(props) {
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
    outputRange: [0, 1, 1, 0.85, 0],
  });

  const height = layout.initHeight;
  const translateY = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [height, 0, 0],
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
function forFadeFromBottomAndroid(props) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, index, last - 0.01, last];

  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1, 0],
  });

  const translateY = position.interpolate({
    inputRange,
    outputRange: [50, 0, 0, 0],
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
function forFade(props) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [0, 1, 1],
  });

  return {
    opacity,
  };
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  forFade,
};
