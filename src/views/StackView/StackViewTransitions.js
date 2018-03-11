import { Animated, Easing, Platform } from 'react-native';
import * as ReactNativeFeatures from '../../utils/ReactNativeFeatures';

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
  const { navigation, descriptor } = props;
  const { state } = navigation;
  const activeKey = state.routes[state.index].key;

  const focused = descriptor.key === activeKey;
  const opacity = focused ? 1 : 0;
  // If not focused, move the card far away.
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
  const { layout, transition, navigation, index } = props;
  const { state } = navigation;
  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const first = index - 1;
  const last = index + 1;
  const opacity = transition
    ? transition.progress.interpolate({
        inputRange: [first, first + 0.01, index, last - 0.01, last],
        outputRange: [0, 1, 1, 0.85, 0],
      })
    : 1;

  const width = layout.initWidth;
  const translateX = transition
    ? transition.progress.interpolate({
        inputRange: [first, index, last],
        outputRange: I18nManager.isRTL
          ? [-width, 0, width * 0.3]
          : [width, 0, width * -0.3],
      })
    : 0;

  return {
    opacity,
    transform: [{ translateX }],
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(props) {
  const { layout, transition, descriptor } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const opacity = transition.progress.interpolate({
    inputRange: [first, first + 0.01, index, last - 0.01, last],
    outputRange: [0, 1, 1, 0.85, 0],
  });

  const height = layout.initHeight;
  const translateY = transition.progress.interpolate({
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

const StyleInterpolator = {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  forFade,
};

let IOSTransitionSpec;
if (ReactNativeFeatures.supportsImprovedSpringAnimation()) {
  // These are the exact values from UINavigationController's animation configuration
  IOSTransitionSpec = {
    timing: Animated.spring,
    stiffness: 1000,
    damping: 500,
    mass: 3,
  };
} else {
  // This is an approximation of the IOS spring animation using a derived bezier curve
  IOSTransitionSpec = {
    duration: 500,
    easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
    timing: Animated.timing,
  };
}

// Standard iOS navigation transition
const SlideFromRightIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: StyleInterpolator.forHorizontal,
  containerStyle: {
    backgroundColor: '#000',
  },
};

// Standard iOS navigation transition for modals
const ModalSlideFromBottomIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: StyleInterpolator.forVertical,
  containerStyle: {
    backgroundColor: '#000',
  },
};

// Standard Android navigation transition when opening an Activity
const FadeInFromBottomAndroid = {
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
  transitionSpec: {
    duration: 350,
    easing: Easing.out(Easing.poly(5)), // decelerate
    timing: Animated.timing,
  },
  screenInterpolator: StyleInterpolator.forFadeFromBottomAndroid,
};

// Standard Android navigation transition when closing an Activity
const FadeOutToBottomAndroid = {
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
  transitionSpec: {
    duration: 230,
    easing: Easing.in(Easing.poly(4)), // accelerate
    timing: Animated.timing,
  },
  screenInterpolator: StyleInterpolator.forFadeFromBottomAndroid,
};

function defaultTransitionConfig(transitionProps, isModal) {
  if (Platform.OS === 'android') {
    // todo, uncomment and fix, stop using prevTransitionProps

    // // Use the default Android animation no matter if the screen is a modal.
    // // Android doesn't have full-screen modals like iOS does, it has dialogs.
    // if (
    //   prevTransitionProps &&
    //   transitionProps.index < prevTransitionProps.index
    // ) {
    //   // Navigating back to the previous screen
    //   return FadeOutToBottomAndroid;
    // }
    return FadeInFromBottomAndroid;
  }
  // iOS and other platforms
  if (isModal) {
    return ModalSlideFromBottomIOS;
  }
  return SlideFromRightIOS;
}

function getTransitionConfig(transitionConfigurer, transitionProps, isModal) {
  const defaultConfig = defaultTransitionConfig(transitionProps, isModal);
  if (transitionConfigurer) {
    return {
      ...defaultConfig,
      ...transitionConfigurer(transitionProps, isModal),
    };
  }
  return defaultConfig;
}

export default {
  defaultTransitionConfig,
  getTransitionConfig,
  StyleInterpolator,
};
