import { Animated, StyleSheet } from 'react-native';

import { AnimatedLiquidGlassView } from '../LiquidGlassView';
import { BUTTON_SIZE } from './HeaderButton';

type Props = React.ComponentProps<typeof Animated.View> & {
  plain?: boolean;
};

export function HeaderButtonBackground({ plain, style, ...rest }: Props) {
  if (plain) {
    return <Animated.View style={[styles.container, style]} {...rest} />;
  }

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
