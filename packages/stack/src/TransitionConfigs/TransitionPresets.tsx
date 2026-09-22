import { Platform } from 'react-native';

import type { TransitionPreset } from '../types';
import {
  forBottomSheetAndroid,
  forCrossDissolveIOS,
  forDialogAndroid,
  forFadeFromBottomAndroid,
  forFadeFromCenter,
  forFadeFromRightAndroid,
  forFlipIOS,
  forHorizontalIOS,
  forModalPresentationIOS,
  forRevealFromBottomAndroid,
  forScaleFromCenterAndroid,
  forVerticalIOS,
} from './CardStyleInterpolators';
import { forFade, forUIKit } from './HeaderStyleInterpolators';
import {
  BottomSheetSlideInSpec,
  BottomSheetSlideOutSpec,
  DialogAndroidSpec,
  FadeInFromBottomAndroidSpec,
  FadeInFromRightAndroidSpec,
  FadeOutToBottomAndroidSpec,
  FadeOutToRightAndroidSpec,
  FlipIOSSpec,
  RevealFromBottomAndroidSpec,
  ScaleFromCenterAndroidSpec,
  TransitionIOSSpec,
} from './TransitionSpecs';

const ANDROID_VERSION_PIE = 28;
const ANDROID_VERSION_10 = 29;
const ANDROID_VERSION_14 = 34;

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
  headerStyleInterpolator: forUIKit,
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
  headerStyleInterpolator: forUIKit,
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
  headerStyleInterpolator: forUIKit,
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
  headerStyleInterpolator: forFade,
};

/**
 * Standard Android dialog transition.
 */
export const DialogAndroid: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: DialogAndroidSpec,
    close: DialogAndroidSpec,
  },
  cardStyleInterpolator: forDialogAndroid,
  headerStyleInterpolator: forFade,
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
  headerStyleInterpolator: forFade,
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
  headerStyleInterpolator: forFade,
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android 14 and later.
 */
export const FadeFromRightAndroid: TransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: FadeInFromRightAndroidSpec,
    close: FadeOutToRightAndroidSpec,
  },
  cardStyleInterpolator: forFadeFromRightAndroid,
  headerStyleInterpolator: forFade,
};

/**
 * Standard Material 3 bottom sheet transition.
 */
export const BottomSheetAndroid: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: BottomSheetSlideInSpec,
    close: BottomSheetSlideOutSpec,
  },
  cardStyleInterpolator: forBottomSheetAndroid,
  headerStyleInterpolator: forFade,
};

/**
 * Fade transition for transparent modals.
 */
export const ModalFadeTransition: TransitionPreset = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forFadeFromCenter,
  headerStyleInterpolator: forFade,
};

/**
 * Standard iOS horizontal flip transition.
 */
export const ModalFlipIOS: TransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: FlipIOSSpec,
    close: FlipIOSSpec,
  },
  cardStyleInterpolator: forFlipIOS,
  headerStyleInterpolator: forFade,
};

/**
 * Standard iOS cross-dissolve transition.
 */
export const CrossDissolveIOS: TransitionPreset = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
  cardStyleInterpolator: forCrossDissolveIOS,
  headerStyleInterpolator: forFade,
};

/**
 * Default navigation transition for the current platform.
 */
export const DefaultTransition = Platform.select({
  ios: SlideFromRightIOS,
  android:
    Number(Platform.Version) >= ANDROID_VERSION_14
      ? FadeFromRightAndroid
      : Number(Platform.Version) >= ANDROID_VERSION_10
        ? ScaleFromCenterAndroid
        : Number(Platform.Version) >= ANDROID_VERSION_PIE
          ? RevealFromBottomAndroid
          : FadeFromBottomAndroid,
  default: ScaleFromCenterAndroid,
});

/**
 * Default modal transition for the current platform.
 */
export const ModalTransition = Platform.select({
  ios: ModalPresentationIOS,
  default: BottomSheetAndroid,
});

/**
 * Slide from left transition.
 */
export const SlideFromLeftIOS: TransitionPreset = {
  ...SlideFromRightIOS,
  gestureDirection: 'horizontal-inverted',
  cardStyleInterpolator: forHorizontalIOS,
};
