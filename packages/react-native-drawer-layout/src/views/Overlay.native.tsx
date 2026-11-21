import { Platform, Pressable, StyleSheet, type ViewProps } from 'react-native';
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
    const active = progress.value > PROGRESS_EPSILON;

    return {
      opacity: progress.value,
      pointerEvents: active ? 'auto' : 'none',
    };
  });

  const animatedProps = useAnimatedProps<ViewProps>(() => {
    const active = progress.value > PROGRESS_EPSILON;

    if (Platform.OS === 'android') {
      const importantForAccessibility: ViewProps['importantForAccessibility'] =
        active ? 'auto' : 'no-hide-descendants';

      return { importantForAccessibility };
    }

    return { accessibilityElementsHidden: !active };
  });

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
