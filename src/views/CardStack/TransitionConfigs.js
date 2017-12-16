/* @flow */

import { Animated, Easing, Platform } from 'react-native';

import type {
  NavigationTransitionProps,
  NavigationTransitionSpec,
  TransitionConfig,
} from '../../TypeDefinition';

import CardStackStyleInterpolator from './CardStackStyleInterpolator';

const IOSTransitionSpec = ({
  duration: 500,
  easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
  timing: Animated.timing,
}: NavigationTransitionSpec);

// Standard iOS navigation transition
const SlideFromRightIOS = ({
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: CardStackStyleInterpolator.forHorizontal,
  containerStyle: {
    backgroundColor: '#000',
  },
}: TransitionConfig);

// Left To Right transition
const SlideLeftToRight = ({
  screenInterpolator: CardStackStyleInterpolator.leftToRight,
}: TransitionConfig);

// Top To Bottom transition
const SlideTopToBottom = ({
  screenInterpolator: CardStackStyleInterpolator.topToBottom,
}: TransitionConfig);

// face transition
const forFade = ({
  screenInterpolator: CardStackStyleInterpolator.forFade,
}: TransitionConfig);

// Standard iOS navigation transition for modals
const ModalSlideFromBottomIOS = ({
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: CardStackStyleInterpolator.forVertical,
  containerStyle: {
    backgroundColor: '#000',
  },
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
  prevTransitionProps: ?NavigationTransitionProps,
  // whether we're animating in/out a modal screen
  isModal: boolean,
  // props for the direction : default is horizontal
  direction: string
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
    if (direction === 'horizontal') {
      return ModalSlideFromBottomIOS;
    } else if (direction === 'leftToRight') {
      return SlideLeftToRight;
    } else if (direction === 'topToBottom') {
      return SlideTopToBottom;
    } else if (direction === 'fade') {
      return forFade;
    }
  }
  return SlideFromRightIOS;
}

function getTransitionConfig(
  transitionConfigurer?: (
    transitionProps: NavigationTransitionProps,
    prevTransitionProps: ?NavigationTransitionProps,
    isModal: boolean,
    direction: string
  ) => TransitionConfig,
  // props for the new screen
  transitionProps: NavigationTransitionProps,
  // props for the old screen
  prevTransitionProps: ?NavigationTransitionProps,
  isModal: boolean,
  direction: string
): TransitionConfig {
  const defaultConfig = defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal,
    direction
  );
  if (transitionConfigurer) {
    return {
      ...defaultConfig,
      ...transitionConfigurer(
        transitionProps,
        prevTransitionProps,
        isModal,
        direction
      ),
    };
  }
  return defaultConfig;
}

export default {
  defaultTransitionConfig,
  getTransitionConfig,
};
