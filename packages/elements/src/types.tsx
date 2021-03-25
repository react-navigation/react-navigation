import type {
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native';

type ScreenOrientationTypes =
  | 'default'
  | 'all'
  | 'portrait'
  | 'portrait_up'
  | 'portrait_down'
  | 'landscape'
  | 'landscape_left'
  | 'landscape_right';

export type Layout = { width: number; height: number };

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
         * Style object for the title element.
         */
        style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
      }) => React.ReactNode);
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
  }) => React.ReactNode;
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
   * This is useful for using backgrounds such as an image or a gradient.
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
   * Extra padding to add at the top of header to account for translucent status bar.
   * By default, it uses the top value from the safe area insets of the device.
   * Pass 0 or a custom value to disable the default behaviour, and customize the height.
   */
  headerStatusBarHeight?: number;
};

export type HeaderBackButtonProps = {
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Callback to call when the button is pressed.
   */
  onPress?: () => void;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  pressColor?: string;
  /**
   * Opacity when the button is pressed, used when ripple is not supported.
   */
  pressOpacity?: number;
  /**
   * Function which returns a React Element to display custom image in header's back button.
   */
  backImage?: (props: { tintColor: string }) => React.ReactNode;
  /**
   * Tint color for the header.
   */
  tintColor?: string;
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
   * Whether it's possible to navigate back in stack.
   */
  canGoBack?: boolean;
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

export type NativeScreenTraitsProps = {
  /**
   * In which orientation should the screen appear. It requires having `react-native-screens` enabled.
   * The following values are currently supported:
   * - "default" - resolves to "all" without "portrait_down" on iOS. On Android, this lets the system decide the best orientation.
   * - "all" – all orientations are permitted
   * - "portrait" – portrait orientations are permitted
   * - "portrait_up" – right-side portrait orientation is permitted
   * - "portrait_down" – upside-down portrait orientation is permitted
   * - "landscape" – landscape orientations are permitted
   * - "landscape_left" – landscape-left orientation is permitted
   * - "landscape_right" – landscape-right orientation is permitted
   */
  screenOrientation?: ScreenOrientationTypes;
  /**
   * Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file and having `react-native-screens` enabled.
   */
  statusBarAnimation?: 'none' | 'fade' | 'slide';
  /** Sets the status bar color (similar to the `StatusBar` component). It requires having `react-native-screens` enabled.
   *
   * @platform android
   */
  statusBarColor?: string;
  /**
   * Whether the status bar should be hidden on this screen. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file and having `react-native-screens` enabled.
   */
  statusBarHidden?: boolean;
  /** Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file and having `react-native-screens` enabled.
   */
  statusBarStyle?: 'inverted' | 'auto' | 'light' | 'dark';
  /**
   * Sets the translucency of the status bar. Defaults to true. It requires having `react-native-screens` enabled.
   *
   * @platform android
   */
  statusBarTranslucent?: boolean;
};
