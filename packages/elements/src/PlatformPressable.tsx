import * as React from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

export type Props = PressableProps & {
  pressColor?: string;
  pressOpacity?: number;
  children: React.ReactNode;
};

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
export default function PlatformPressable({
  android_ripple,
  pressColor,
  pressOpacity,
  style,
  ...rest
}: Props) {
  const { dark } = useTheme();

  return (
    <Pressable
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
      style={({ pressed }) => [
        { opacity: pressed && !ANDROID_SUPPORTS_RIPPLE ? pressOpacity : 1 },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}
    />
  );
}
