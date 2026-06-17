import type {
  LiquidGlassContainerViewProps,
  LiquidGlassViewProps,
} from '@callstack/liquid-glass';
import { Animated, View } from 'react-native';

type AnimatedLiquidGlassViewProps =
  Animated.AnimatedProps<LiquidGlassViewProps>;

type AnimatedLiquidGlassContainerViewProps =
  Animated.AnimatedProps<LiquidGlassContainerViewProps>;

export const LiquidGlassView: React.ComponentType<LiquidGlassViewProps> = View;

export const LiquidGlassContainerView: React.ComponentType<LiquidGlassContainerViewProps> =
  View;

export const AnimatedLiquidGlassView: React.ComponentType<AnimatedLiquidGlassViewProps> =
  Animated.View;

export const AnimatedLiquidGlassContainerView: React.ComponentType<AnimatedLiquidGlassContainerViewProps> =
  Animated.View;

export const isLiquidGlassSupported = false;
