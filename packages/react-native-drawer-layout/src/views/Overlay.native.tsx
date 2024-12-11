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
      pointerEvents: active ? 'auto' : 'none',
      accessibilityElementsHidden: !active,
      importantForAccessibility: active ? 'auto' : 'no-hide-descendants',
    } as const;
  }, [progress]);

  return (
    <Animated.View
      {...rest}
      style={[styles.overlay, animatedStyle, style]}
      animatedProps={animatedProps}
    >
      <Pressable
        onPress={onPress}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pressable: {
    flex: 1,
    pointerEvents: 'auto',
  },
});
