import { Easing } from 'react-native-reanimated';
import { TransitionSpec } from '../types';

// These are the exact values from UINavigationController's animation configuration
export const TransitionIOSSpec: TransitionSpec = {
  timing: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
export const FadeInFromBottomAndroidSpec: TransitionSpec = {
  timing: 'timing',
  config: {
    duration: 350,
    easing: Easing.out(Easing.poly(5)),
  },
};

// See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
export const FadeOutToBottomAndroidSpec: TransitionSpec = {
  timing: 'timing',
  config: {
    duration: 150,
    easing: Easing.in(Easing.linear),
  },
};

// See http://androidxref.com/9.0.0_r3/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
export const WipeFromBottomAndroidSpec: TransitionSpec = {
  timing: 'timing',
  config: {
    duration: 425,
    // This is super rough approximation of the path used for the curve by android
    // See http://androidxref.com/9.0.0_r3/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: t => Easing.bezier(0.90, 0.06, 0.57, 0)((Easing.bezier(0.06, 0.94, 0.22, 1.02)(t))),
  },
};
