import {
  forHorizontalIOS,
  forVerticalIOS,
  forWipeFromBottomAndroid,
  forFadeFromBottomAndroid,
} from './CardStyleInterpolators';
import { forUIKit, forNoAnimation } from './HeaderStyleInterpolators';
import {
  TransitionIOSSpec,
  WipeFromBottomAndroidSpec,
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
  headerStyleInterpolator: forUIKit,
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
export const WipeFromBottomAndroid: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: WipeFromBottomAndroidSpec,
    close: WipeFromBottomAndroidSpec,
  },
  cardStyleInterpolator: forWipeFromBottomAndroid,
  headerStyleInterpolator: forNoAnimation,
};

export const DefaultTransition = Platform.select({
  ios: SlideFromRightIOS,
  default:
    Platform.OS === 'android' && Platform.Version < ANDROID_VERSION_PIE
      ? FadeFromBottomAndroid
      : WipeFromBottomAndroid,
});
