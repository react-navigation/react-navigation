import type { Route } from '@react-navigation/native';
import type {
  ColorValue,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
} from 'react-native';
import type {
  ScreenStackHeaderConfigProps,
  SearchBarProps,
} from 'react-native-screens';
import type { SFSymbol } from 'sf-symbols-typescript';

export type NativeHeaderNavigationOptions = {
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Whether the back button is visible in the header.
   * You can use it to show a back button alongside `headerLeft` if you have specified it.
   *
   * This will have no effect on the first screen in the stack.
   */
  headerBackVisible?: boolean;
  /**
   * Title string used by the back button on iOS.
   * Defaults to the previous scene's title.
   * On iOS the text might be shortened to "Back" or arrow icon depending on the available space, following native iOS behaviour.
   * See `headerBackButtonDisplayMode` to read about limitations and interactions with other props.
   * Use `headerBackButtonDisplayMode: "minimal"` to hide it.
   *
   * Only supported on iOS and Web.
   *
   * @platform ios, web
   */
  headerBackTitle?: string;
  /**
   * Style object for header back title. Supported properties:
   * - fontFamily
   * - fontSize
   *
   * Only supported on iOS and Web.
   *
   * @platform ios, web
   */
  headerBackTitleStyle?: StyleProp<{
    fontFamily?: string;
    fontSize?: number;
  }>;
  /**
   * Image to display in the header as the icon in the back button.
   * Defaults to back icon image for the platform
   * - A chevron on iOS
   * - An arrow on Android
   */
  headerBackImageSource?: ImageSourcePropType;
  /**
   * Style of the header when a large title is shown.
   * The large title is shown if `headerLargeTitle` is `true` and
   * the edge of any scrollable content reaches the matching edge of the header.
   *
   * Supported properties:
   * - backgroundColor
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeStyle?: StyleProp<{
    backgroundColor?: ColorValue;
  }>;
  /**
   * Whether to enable header with large title which collapses to regular header on scroll.
   *
   * For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`.
   * If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.
   * You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitle?: boolean;
  /**
   * Whether drop shadow of header is visible when a large title is shown.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleShadowVisible?: boolean;
  /**
   * Style object for large title in header. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleStyle?: StyleProp<{
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: ColorValue;
  }>;
  /**
   * Whether to show the header. The header is shown by default.
   * Setting this to `false` hides the header.
   */
  headerShown?: boolean;
  /**
   * Style object for header. Supported properties:
   * - backgroundColor
   */
  headerStyle?: StyleProp<{
    backgroundColor?: ColorValue;
  }>;
  /**
   * Whether to hide the elevation shadow (Android) or the bottom border (iOS) on the header.
   */
  headerShadowVisible?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   * Setting this to `true` makes the header absolutely positioned,
   * and changes the background color to `transparent` unless specified in `headerStyle`.
   */
  headerTransparent?: boolean;
  /**
   * Blur effect for the translucent header.
   * The `headerTransparent` option needs to be set to `true` for this to work.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBlurEffect?: ScreenStackHeaderConfigProps['blurEffect'];
  /**
   * Tint color for the header. Changes the color of back button and title.
   */
  headerTintColor?: ColorValue;
  /**
   * Function which returns a React Element to render as the background of the header.
   * This is useful for using backgrounds such as an image, a gradient, blur effect etc.
   * You can use this with `headerTransparent` to render content underneath a translucent header.
   */
  headerBackground?: () => React.ReactNode;
  /**
   * Function which returns a React Element to display on the left side of the header.
   * This replaces the back button. See `headerBackVisible` to show the back button along side left element.
   * Will be overriden by `headerLeftItems` on iOS.
   */
  headerLeft?: (props: NativeStackHeaderBackProps) => React.ReactNode;
  /**
   * Function which returns a React Element to display on the right side of the header.
   * Will be overriden by `headerRightItems` on iOS.
   */
  headerRight?: (props: NativeStackHeaderItemProps) => React.ReactNode;
  /**
   * Function which returns an array of items to display as on the left side of the header.
   * Overrides `headerLeft`.
   *
   * This is an unstable API and might change in the future.
   *
   * @platform ios
   */
  unstable_headerLeftItems?: (
    props: NativeStackHeaderItemProps
  ) => NativeStackHeaderItem[];
  /**
   * Function which returns an array of items to display as on the right side of the header.
   * Overrides `headerRight`.
   *
   * This is an unstable API and might change in the future.
   *
   * @platform ios
   */
  unstable_headerRightItems?: (
    props: NativeStackHeaderItemProps
  ) => NativeStackHeaderItem[];
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to screen `title` or route name.
   *
   * When a function is passed, it receives `tintColor` and`children` in the options object as an argument.
   * The title string is passed in `children`.
   *
   * Note that if you render a custom element by passing a function, animations for the title won't work.
   */
  headerTitle?:
    | string
    | ((props: {
        /**
         * The title text of the header.
         */
        children: string;
        /**
         * Tint color for the header.
         */
        tintColor?: ColorValue;
      }) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `left` on platforms other than iOS.
   *
   * Not supported on iOS. It's always `center` on iOS and cannot be changed.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   */
  headerTitleStyle?: StyleProp<
    Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fontWeight'> & {
      color?: ColorValue;
    }
  >;
  /**
   * Options to render a native search bar.
   * You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc.
   * If you don't have a `ScrollView`, specify `headerTransparent: false`.
   */
  headerSearchBarOptions?: SearchBarProps;
  /**
   * Boolean indicating whether to show the menu on longPress of iOS >= 14 back button. Defaults to `true`.
   * Requires `react-native-screens` version >=3.3.0.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackButtonMenuEnabled?: boolean;
  /**
   * How the back button displays icon and title.
   *
   * Supported values:
   * - "default" - Displays one of the following depending on the available space: previous screen's title, generic title (e.g. 'Back') or no title (only icon).
   * - "generic" – Displays one of the following depending on the available space: generic title (e.g. 'Back') or no title (only icon).
   * - "minimal" – Always displays only the icon without a title.
   *
   * The space-aware behavior is disabled when:
   * - The iOS version is 13 or lower
   * - Custom font family or size is set (e.g. with `headerBackTitleStyle`)
   * - Back button menu is disabled (e.g. with `headerBackButtonMenuEnabled`)
   *
   * In such cases, a static title and icon are always displayed.
   *
   * Defaults to "default" on iOS, and "minimal" on other platforms.
   *
   * Only supported on iOS and Web.
   *
   * @platform ios, web
   */
  headerBackButtonDisplayMode?: ScreenStackHeaderConfigProps['backButtonDisplayMode'];
};

export type NativeStackHeaderProps<
  NativeStackNavigationOptions extends NativeHeaderNavigationOptions,
  NativeStackNavigationProp,
> = {
  /**
   * Options for the back button.
   */
  back?: {
    /**
     * Title of the previous screen.
     */
    title: string | undefined;
    /**
     * The `href` to use for the anchor tag on web
     */
    href: string | undefined;
  };
  /**
   * Options for the current screen.
   */
  options: NativeStackNavigationOptions;
  /**
   * Route object for the current screen.
   */
  route: Route<string>;
  /**
   * Navigation prop for the header.
   */
  navigation: NativeStackNavigationProp;
};

export type NativeStackHeaderItemProps = {
  /**
   * Tint color for the header.
   */
  tintColor?: ColorValue;
  /**
   * Whether it's possible to navigate back in stack.
   */
  canGoBack?: boolean;
};

export type NativeStackHeaderBackProps = NativeStackHeaderItemProps & {
  /**
   * Label text for the button. Usually the title of the previous screen.
   * By default, this is only shown on iOS 18.
   */
  label?: string;
  /**
   * The `href` to use for the anchor tag on web
   */
  href?: string;
};

/**
 * @deprecated Use `NativeStackHeaderBackProps` instead.
 */
export type NativeStackHeaderLeftProps = NativeStackHeaderBackProps;

/**
 * @deprecated Use `NativeStackHeaderItemProps` instead.
 */
export type NativeStackHeaderRightProps = NativeStackHeaderItemProps;

/**
 * A button item in the header.
 */
export type NativeStackHeaderItemButton = SharedHeaderItem & {
  /**
   * Type of the item.
   */
  type: 'button';
  /**
   * Function to call when the item is pressed.
   */
  onPress: () => void;
  /**
   * Whether the item is in a selected state.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/isselected
   */
  selected?: boolean;
};

/**
 * An action item in a menu.
 */
export type NativeStackHeaderItemMenuAction = {
  type: 'action';
  /**
   * Label for the menu item.
   */
  label: string;
  /**
   * Icon for the menu item.
   */
  icon?: IconIOSSfSymbol;
  /**
   * Function to call when the menu item is pressed.
   */
  onPress: () => void;
  /**
   * The state of an action- or command-based menu item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/state
   */
  state?: 'on' | 'off' | 'mixed';
  /**
   * Whether to apply disabled style to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/disabled
   */
  disabled?: boolean;
  /**
   * Whether to apply destructive style to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/destructive
   */
  destructive?: boolean;
  /**
   * Whether to apply hidden style to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/hidden
   */
  hidden?: boolean;
  /**
   * Whether to keep the menu presented after firing the element’s action.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/keepsmenupresented
   */
  keepsMenuPresented?: boolean;
  /**
   * An elaborated title that explains the purpose of the action.
   *
   * On iOS, the system displays this title in the discoverability heads-up display (HUD).
   * If this is not set, the HUD displays the title property.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uiaction/discoverabilitytitle
   */
  discoverabilityLabel?: string;
};

/**
 * A submenu item that contains other menu items.
 */
export type NativeStackHeaderItemMenuSubmenu = {
  type: 'submenu';
  /**
   * Label for the submenu item.
   */
  label: string;
  /**
   * Icon for the submenu item.
   */
  icon?: IconIOSSfSymbol;
  /**
   * Array of menu items (actions or submenus).
   */
  items: NativeStackHeaderItemMenu['menu']['items'];
};

/**
 * An item that shows a menu when pressed.
 */
export type NativeStackHeaderItemMenu = SharedHeaderItem & {
  type: 'menu';
  /**
   * Whether the menu is a selection menu.
   * Tapping an item in a selection menu will add a checkmark to the selected item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/changesselectionasprimaryaction
   */
  changesSelectionAsPrimaryAction?: boolean;
  /**
   * Menu for the item.
   */
  menu: {
    /**
     * Optional title to show on top of the menu.
     */
    title?: string;
    /**
     * Array of menu items (actions or submenus).
     */
    items: (
      | NativeStackHeaderItemMenuAction
      | NativeStackHeaderItemMenuSubmenu
    )[];
  };
};

/**
 * An item to add spacing between other items in the header.
 */
export type NativeStackHeaderItemSpacing = {
  type: 'spacing';
  /**
   * The amount of spacing to add.
   */
  spacing: number;
};

/**
 * A custom item to display any React Element in the header.
 */
export type NativeStackHeaderItemCustom = {
  type: 'custom';
  /**
   * A React Element to display as the item.
   */
  element: React.ReactElement;
  /**
   * Whether the background this item may share with other items in the bar should be hidden.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground
   */
  hidesSharedBackground?: boolean;
};

/**
 * An item that can be displayed in the header.
 * It can be a button, a menu, spacing, or a custom element.
 *
 * On iOS 26, when showing items on the right side of the header,
 * if the items don't fit the available space, they will be collapsed into a menu automatically.
 * Items with `type: 'custom'` will not be included in this automatic collapsing behavior.
 */
export type NativeStackHeaderItem =
  | NativeStackHeaderItemButton
  | NativeStackHeaderItemMenu
  | NativeStackHeaderItemSpacing
  | NativeStackHeaderItemCustom;

type IconImage = {
  /**
   * - `image` - Use a local image as the icon.
   */
  type: 'image';
  /**
   * Image source to use as the icon.
   * e.g., `require('./path/to/image.png')`
   */
  source: ImageSourcePropType;
  /**
   * Whether to apply tint color to the icon.
   * Defaults to `true`.
   *
   * @platform ios
   */
  tinted?: boolean;
};

type IconIOSSfSymbol = {
  /**
   * - `sfSymbol` - Use an SF Symbol as the icon on iOS.
   */
  type: 'sfSymbol';
  /**
   * Name of the SF Symbol to use as the icon.
   *
   * @platform ios
   */
  name: SFSymbol;
};

type IconIOS = IconIOSSfSymbol | IconImage;

type SharedHeaderItem = {
  /**
   * Label of the item.
   */
  label: string;
  /**
   * Style for the item label.
   */
  labelStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: ColorValue;
  };
  /**
   * Icon for the item
   */
  icon?: IconIOS;
  /**
   * The variant of the item.
   * "prominent" only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/style-swift.property
   */
  variant?: 'plain' | 'done' | 'prominent';
  /**
   * The tint color to apply to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/tintcolor
   */
  tintColor?: ColorValue;
  /**
   * Whether the item is in a disabled state.
   */
  disabled?: boolean;
  /**
   * The width of the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/width
   */
  width?: number;
  /**
   * Whether the background this item may share with other items in the bar should be hidden.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground
   */
  hidesSharedBackground?: boolean;
  /**
   * Whether this item can share a background with other items.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/sharesbackground
   */
  sharesBackground?: boolean;
  /**
   * An identifier used to match items across transitions.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/identifier
   */
  identifier?: string;
  /**
   * A badge to display on a item.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitembadge
   */
  badge?: {
    /**
     * The text to display in the badge.
     */
    value: number | string;
    /**
     * Style of the badge.
     */
    style?: {
      color?: ColorValue;
      backgroundColor?: ColorValue;
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: string;
    };
  };
  /**
   * Accessibility label for the item.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint for the item.
   */
  accessibilityHint?: string;
};
