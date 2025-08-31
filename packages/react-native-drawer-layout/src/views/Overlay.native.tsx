import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { OverlayProps } from '../types';

const PROGRESS_EPSILON = 0.05;

export function Overlay({
  progress,
  onPress,
  style,
  accessibilityLabel = 'Close drawer',
  ...rest
}: OverlayProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const active = progress.value > PROGRESS_EPSILON;

    return {
      'pointerEvents': active ? 'auto' : 'none',
      'aria-hidden': !active,
    } as const;
  }, [progress]);

  return (
    <Animated.View
      {...rest}
      style={[StyleSheet.absoluteFill, styles.overlay, animatedStyle, style]}
      animatedProps={animatedProps}
    >
      <Pressable
        onPress={onPress}
        style={styles.pressable}
        role="button"
        aria-label={accessibilityLabel}
        accessible
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pressable: {
    flex: 1,
    pointerEvents: 'auto',
  },
});
