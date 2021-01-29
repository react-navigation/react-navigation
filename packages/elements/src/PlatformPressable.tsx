import * as React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  TouchableWithoutFeedbackProps,
} from 'react-native';

export type Props = TouchableWithoutFeedbackProps & {
  pressColor?: string;
  pressOpacity?: number;
  disabled?: boolean | null;
  borderless?: boolean;
  children: React.ReactNode;
};

const ANDROID_VERSION_LOLLIPOP = 21;

/**
 * PlatformPressable provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity to handle platform differences.
 *
 * On Android, you can pass the props of TouchableNativeFeedback.
 * On other platforms, you can pass the props of TouchableOpacity.
 */
export default function PlatformPressable({
  borderless = false,
  pressColor = 'rgba(0, 0, 0, .32)',
  pressOpacity,
  style,
  children,
  ...rest
}: Props) {
  /*
   * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
   * therefore only enable it on Android Lollipop and above.
   *
   * All touchables on Android should have the ripple effect according to
   * platform design guidelines.
   * We need to pass the background prop to specify a borderless ripple effect.
   */
  if (
    Platform.OS === 'android' &&
    Platform.Version >= ANDROID_VERSION_LOLLIPOP
  ) {
    return (
      <TouchableNativeFeedback
        {...rest}
        useForeground={TouchableNativeFeedback.canUseNativeForeground()}
        background={TouchableNativeFeedback.Ripple(pressColor, borderless)}
      >
        <View style={style}>{React.Children.only(children)}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity style={style} activeOpacity={pressOpacity} {...rest}>
        {children}
      </TouchableOpacity>
    );
  }
}
