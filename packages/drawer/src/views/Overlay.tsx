import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

const { interpolate, cond, greaterThan } = Animated;

const PROGRESS_EPSILON = 0.05;

type Props = React.ComponentProps<typeof Animated.View> & {
  progress: Animated.Node<number>;
};

const Overlay = React.forwardRef(function Overlay(
  { progress, style, ...props }: Props,
  ref: React.Ref<Animated.View>
) {
  const animatedStyle = {
    opacity: interpolate(progress, {
      inputRange: [PROGRESS_EPSILON, 1],
      outputRange: [0, 1],
    }),
    // We don't want the user to be able to press through the overlay when drawer is open
    // One approach is to adjust the pointerEvents based on the progress
    // But we can also send the overlay behind the screen, which works, and is much less code
    zIndex: cond(greaterThan(progress, PROGRESS_EPSILON), 0, -1),
  };

  return (
    <Animated.View
      {...props}
      ref={ref}
      style={[styles.overlay, animatedStyle, style]}
    />
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...Platform.select({
      web: {
        // Disable touch highlight on mobile Safari.
        WebkitTapHighlightColor: 'transparent',
      },
      default: {},
    }),
  },
});

export default Overlay;
