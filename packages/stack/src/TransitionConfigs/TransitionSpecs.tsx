import { Easing } from 'react-native';

import type { TransitionSpec } from '../types';
import { FAST_OUT_EXTRA_SLOW_IN } from './TransitionEasings';

/**
 * Approximation of the standard iOS navigation transition.
 */
export const TransitionIOSSpec: TransitionSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
  },
};

/**
 * Configuration for the standard iOS horizontal flip transition.
 */
export const FlipIOSSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 700,
    easing: Easing.inOut(Easing.ease),
  },
};

/**
 * Configuration for activity open animation from Android Nougat.
 * See https://android.googlesource.com/platform/frameworks/base/+/android-7.1.2_r37/core/res/res/anim/activity_open_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-7.1.2_r37/core/res/res/anim/activity_open_exit.xml
 */
export const FadeInFromBottomAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 350,
    easing: Easing.out(Easing.poly(5)),
  },
};

/**
 * Configuration for activity close animation from Android Nougat.
 * See https://android.googlesource.com/platform/frameworks/base/+/android-7.1.2_r37/core/res/res/anim/activity_close_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-7.1.2_r37/core/res/res/anim/activity_close_exit.xml
 */
export const FadeOutToBottomAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 250,
    easing: Easing.in(Easing.poly(4)),
  },
};

/**
 * Configuration for the standard Android dialog transition.
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/core/res/res/anim/dialog_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/core/res/res/anim/dialog_exit.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/core/res/res/values/config.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/core/res/res/values/themes_material.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/services/core/java/com/android/server/wm/DimmerAnimationHelper.java
 */
export const DialogAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 220,
    easing: Easing.out(Easing.poly(5)),
  },
};

/**
 * Configuration for activity open animation from Android Pie.
 * See https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r47/core/res/res/anim/activity_open_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r47/core/res/res/anim/activity_open_exit.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r47/core/res/res/anim/activity_close_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r47/core/res/res/anim/activity_close_exit.xml
 */
export const RevealFromBottomAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 425,
    easing: FAST_OUT_EXTRA_SLOW_IN,
  },
};

/**
 * Configuration for activity open animation from Android Q.
 * See https://android.googlesource.com/platform/frameworks/base/+/android-10.0.0_r2/core/res/res/anim/activity_open_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-10.0.0_r2/core/res/res/anim/activity_open_exit.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-10.0.0_r2/core/res/res/anim/activity_close_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/android-10.0.0_r2/core/res/res/anim/activity_close_exit.xml
 */
export const ScaleFromCenterAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 400,
    easing: FAST_OUT_EXTRA_SLOW_IN,
  },
};

/**
 * Configuration for activity open animation from Android 14 and later.
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/anim/activity_open_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/anim/activity_open_exit.xml
 */
export const FadeInFromRightAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 450,
    easing: FAST_OUT_EXTRA_SLOW_IN,
  },
};

/**
 * Configuration for activity close animation from Android 14 and later.
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/anim/activity_close_enter.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/anim/activity_close_exit.xml
 */
export const FadeOutToRightAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 450,
    easing: FAST_OUT_EXTRA_SLOW_IN,
  },
};

/**
 * Configuration for bottom sheet slide in animation from Material 3.
 * See https://github.com/material-components/material-components-android/blob/1.14.0/lib/java/com/google/android/material/bottomsheet/res/anim/m3_bottom_sheet_slide_in.xml
 * See https://github.com/material-components/material-components-android/blob/1.14.0/lib/java/com/google/android/material/motion/res/values/tokens.xml
 * See https://github.com/material-components/material-components-android/blob/1.14.0/lib/java/com/google/android/material/dialog/res/values/tokens.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/services/core/java/com/android/server/wm/DimmerAnimationHelper.java
 */
export const BottomSheetSlideInSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 400,
    easing: FAST_OUT_EXTRA_SLOW_IN,
  },
};

/**
 * Configuration for bottom sheet slide out animation from Material 3.
 * See https://github.com/material-components/material-components-android/blob/1.14.0/lib/java/com/google/android/material/bottomsheet/res/anim/m3_bottom_sheet_slide_out.xml
 * See https://github.com/material-components/material-components-android/blob/1.14.0/lib/java/com/google/android/material/motion/res/values/tokens.xml
 * See https://github.com/material-components/material-components-android/blob/1.14.0/lib/java/com/google/android/material/dialog/res/values/tokens.xml
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/services/core/java/com/android/server/wm/DimmerAnimationHelper.java
 */
export const BottomSheetSlideOutSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 350,
    easing: FAST_OUT_EXTRA_SLOW_IN,
  },
};
