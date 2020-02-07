import { Easing } from 'react-native';
import { TransitionSpec } from '../types';

/**
 * Exact values from UINavigationController's animation configuration.
 */
export const TransitionIOSSpec: TransitionSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

/**
 * Configuration for activity open animation from Android Nougat.
 * See http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
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
 * See http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
 */
export const FadeOutToBottomAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: Easing.in(Easing.linear),
  },
};

/**
 * Approximate configuration for activity open animation from Android Pie.
 * See http://aosp.opersys.com/xref/android-9.0.0_r47/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
 */
export const RevealFromBottomAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 425,
    // This is super rough approximation of the path used for the curve by android
    // See http://aosp.opersys.com/xref/android-9.0.0_r47/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing.bezier(0.35, 0.45, 0, 1),
  },
};

/**
 * Approximate configuration for activity open animation from Android Q.
 * See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
 */
export const ScaleFromCenterAndroidSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 400,
    // This is super rough approximation of the path used for the curve by android
    // See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing.bezier(0.35, 0.45, 0, 1),
  },
};
