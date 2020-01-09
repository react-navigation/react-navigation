import {
  forHorizontalIOS,
  forVerticalIOS,
  forScaleFromCenterAndroid,
  forRevealFromBottomAndroid,
  forFadeFromBottomAndroid,
  forModalPresentationIOS,
} from './CardStyleInterpolators';
import { forNoAnimation, forFade } from './HeaderStyleInterpolators';
import {
  TransitionIOSSpec,
  ScaleFromCenterAndroidSpec,
  RevealFromBottomAndroidSpec,
  FadeOutToBottomAndroidSpec,
  FadeInFromBottomAndroidSpec,
} from './TransitionSpecs';
import { TransitionPreset } from '../types';
import { Platform } from 'react-native';

const ANDROID_VERSION_PIE = 28;

/**
 * Standard iOS navigation transition.
 */
export const SlideFromRightIOS: TransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forHorizontalIOS,
  headerStyleInterpolator: forFade,
};

/**
 * Standard iOS navigation transition for modals.
 */
export const ModalSlideFromBottomIOS: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forVerticalIOS,
  headerStyleInterpolator: forNoAnimation,
};

/**
 * Standard iOS modal presentation style (introduced in iOS 13).
 */
export const ModalPresentationIOS: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forModalPresentationIOS,
  headerStyleInterpolator: forNoAnimation,
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android < 9 (Oreo).
 */
export const FadeFromBottomAndroid: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: FadeInFromBottomAndroidSpec,
    close: FadeOutToBottomAndroidSpec,
  },
  cardStyleInterpolator: forFadeFromBottomAndroid,
  headerStyleInterpolator: forNoAnimation,
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android 9 (Pie).
 */
export const RevealFromBottomAndroid: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: RevealFromBottomAndroidSpec,
    close: RevealFromBottomAndroidSpec,
  },
  cardStyleInterpolator: forRevealFromBottomAndroid,
  headerStyleInterpolator: forNoAnimation,
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android 10 (Q).
 */
export const ScaleFromCenterAndroid: TransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: ScaleFromCenterAndroidSpec,
    close: ScaleFromCenterAndroidSpec,
  },
  cardStyleInterpolator: forScaleFromCenterAndroid,
  headerStyleInterpolator: forNoAnimation,
};

/**
 * Default navigation transition for the current platform.
 */
export const DefaultTransition = Platform.select({
  ios: SlideFromRightIOS,
  default:
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE
      ? RevealFromBottomAndroid
      : FadeFromBottomAndroid,
});

/**
 * Default modal transition for the current platform.
 */
export const ModalTransition = Platform.select({
  ios: ModalSlideFromBottomIOS,
  default: DefaultTransition,
});
