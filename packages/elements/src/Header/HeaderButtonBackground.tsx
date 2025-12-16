import { Animated, StyleSheet } from 'react-native';

import { LiquidGlassView } from '../LiquidGlassView';
import { BUTTON_SIZE } from './HeaderButton';

type Props = React.ComponentProps<typeof Animated.View>;

const AnimatedLiquidGlassView =
  Animated.createAnimatedComponent(LiquidGlassView);

export function HeaderButtonBackground({ style, ...rest }: Props) {
  return (
    <AnimatedLiquidGlassView
      interactive
      style={[styles.container, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderCurve: 'continuous',
  },
});
