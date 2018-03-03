import { Animated, Easing, Platform } from 'react-native';
import StyleInterpolator from './StackViewStyleInterpolator';
import * as ReactNativeFeatures from '../../utils/ReactNativeFeatures';

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

function defaultTransitionConfig(
  transitionProps,
  prevTransitionProps,
  isModal
) {
  if (Platform.OS === 'android') {
    // Use the default Android animation no matter if the screen is a modal.
    // Android doesn't have full-screen modals like iOS does, it has dialogs.
    if (
      prevTransitionProps &&
      transitionProps.index < prevTransitionProps.index
    ) {
      // Navigating back to the previous screen
      return FadeOutToBottomAndroid;
    }
    return FadeInFromBottomAndroid;
  }
  // iOS and other platforms
  if (isModal) {
    return ModalSlideFromBottomIOS;
  }
  return SlideFromRightIOS;
}

function getTransitionConfig(
  transitionConfigurer,
  transitionProps,
  prevTransitionProps,
  isModal
) {
  const defaultConfig = defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
  if (transitionConfigurer) {
    return {
      ...defaultConfig,
      ...transitionConfigurer(transitionProps, prevTransitionProps, isModal),
    };
  }
  return defaultConfig;
}

export default {
  defaultTransitionConfig,
  getTransitionConfig,
};
