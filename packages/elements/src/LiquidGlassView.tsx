import type {
  LiquidGlassContainerViewProps,
  LiquidGlassViewProps,
} from '@react-navigation/native';
import { Animated, View } from 'react-native';

export const AnimatedLiquidGlassView: Animated.AnimatedComponent<
  LiquidGlassViewProps,
  React.ComponentRef<typeof View>
> = Animated.View;

export const AnimatedLiquidGlassContainerView: Animated.AnimatedComponent<
  LiquidGlassContainerViewProps,
  React.ComponentRef<typeof View>
> = Animated.View;

export const isLiquidGlassSupported = false;
