import type {
  LiquidGlassContainerViewProps,
  LiquidGlassViewProps,
} from '@callstack/liquid-glass';
import { Animated, View } from 'react-native';

type AnimatedLiquidGlassViewProps =
  Animated.AnimatedProps<LiquidGlassViewProps>;

type AnimatedLiquidGlassContainerViewProps =
  Animated.AnimatedProps<LiquidGlassContainerViewProps>;

let isLiquidGlassSupported: boolean,
  LiquidGlassView: React.ComponentType<LiquidGlassViewProps>,
  LiquidGlassContainerView: React.ComponentType<LiquidGlassContainerViewProps>,
  AnimatedLiquidGlassView: React.ComponentType<AnimatedLiquidGlassViewProps>,
  AnimatedLiquidGlassContainerView: React.ComponentType<AnimatedLiquidGlassContainerViewProps>;

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
  LiquidGlassContainerView = View;
  AnimatedLiquidGlassView = Animated.View;
  AnimatedLiquidGlassContainerView = Animated.View;
}

export {
  AnimatedLiquidGlassContainerView,
  AnimatedLiquidGlassView,
  isLiquidGlassSupported,
  LiquidGlassContainerView,
  LiquidGlassView,
};
