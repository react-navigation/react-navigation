import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type Props = Omit<PressableProps, 'style'> & {
  pressColor?: string;
  pressOpacity?: number;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  children: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
export default function PlatformPressable({
  onPressIn,
  onPressOut,
  android_ripple,
  pressColor,
  pressOpacity = 0.3,
  style,
  ...rest
}: Props) {
  const { dark } = useTheme();
  const [opacity] = React.useState(() => new Animated.Value(1));

  const animateTo = (toValue: number, duration: number) => {
    if (ANDROID_SUPPORTS_RIPPLE) {
      return;
    }

    Animated.timing(opacity, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = (e: GestureResponderEvent) => {
    animateTo(pressOpacity, 0);
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    animateTo(1, 200);
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={
        ANDROID_SUPPORTS_RIPPLE
          ? {
              color:
                pressColor !== undefined
                  ? pressColor
                  : dark
                  ? 'rgba(255, 255, 255, .32)'
                  : 'rgba(0, 0, 0, .32)',
              ...android_ripple,
            }
          : undefined
      }
      style={[{ opacity: !ANDROID_SUPPORTS_RIPPLE ? opacity : 1 }, style]}
      {...rest}
    />
  );
}
