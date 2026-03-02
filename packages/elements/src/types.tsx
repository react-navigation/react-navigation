import type {
  MaterialSymbolProps,
  SFSymbolProps,
} from '@react-navigation/native';
import * as React from 'react';
import type {
  Animated,
  ColorValue,
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { BlurEffectType } from './getBlurBackgroundColor';

export type HeaderBackButtonDisplayMode = 'default' | 'generic' | 'minimal';

export type Layout = { width: number; height: number };

export type HeaderSearchBarRef = {
  focus: () => void;
  blur: () => void;
  setText: (text: string) => void;
  clearText: () => void;
  cancelSearch: () => void;
};

export type HeaderSearchBarOptions = {
  /**
   * Ref to imperatively update the search bar.
   *
   * Supported operations:
   * - `focus` - focuses the search bar
   * - `blur` - removes focus from the search bar
   * - `setText` - sets the search bar's content to given value
   * - `clearText` - removes any text present in the search bar input field
   * - `cancelSearch` - cancel the search and close the search bar
   */
  ref?: React.Ref<HeaderSearchBarRef> | undefined;
  /**
   * The auto-capitalization behavior
   */
  autoCapitalize?:
    | 'none'
    | 'words'
    | 'sentences'
    | 'characters'
    | 'systemDefault'
    | undefined;
  /**
   * Automatically focuses search input on mount
   */
  autoFocus?: boolean | undefined;
  /**
   * The text to be used instead of default `Cancel` button text
   *
   * @platform ios
   */
  cancelButtonText?: string | undefined;
  /**
   * Sets type of the input. Defaults to `text`.
   */
  inputType?: 'text' | 'phone' | 'number' | 'email' | undefined;
  /**
   * Determines how the return key should look. Defaults to `search`.
   */
  enterKeyHint?: TextInputProps['enterKeyHint'] | undefined;
  /**
   * A callback that gets called when search input has lost focus
   */
  onBlur?: TextInputProps['onBlur'] | undefined;
  /**
   * A callback that gets called when the text changes.
   * It receives the current text value of the search input.
   */
  onChange?: TextInputProps['onChange'] | undefined;
  /**
   * Callback that is called when the submit button is pressed.
   * It receives the current text value of the search input.
   */
  onSubmitEditing?: TextInputProps['onSubmitEditing'] | undefined;
  /**
   * A callback that gets called when search input is opened
   */
  onOpen?: (() => void) | undefined;
  /**
   * A callback that gets called when search input is closed
   */
  onClose?: (() => void) | undefined;
  /**
   * A callback that gets called when search input has received focus
   */
  onFocus?: TextInputProps['onFocus'] | undefined;
  /**
   * Text displayed when search field is empty
   */
  placeholder?: string | undefined;
};

export type HeaderOptions = {
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to screen `title` or route name.
   *
   * It receives `allowFontScaling`, `tintColor`, `style` and `children` in the options object as an argument.
   * The title string is passed in `children`.
   */
  headerTitle?:
    | string
    | ((props: HeaderTitleProps) => React.ReactNode)
    | undefined;
  /**
   * How to align the the header title.
   * Defaults to `center` on iOS and `left` on Android.
   */
  headerTitleAlign?: 'left' | 'center' | undefined;
  /**
   * Style object for the title component.
   */
  headerTitleStyle?:
    | Animated.WithAnimatedValue<StyleProp<TextStyle>>
    | undefined;
  /**
   * Style object for the container of the `headerTitle` element.
   */
  headerTitleContainerStyle?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | undefined;
  /**
   * Whether header title font should scale to respect Text Size accessibility settings. Defaults to `false`.
   */
  headerTitleAllowFontScaling?: boolean | undefined;
  /**
   * Options to render a search bar.
   */
  headerSearchBarOptions?: HeaderSearchBarOptions | undefined;
  /**
   * How the back button displays icon and title.
   *
   * Supported values:
   * - "default" - Displays one of the following depending on the available space: previous screen's title, truncated title (e.g. 'Back') or no title (only icon).
   * - "generic" – Displays one of the following depending on the available space: truncated title (e.g. 'Back') or no title (only icon).
   * - "minimal" – Always displays only the icon without a title.
   *
   * Defaults to "default" on iOS, and "minimal" on other platforms.
   */
  headerBackButtonDisplayMode?: HeaderBackButtonDisplayMode | undefined;
  /**
   * Style object for header back title. Supported properties:
   * - fontFamily
   * - fontSize
   */
  headerBackTitleStyle?:
    | StyleProp<{
        fontFamily?: string | undefined;
        fontSize?: number | undefined;
      }>
    | undefined;
  /**
   * Function which returns a React Element to display on the left side of the header.
   */
  headerLeft?: (
    props: HeaderBackButtonProps & {
      /**
       * Whether it's possible to navigate back.
       */
      canGoBack?: boolean | undefined;
    }
  ) => React.ReactNode;
  /**
   * Whether the liquid glass background is visible for the item.
   *
   * Only supported on iOS 26.0 and later.
   * Older versions of iOS and other platforms never show the background.
   *
   * Defaults to `true`.
   */
  headerLeftBackgroundVisible?: boolean | undefined;
  /**
   * Style object for the container of the `headerLeft` element`.
   */
  headerLeftContainerStyle?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | undefined;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: {
    tintColor?: ColorValue | undefined;
    pressColor?: ColorValue | undefined;
    pressOpacity?: number | undefined;
    canGoBack: boolean;
  }) => React.ReactNode;
  /**
   * Whether the liquid glass background is visible for the item.
   *
   * Only supported on iOS 26.0 and later.
   * Older versions of iOS and other platforms never show the background.
   *
   * Defaults to `true`.
   */
  headerRightBackgroundVisible?: boolean | undefined;
  /**
   * Style object for the container of the `headerRight` element.
   */
  headerRightContainerStyle?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | undefined;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  headerPressColor?: ColorValue | undefined;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  headerPressOpacity?: number | undefined;
  /**
   * Tint color for the header.
   */
  headerTintColor?: ColorValue | undefined;
  /**
   * Function which returns a React Element to render as the background of the header.
   * This is useful for using backgrounds such as an image, a gradient, blur effect etc.
   * You can use this with `headerTransparent` to render a blur view, for example, to create a translucent header.
   */
  headerBackground?:
    | ((props: {
        style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
      }) => React.ReactNode)
    | undefined;
  /**
   * Style object for the container of the `headerBackground` element.
   */
  headerBackgroundContainerStyle?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | undefined;
  /**
   * Defaults to `false`. If `true`, the header will not have a background unless you explicitly provide it with `headerBackground`.
   * The header will also float over the screen so that it overlaps the content underneath.
   * This is useful if you want to render a semi-transparent header or a blurred background.
   */
  headerTransparent?: boolean | undefined;
  /**
   * Blur effect for the translucent header.
   * The `headerTransparent` option needs to be set to `true` for this to work.
   *
   * Only supported on Web.
   *
   * @platform web
   */
  headerBlurEffect?: BlurEffectType | 'none' | undefined;
  /**
   * Style object for the header. You can specify a custom background color here, for example.
   */
  headerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>> | undefined;
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
  headerShadowVisible?: boolean | undefined;
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * By default, it uses the top value from the safe area insets of the device.
   * Pass 0 or a custom value to disable the default behaviour, and customize the height.
   */
  headerStatusBarHeight?: number | undefined;
};

export type HeaderTitleProps = {
  /**
   * The title text of the header.
   */
  children: string;
  /**
   * Whether title font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean | undefined;
  /**
   * Tint color for the header.
   */
  tintColor?: ColorValue | undefined;
  /**
   * Callback to trigger when the size of the title element changes.
   */
  onLayout?: ((e: LayoutChangeEvent) => void) | undefined;
  /**
   * Style object for the title element.
   */
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>> | undefined;
};

export type HeaderButtonProps = {
  /**
   * Callback to call when the button is pressed.
   */
  onPress?: (() => void) | undefined;
  /**
   * The `href` to use for the anchor tag on web
   */
  href?: string | undefined;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean | undefined;
  /**
   * Accessibility label for the button for screen readers.
   */
  accessibilityLabel?: string | undefined;
  /**
   * ID to locate this button in tests.
   */
  testID?: string | undefined;
  /**
   * Tint color for the header button.
   */
  tintColor?: ColorValue | undefined;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  pressColor?: ColorValue | undefined;
  /**
   * Opacity when the button is pressed, used when ripple is not supported.
   */
  pressOpacity?: number | undefined;
  /**
   * Style object for the button.
   */
  style?: StyleProp<ViewStyle> | undefined;
  /**
   * Content to render for the button. Usually the icon.
   */
  children: React.ReactNode;
};

export type HeaderIcon =
  | {
      type: 'image';
      source: ImageSourcePropType;
    }
  | {
      type: 'sfSymbol';
      name: SFSymbolProps['name'];
    }
  | ({
      type: 'materialSymbol';
    } & Pick<MaterialSymbolProps, 'name' | 'variant' | 'weight'>);

export type HeaderBackButtonProps = Omit<HeaderButtonProps, 'children'> & {
  /**
   * Icon to display for the back button.
   *
   * Supported types:
   * - image: custom image source
   * - sfSymbol: SF Symbol icon (iOS only)
   * - materialSymbol: material symbol icon (Android only)
   * - React Node: function that returns a React Element
   *
   * Defaults to back icon image for the platform
   * - A chevron on iOS
   * - An arrow on Android
   */
  icon?:
    | HeaderIcon
    | ((props: { tintColor: ColorValue | undefined }) => React.ReactNode)
    | undefined;
  /**
   * Label text for the button. Usually the title of the previous screen.
   * By default, this is only shown on iOS.
   */
  label?: string | undefined;
  /**
   * Label text to show when there isn't enough space for the full label.
   */
  truncatedLabel?: string | undefined;
  /**
   * How the back button displays icon and title.
   *
   * Supported values:
   * - "default" - Displays one of the following depending on the available space: previous screen's title, truncated title (e.g. 'Back') or no title (only icon).
   * - "generic" – Displays one of the following depending on the available space: truncated title (e.g. 'Back') or no title (only icon).
   * - "minimal" – Always displays only the icon without a title.
   *
   * Defaults to "default" on iOS, and "minimal" on other platforms.
   */
  displayMode?: HeaderBackButtonDisplayMode | undefined;
  /**
   * Style object for the label.
   */
  labelStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>> | undefined;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean | undefined;
};
