import {
  type LiquidGlassContainerViewProps,
  type LiquidGlassViewProps,
  UNSTABLE_isLiquidGlassSupported as isLiquidGlassSupported,
  UNSTABLE_LiquidGlassContainerView as LiquidGlassContainerView,
  UNSTABLE_LiquidGlassView as LiquidGlassView,
} from '@react-navigation/native';
import { Animated } from 'react-native';

const AnimatedLiquidGlassView: Animated.AnimatedComponent<
  LiquidGlassViewProps,
  React.ComponentRef<typeof LiquidGlassView>
> = Animated.createAnimatedComponent(LiquidGlassView);

const AnimatedLiquidGlassContainerView: Animated.AnimatedComponent<
  LiquidGlassContainerViewProps,
  React.ComponentRef<typeof LiquidGlassContainerView>
> = Animated.createAnimatedComponent(LiquidGlassContainerView);

export {
  AnimatedLiquidGlassContainerView,
  AnimatedLiquidGlassView,
  isLiquidGlassSupported,
};
