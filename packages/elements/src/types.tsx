import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type HeaderOptions = {
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to scene `title`.
   * It receives `allowFontScaling`, `tintColor`, `style` and `children` in the options object as an argument.
   * The title string is passed in `children`.
   */
  headerTitle?:
    | string
    | ((props: {
        /**
         * Whether title font should scale to respect Text Size accessibility settings.
         */
        allowFontScaling?: boolean;
        /**
         * Tint color for the header.
         */
        tintColor?: string;
        /**
         * Style object for the title element.
         */
        style?: StyleProp<TextStyle>;
      }) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `center` on iOS and `left` on Android.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Style object for the title component.
   */
  headerTitleStyle?: StyleProp<TextStyle>;
  /**
   * Whether header title font should scale to respect Text Size accessibility settings. Defaults to `false`.
   */
  headerTitleAllowFontScaling?: boolean;
  /**
   * Function which returns a React Element to display on the left side of the header.
   */
  headerLeft?: (props: {
    tintColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    accessibilityLabel?: string;
  }) => React.ReactNode;
  /**
   * Accessibility label for the header left button.
   */
  headerLeftAccessibilityLabel?: string;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: {
    tintColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    accessibilityLabel?: string;
  }) => React.ReactNode;
  /**
   * Accessibility label for the header right button.
   */
  headerRightAccessibilityLabel?: string;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  headerPressColor?: string;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  headerPressOpacity?: number;
  /**
   * Tint color for the header.
   */
  headerTintColor?: string;
  /**
   * Style object for the header. You can specify a custom background color here, for example.
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * By default, it uses the top value from the safe area insets of the device.
   * Pass 0 or a custom value to disable the default behaviour, and customize the height.
   */
  headerStatusBarHeight?: number;
};
