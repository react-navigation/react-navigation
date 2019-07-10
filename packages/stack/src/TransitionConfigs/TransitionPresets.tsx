import {
  forHorizontalIOS,
  forVerticalIOS,
  forRevealFromBottomAndroid,
  forFadeFromBottomAndroid,
  forModalPresentationIOS,
} from './CardStyleInterpolators';
import { forNoAnimation, forFade } from './HeaderStyleInterpolators';
import {
  TransitionIOSSpec,
  RevealFromBottomAndroidSpec,
  FadeOutToBottomAndroidSpec,
  FadeInFromBottomAndroidSpec,
} from './TransitionSpecs';
import { TransitionPreset } from '../types';
import { Platform } from 'react-native';

const ANDROID_VERSION_PIE = 28;

// Standard iOS navigation transition
export const SlideFromRightIOS: TransitionPreset = {
  direction: 'horizontal',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forHorizontalIOS,
  headerStyleInterpolator: forFade,
};

// Standard iOS navigation transition for modals
export const ModalSlideFromBottomIOS: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forVerticalIOS,
  headerStyleInterpolator: forNoAnimation,
};

// Standard iOS modal presentation style (introduced in iOS 13)
export const ModalPresentationIOS: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forModalPresentationIOS,
  headerStyleInterpolator: forNoAnimation,
};

// Standard Android navigation transition when opening or closing an Activity on Android < 9
export const FadeFromBottomAndroid: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: FadeInFromBottomAndroidSpec,
    close: FadeOutToBottomAndroidSpec,
  },
  cardStyleInterpolator: forFadeFromBottomAndroid,
  headerStyleInterpolator: forNoAnimation,
};

// Standard Android navigation transition when opening or closing an Activity on Android >= 9
export const RevealFromBottomAndroid: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: RevealFromBottomAndroidSpec,
    close: RevealFromBottomAndroidSpec,
  },
  cardStyleInterpolator: forRevealFromBottomAndroid,
  headerStyleInterpolator: forNoAnimation,
};

export const DefaultTransition = Platform.select({
  ios: SlideFromRightIOS,
  default:
    Platform.OS === 'android' && Platform.Version < ANDROID_VERSION_PIE
      ? FadeFromBottomAndroid
      : RevealFromBottomAndroid,
});

export const ModalTransition = Platform.select({
  ios: ModalSlideFromBottomIOS,
  default: DefaultTransition,
});
