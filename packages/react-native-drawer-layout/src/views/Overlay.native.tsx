import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { OverlayProps } from '../types';
import { GestureDetector } from './GestureHandler';

// Treat near-zero progress as closed so float noise doesn't toggle a11y/hit testing.
const PROGRESS_EPSILON = 0.05;

export function Overlay({
  progress,
  onPress,
  style,
  accessibilityLabel = 'Close drawer',
  // Optional pan: swipe-to-close from the dimmed area without widening the root
  // edge hitSlop (keeps content horizontal pans + avoids Fabric flash from
  // hitSlop flips).
  panGesture,
  ...rest
}: OverlayProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const active = progress.value > PROGRESS_EPSILON;

    return {
      opacity: progress.value,
      pointerEvents: active ? 'auto' : 'none',
    };
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const active = progress.value > PROGRESS_EPSILON;

    return {
      'aria-hidden': !active,
      // Keep VoiceOver inside drawer UI while open; covered content stays unreachable.
      accessibilityViewIsModal: active,
    } as const;
  }, [progress]);

  const pressable = (
    <Pressable
      onPress={onPress}
      style={styles.pressable}
      role="button"
      aria-label={accessibilityLabel}
      accessible
    />
  );

  return (
    <Animated.View
      {...rest}
      style={[StyleSheet.absoluteFill, styles.overlay, animatedStyle, style]}
      animatedProps={animatedProps}
    >
      {panGesture != null ? (
        <GestureDetector gesture={panGesture}>{pressable}</GestureDetector>
      ) : (
        pressable
      )}
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
