import { Animated, requireNativeComponent } from 'react-native';

export const Screen = Animated.createAnimatedComponent(
  requireNativeComponent('RNSScreen', null)
);

export const ScreenContainer = requireNativeComponent(
  'RNSScreenContainer',
  null
);

export const ScreenStack = Animated.createAnimatedComponent(
  requireNativeComponent('RNSScreenStack', null)
);
