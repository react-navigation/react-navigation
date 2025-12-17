import { Animated, View } from 'react-native';

type CallstackLiquidGlass = typeof import('@callstack/liquid-glass');

let isLiquidGlassSupported: boolean,
  LiquidGlassView: CallstackLiquidGlass['LiquidGlassView'],
  LiquidGlassContainerView: CallstackLiquidGlass['LiquidGlassContainerView'],
  AnimatedLiquidGlassView: Animated.AnimatedComponent<typeof LiquidGlassView>,
  AnimatedLiquidGlassContainerView: Animated.AnimatedComponent<
    typeof LiquidGlassContainerView
  >;

try {
  // Add try/catch to support usage even if it's not installed, since it's optional.
  isLiquidGlassSupported =
    require('@callstack/liquid-glass').isLiquidGlassSupported;
  LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
  LiquidGlassContainerView =
    require('@callstack/liquid-glass').LiquidGlassContainerView;
  AnimatedLiquidGlassView = Animated.createAnimatedComponent(LiquidGlassView);
  AnimatedLiquidGlassContainerView = Animated.createAnimatedComponent(
    LiquidGlassContainerView
  );
} catch (e) {
  isLiquidGlassSupported = false;
  LiquidGlassView = View;
  // @ts-expect-error: this is fine
  AnimatedLiquidGlassView = Animated.View;
  // @ts-expect-error: this is fine
  AnimatedLiquidGlassContainerView = Animated.View;
}

export {
  AnimatedLiquidGlassContainerView,
  AnimatedLiquidGlassView,
  isLiquidGlassSupported,
  LiquidGlassContainerView,
  LiquidGlassView,
};
