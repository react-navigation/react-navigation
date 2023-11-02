import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Easing,
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type Props = Omit<PressableProps, 'style'> & {
  pressColor?: string;
  pressOpacity?: number;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  href?: string;
  children: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
export function PlatformPressable({
  disabled,
  onPress,
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

  const handlePress = (e: GestureResponderEvent) => {
    // @ts-expect-error: these properties exist on web, but not in React Native
    const hasModifierKey = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey; // ignore clicks with modifier keys
    // @ts-expect-error: these properties exist on web, but not in React Native
    const isLeftClick = e.button == null || e.button === 0; // only handle left clicks
    const isSelfTarget = [undefined, null, '', 'self'].includes(
      // @ts-expect-error: these properties exist on web, but not in React Native
      e.currentTarget?.target
    ); // let browser handle "target=_blank" etc.

    if (Platform.OS === 'web' && rest.href != null) {
      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault();
        onPress?.(e);
      }
    } else {
      onPress?.(e);
    }
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
      accessible
      accessibilityRole={
        Platform.OS === 'web' && rest.href != null ? 'link' : 'button'
      }
      onPress={disabled ? undefined : handlePress}
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
