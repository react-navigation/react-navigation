/* @flow */

import { Animated, Easing, Platform } from 'react-native';

import type {
  NavigationTransitionProps,
  NavigationTransitionSpec,
  TransitionConfig,
} from '../TypeDefinition';

import CardStackStyleInterpolator from './CardStackStyleInterpolator';

// Used for all animations unless overriden
const DefaultTransitionSpec = ({
  duration: 250,
  easing: Easing.inOut(Easing.ease),
  timing: Animated.timing,
}: NavigationTransitionSpec);

const IOSTransitionSpec = ({
  duration: 500,
  easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
  timing: Animated.timing,
}: NavigationTransitionSpec);

// Standard iOS navigation transition
const SlideFromRightIOS = ({
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: CardStackStyleInterpolator.forHorizontal,
}: TransitionConfig);

// Standard iOS navigation transition for modals
const ModalSlideFromBottomIOS = ({
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: CardStackStyleInterpolator.forVertical,
}: TransitionConfig);

// Standard Android navigation transition when opening an Activity
const FadeInFromBottomAndroid = ({
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
  transitionSpec: {
    duration: 350,
    easing: Easing.out(Easing.poly(5)), // decelerate
    timing: Animated.timing,
  },
  screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid,
}: TransitionConfig);

// Standard Android navigation transition when closing an Activity
const FadeOutToBottomAndroid = ({
  // See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
  transitionSpec: {
    duration: 230,
    easing: Easing.in(Easing.poly(4)), // accelerate
    timing: Animated.timing,
  },
  screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid,
}: TransitionConfig);

function defaultTransitionConfig(
  // props for the new screen
  transitionProps: NavigationTransitionProps,
  // props for the old screen
  prevTransitionProps: NavigationTransitionProps,
  // whether we're animating in/out a modal screen
  isModal: boolean
): TransitionConfig {
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
  transitionConfigurer?: () => TransitionConfig,
  // props for the new screen
  transitionProps: NavigationTransitionProps,
  // props for the old screen
  prevTransitionProps: NavigationTransitionProps,
  isModal: boolean
): TransitionConfig {
  const defaultConfig = defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
  if (transitionConfigurer) {
    return {
      ...defaultConfig,
      ...transitionConfigurer(),
    };
  }
  return defaultConfig;
}

export default {
  DefaultTransitionSpec,
  defaultTransitionConfig,
  getTransitionConfig,
};
