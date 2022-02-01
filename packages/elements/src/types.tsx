import type {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type Layout = { width: number; height: number };

export type HeaderOptions = {
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to screen `title` or route name.
   *
   * It receives `allowFontScaling`, `tintColor`, `style` and `children` in the options object as an argument.
   * The title string is passed in `children`.
   */
  headerTitle?: string | ((props: HeaderTitleProps) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `center` on iOS and `left` on Android.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Style object for the title component.
   */
  headerTitleStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
  /**
   * Style object for the container of the `headerTitle` element.
   */
  headerTitleContainerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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
    labelVisible?: boolean;
  }) => React.ReactNode;
  /**
   * Whether a label is visible in the left button. Used to add extra padding.
   */
  headerLeftLabelVisible?: boolean;
  /**
   * Style object for the container of the `headerLeft` element`.
   */
  headerLeftContainerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: {
    tintColor?: string;
    pressColor?: string;
    pressOpacity?: number;
  }) => React.ReactNode;
  /**
   * Style object for the container of the `headerRight` element.
   */
  headerRightContainerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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
   * Function which returns a React Element to render as the background of the header.
   * This is useful for using backgrounds such as an image, a gradient, blur effect etc.
   * You can use this with `headerTransparent` to render a blur view, for example, to create a translucent header.
   */
  headerBackground?: (props: {
    style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  }) => React.ReactNode;
  /**
   * Style object for the container of the `headerBackground` element.
   */
  headerBackgroundContainerStyle?: Animated.WithAnimatedValue<
    StyleProp<ViewStyle>
  >;
  /**
   * Defaults to `false`. If `true`, the header will not have a background unless you explicitly provide it with `headerBackground`.
   * The header will also float over the screen so that it overlaps the content underneath.
   * This is useful if you want to render a semi-transparent header or a blurred background.
   */
  headerTransparent?: boolean;
  /**
   * Style object for the header. You can specify a custom background color here, for example.
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * Whether to hide the elevation shadow (Android) or the bottom border (iOS) on the header.
   *
   * This is a short-hand for the following styles:
   *
   * ```js
   * {
   *   elevation: 0,
   *   shadowOpacity: 0,
   *   borderBottomWidth: 0,
   * }
   * ```
   *
   * If the above styles are specified in `headerStyle` along with `headerShadowVisible: false`,
   * then `headerShadowVisible: false` will take precedence.
   */
  headerShadowVisible?: boolean;
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * By default, it uses the top value from the safe area insets of the device.
   * Pass 0 or a custom value to disable the default behaviour, and customize the height.
   */
  headerStatusBarHeight?: number;
};

export type HeaderTitleProps = {
  /**
   * The title text of the header.
   */
  children: string;
  /**
   * Whether title font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
  /**
   * Tint color for the header.
   */
  tintColor?: string;
  /**
   * Callback to trigger when the size of the title element changes.
   */
  onLayout?: (e: LayoutChangeEvent) => void;
  /**
   * Style object for the title element.
   */
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
};

export type HeaderButtonProps = {
  /**
   * Tint color for the header button.
   */
  tintColor?: string;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  pressColor?: string;
  /**
   * Opacity when the button is pressed, used when ripple is not supported.
   */
  pressOpacity?: number;
  /**
   * Whether it's possible to navigate back in stack.
   */
  canGoBack?: boolean;
};

export type HeaderBackButtonProps = HeaderButtonProps & {
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Callback to call when the button is pressed.
   */
  onPress?: () => void;
  /**
   * Function which returns a React Element to display custom image in header's back button.
   */
  backImage?: (props: { tintColor: string }) => React.ReactNode;
  /**
   * Label text for the button. Usually the title of the previous screen.
   * By default, this is only shown on iOS.
   */
  label?: string;
  /**
   * Label text to show when there isn't enough space for the full label.
   */
  truncatedLabel?: string;
  /**
   * Whether the label text is visible.
   * Defaults to `true` on iOS and `false` on Android.
   */
  labelVisible?: boolean;
  /**
   * Style object for the label.
   */
  labelStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
  /**
   * Callback to trigger when the size of the label changes.
   */
  onLabelLayout?: (e: LayoutChangeEvent) => void;
  /**
   * Layout of the screen.
   */
  screenLayout?: Layout;
  /**
   * Layout of the title element in the header.
   */
  titleLayout?: Layout;
  /**
   * Accessibility label for the button for screen readers.
   */
  accessibilityLabel?: string;
  /**
   * ID to locate this button in tests.
   */
  testID?: string;
  /**
   * Style object for the button.
   */
  style?: StyleProp<ViewStyle>;
};
