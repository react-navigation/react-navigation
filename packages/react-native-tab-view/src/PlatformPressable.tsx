import * as React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableProps,
} from 'react-native';

export type Props = PressableProps & {
  children: React.ReactNode;
  pressColor?: string;
  pressOpacity?: number;
  href?: string;
};

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
export function PlatformPressable({
  disabled,
  android_ripple,
  pressColor = 'rgba(0, 0, 0, .32)',
  pressOpacity,
  style,
  onPress,
  ...rest
}: Props) {
  const handlePress = (e: GestureResponderEvent) => {
    if (Platform.OS === 'web' && rest.href !== null) {
      // @ts-expect-error: these properties exist on web, but not in React Native
      const hasModifierKey = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey; // ignore clicks with modifier keys
      // @ts-expect-error: these properties exist on web, but not in React Native
      const isLeftClick = e.button === null || e.button === 0; // only handle left clicks
      const isSelfTarget = [undefined, null, '', 'self'].includes(
        // @ts-expect-error: these properties exist on web, but not in React Native
        e.currentTarget?.target
      ); // let browser handle "target=_blank" etc.

      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault();
        onPress?.(e);
      }
    } else {
      onPress?.(e);
    }
  };

  return (
    <Pressable
      android_ripple={
        ANDROID_SUPPORTS_RIPPLE
          ? { color: pressColor, ...android_ripple }
          : undefined
      }
      style={({ pressed }) => [
        {
          cursor:
            Platform.OS === 'web' || Platform.OS === 'ios'
              ? // Pointer cursor on web
                // Hover effect on iPad and visionOS
                'pointer'
              : 'auto',
          opacity: pressed && !ANDROID_SUPPORTS_RIPPLE ? pressOpacity : 1,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      onPress={disabled ? undefined : handlePress}
      {...rest}
    />
  );
}
