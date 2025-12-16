import { Animated, View } from 'react-native';

type CallstackLiquidGlass = typeof import('@callstack/liquid-glass');

export const LiquidGlassView: CallstackLiquidGlass['LiquidGlassView'] = View;

export const LiquidGlassContainerView: CallstackLiquidGlass['LiquidGlassContainerView'] =
  View;

// @ts-expect-error: this is fine
export const AnimatedLiquidGlassView: Animated.AnimatedComponent<
  typeof LiquidGlassView
> = Animated.View;

// @ts-expect-error: this is fine
export const AnimatedLiquidGlassContainerView: Animated.AnimatedComponent<
  typeof LiquidGlassContainerView
> = Animated.View;

export const isLiquidGlassSupported = false;
