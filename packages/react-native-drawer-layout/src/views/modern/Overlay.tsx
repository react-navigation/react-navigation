import * as React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

const PROGRESS_EPSILON = 0.05;

type Props = React.ComponentProps<typeof Animated.View> & {
  progress: Animated.SharedValue<number>;
  onPress: () => void;
  accessibilityLabel?: string;
};

const Overlay = React.forwardRef(function Overlay(
  {
    progress,
    onPress,
    style,
    accessibilityLabel = 'Close drawer',
    ...props
  }: Props,
  ref: React.Ref<Animated.View>
) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      // We don't want the user to be able to press through the overlay when drawer is open
      // We can send the overlay behind the screen to avoid it
      zIndex: progress.value > PROGRESS_EPSILON ? 0 : -1,
    };
  });

  const animatedProps = useAnimatedProps(() => {
    const active = progress.value > PROGRESS_EPSILON;

    return {
      pointerEvents: active ? 'auto' : 'none',
      accessibilityElementsHidden: !active,
      importantForAccessibility: active ? 'auto' : 'no-hide-descendants',
    } as const;
  });

  return (
    <Animated.View
      {...props}
      ref={ref}
      style={[styles.overlay, overlayStyle, animatedStyle, style]}
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
  pressable: {
    flex: 1,
    pointerEvents: 'auto',
  },
});

export default Overlay;
