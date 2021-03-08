import * as React from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';

export type Props = PressableProps & {
  pressColor?: string;
  pressOpacity?: number;
  children: React.ReactNode;
};

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

/**
 * PlatformPressable provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity to handle platform differences.
 *
 * On Android, you can pass the props of TouchableNativeFeedback.
 * On other platforms, you can pass the props of TouchableOpacity.
 */
export default function PlatformPressable({
  android_ripple,
  pressColor = 'rgba(0, 0, 0, .32)',
  pressOpacity,
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      android_ripple={
        ANDROID_SUPPORTS_RIPPLE
          ? { color: pressColor, ...android_ripple }
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
