import { I18nManager } from 'react-native';
import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

const EPS = 1e-5;

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

  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: [first, index, last],
    outputRange: I18nManager.isRTL
      ? [-width, 0, width * 0.3]
      : [width, 0, width * -0.3],
    extrapolate: 'clamp',
  });

  const shadowOpacity = props.shadowEnabled
    ? position.interpolate({
        inputRange: [first, index, last],
        outputRange: [0, 0.7, 0],
        extrapolate: 'clamp',
      })
    : null;

  let overlayOpacity = props.cardOverlayEnabled
    ? position.interpolate({
        inputRange: [index, last - 0.5, last, last + EPS],
        outputRange: [0, 0.07, 0.07, 0],
        extrapolate: 'clamp',
      })
    : null;

  return {
    transform: [{ translateX }],
    overlayOpacity,
    shadowOpacity,
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
  const height = layout.initHeight;
  const translateY = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [height, 0, 0],
    extrapolate: 'clamp',
  });

  return {
    transform: [{ translateY }],
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
  const opacity = position.interpolate({
    inputRange: [first, first + 0.5, first + 0.9, index, last - 1e-5, last],
    outputRange: [0, 0.25, 0.7, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const height = layout.initHeight;
  const maxTranslation = height * 0.08;
  const translateY = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [maxTranslation, 0, 0],
    extrapolate: 'clamp',
  });

  return {
    opacity,
    transform: [{ translateY }],
  };
}

function forFadeToBottomAndroid(props) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, index, last];

  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  const height = layout.initHeight;
  const maxTranslation = height * 0.08;

  const translateY = position.interpolate({
    inputRange,
    outputRange: [maxTranslation, 0, 0],
    extrapolate: 'clamp',
  });

  return {
    opacity,
    transform: [{ translateY }],
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
    extrapolate: 'clamp',
  });

  return {
    opacity,
  };
}

function forNoAnimation() {
  return {};
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  forFadeToBottomAndroid,
  forFade,
  forNoAnimation,
};
