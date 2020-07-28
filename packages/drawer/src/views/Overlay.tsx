import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

const {
  interpolate: interpolateDeprecated,
  // @ts-expect-error: this property is only present in Reanimated 2
  interpolateNode,
  cond,
  greaterThan,
} = Animated;

const interpolate: typeof interpolateDeprecated =
  interpolateNode ?? interpolateDeprecated;

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
      // Default input range is [PROGRESS_EPSILON, 1]
      // On Windows, the output value is 1 when input value is out of range for some reason
      // The default value 0 will be interpolated to 1 in this case, which is not what we want.
      // Therefore changing input range on Windows to [0,1] instead.
      inputRange:
        Platform.OS === 'windows' || Platform.OS === 'macos'
          ? [0, 1]
          : [PROGRESS_EPSILON, 1],
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
      style={[styles.overlay, overlayStyle, animatedStyle, style]}
    />
  );
});

const overlayStyle = Platform.select<Record<string, string>>({
  web: {
    // Disable touch highlight on mobile Safari.
    // WebkitTapHighlightColor must be used outside of StyleSheet.create because react-native-web will omit the property.
    WebkitTapHighlightColor: 'transparent',
  },
  default: {},
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Overlay;
