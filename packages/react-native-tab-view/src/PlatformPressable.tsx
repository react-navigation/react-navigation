import * as React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableProps,
} from 'react-native';

export type Props = Omit<PressableProps, 'onPress'> & {
  href?: string;
  pressColor?: string;
  pressOpacity?: number;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
  children: React.ReactNode;
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
  const handlePress = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    if (Platform.OS === 'web' && rest.href !== null) {
      // ignore clicks with modifier keys
      const hasModifierKey =
        ('metaKey' in e && e.metaKey) ||
        ('altKey' in e && e.altKey) ||
        ('ctrlKey' in e && e.ctrlKey) ||
        ('shiftKey' in e && e.shiftKey);

      // only handle left clicks
      const isLeftClick =
        'button' in e ? e.button == null || e.button === 0 : true;

      // let browser handle "target=_blank" etc.
      const isSelfTarget =
        e.currentTarget && 'target' in e.currentTarget
          ? [undefined, null, '', 'self'].includes(e.currentTarget.target)
          : true;

      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault();
        // call `onPress` only when browser default is prevented
        // this prevents app from handling the click when a link is being opened
        onPress?.(e);
      }
    } else {
      onPress?.(e);
    }
  };

  return (
    <Pressable
      android_ripple={
        ANDROID_SUPPORTS_RIPPLE && !disabled
          ? { color: pressColor, ...android_ripple }
          : undefined
      }
      style={({ pressed }) => [
        {
          cursor:
            (Platform.OS === 'web' || Platform.OS === 'ios') && !disabled
              ? // Pointer cursor on web
                // Hover effect on iPad and visionOS
                'pointer'
              : 'auto',
          opacity:
            !ANDROID_SUPPORTS_RIPPLE && pressed && !disabled ? pressOpacity : 1,
        } as const,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      onPress={disabled ? undefined : handlePress}
      {...rest}
    />
  );
}
