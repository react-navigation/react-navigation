import type {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  RouteProp,
  TabActionHelpers,
  TabNavigationState,
  TabRouterOptions,
  Theme,
} from '@react-navigation/native';
import type { ColorValue, ImageSourcePropType, TextStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type {
  BottomTabsScreenBlurEffect,
  BottomTabsSystemItem,
  TabBarControllerMode,
  TabBarItemLabelVisibilityMode,
  TabBarMinimizeBehavior,
} from 'react-native-screens';
import type { SFSymbol } from 'sf-symbols-typescript';

import type { NativeHeaderOptions } from './NativeScreen/types';

export type Layout = { width: number; height: number };

export type NativeBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
  /**
   * Event which fires when a transition animation starts.
   */
  transitionStart: { data: { closing: boolean } };
  /**
   * Event which fires when a transition animation ends.
   */
  transitionEnd: { data: { closing: boolean } };
};

export type NativeBottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type NativeBottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = {
  navigation: NativeBottomTabNavigationProp<ParamList, RouteName, NavigatorID>;
  route: RouteProp<ParamList, RouteName>;
};

export type NativeBottomTabOptionsArgs<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NativeBottomTabScreenProps<ParamList, RouteName, NavigatorID> & {
  theme: Theme;
};

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

type IconAndroidDrawable = {
  /**
   * - `drawableResource` - Use a drawable resource as the icon on Android.
   */
  type: 'drawableResource';
  /**
   * Name of the drawable resource to use as the icon.
   *
   * @platform android
   */
  name: string;
};

type IconIOS = IconIOSSfSymbol | IconImage;

type IconAndroid = IconAndroidDrawable | IconImage;

export type Icon = IconIOS | IconAndroid;

export type NativeBottomTabNavigationOptions = NativeHeaderOptions & {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Uses iOS built-in tab bar items with standard iOS styling and localized titles.
   * If set to `search`, it's positioned next to the tab bar on iOS 26 and above.
   *
   * The `tabBarIcon` and `tabBarLabel` options will override the icon and label from the system item.
   * If you want to keep the system behavior on iOS, but need to provide icon and label for other platforms,
   * Use `Platform.OS`  or `Platform.select`  to conditionally set `undefined` for `tabBarIcon` and `tabBarLabel` on iOS.
   *
   * @platform ios
   */
  tabBarSystemItem?: BottomTabsSystemItem;

  /**
   * Title string of the tab displayed in the tab bar
   *
   * Overrides the label provided by `tabBarSystemItem` on iOS.
   *
   * If not provided, or set to `undefined`:
   * - The system values are used if `tabBarSystemItem` is set on iOS.
   * - Otherwise, it falls back to the `title` or route name.
   */
  tabBarLabel?: string;

  /**
   * Label visibility mode for the tab bar items.
   *
   * The following values are currently supported:
   *
   * - `auto` - the system decides when to show or hide labels
   * - `selected` - labels are shown only for the selected tab
   * - `labeled` - labels are always shown
   * - `unlabeled` - labels are never shown
   *
   * Defaults to `auto`.
   *
   * @platform android
   */
  tabBarLabelVisibilityMode?: TabBarItemLabelVisibilityMode;

  /**
   * Style object for the tab label.
   */
  tabBarLabelStyle?: Pick<
    TextStyle,
    'fontFamily' | 'fontSize' | 'fontWeight' | 'fontStyle'
  >;

  /**
   * Icon to display for the tab.
   *
   * Showing a different icon for focused tab is only supported on iOS.
   *
   * Overrides the icon provided by `tabBarSystemItem` on iOS.
   */
  tabBarIcon?: Icon | ((props: { focused: boolean }) => Icon);

  /**
   * Text to show in a badge on the tab icon.
   */
  tabBarBadge?: number | string;

  /**
   * Custom style for the tab bar badge.
   * You can specify a background color or text color here.
   *
   * @platform android
   */
  tabBarBadgeStyle?: {
    backgroundColor?: ColorValue;
    color?: ColorValue;
  };

  /**
   * Color for the icon and label in the active tab.
   */
  tabBarActiveTintColor?: ColorValue;

  /**
   * Color for the icon and label in the inactive tabs.
   *
   * @platform android
   */
  tabBarInactiveTintColor?: ColorValue;

  /**
   * Background color of the active indicator.
   *
   * @platform android
   */
  tabBarActiveIndicatorColor?: ColorValue;

  /**
   * Specifies if the active indicator should be used. Defaults to `true`.
   *
   * @platform android
   */
  tabBarActiveIndicatorEnabled?: boolean;

  /**
   * Color of tab bar item's ripple effect.
   *
   * @platform android
   */
  tabBarRippleColor?: ColorValue;

  /**
   * Style object for the tab bar container.
   */
  tabBarStyle?: {
    /**
     * Background color of the tab bar.
     *
     * Only supported on Android and iOS 18 and below.
     */
    backgroundColor?: ColorValue;
    /**
     * Shadow color of the tab bar.
     *
     * Only supported on iOS 18 and below.
     */
    shadowColor?: ColorValue;
  };

  /**
   * Blur effect applied to the tab bar when tab screen is selected.
   *
   * Works with backgroundColor's alpha < 1.
   *
   * Only supported on iOS 18 and lower.
   *
   * The following values are currently supported:
   *
   * - `none` - disables blur effect
   * - `systemDefault` - uses UIKit's default tab bar blur effect
   * - one of styles mapped from UIKit's UIBlurEffectStyle, e.g. `systemUltraThinMaterial`
   *
   * Defaults to `systemDefault`.
   *
   * Complete list of possible blur effect styles is available in the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style|UIBlurEffect.Style}
   *
   * @platform ios
   */
  tabBarBlurEffect?: BottomTabsScreenBlurEffect;

  /**
   * Display mode for the tab bar.
   *
   * Available starting from iOS 18.
   * Not supported on tvOS.
   *
   * The following values are currently supported:
   *
   * - `auto` - the system sets the display mode based on the tab’s content
   * - `tabBar` - the system displays the content only as a tab bar
   * - `tabSidebar` - the tab bar is displayed as a sidebar
   *
   * Defaults to `auto`.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/mode|UITabBarController.Mode}
   *
   * @platform ios
   */
  tabBarControllerMode?: TabBarControllerMode;

  /**
   * Minimize behavior for the tab bar.
   *
   * Available starting from iOS 26.
   *
   * The following values are currently supported:
   *
   * - `auto` - resolves to the system default minimize behavior
   * - `never` - the tab bar does not minimize
   * - `onScrollDown` - the tab bar minimizes when scrolling down and
   *   expands when scrolling back up
   * - `onScrollUp` - the tab bar minimizes when scrolling up and expands
   *   when scrolling back down
   *
   * Defaults to `auto`.
   *
   * The supported values correspond to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/minimizebehavior|UITabBarController.MinimizeBehavior}
   *
   * @platform ios
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;

  /**
   * Whether this screens should render the first time it's accessed. Defaults to `true`.
   * Set it to `false` if you want to render the screen on initial render.
   */
  lazy?: boolean;

  /**
   * Whether any nested stack should be popped to top when navigating away from the tab.
   * Defaults to `false`.
   */
  popToTopOnBlur?: boolean;
};

export type NativeBottomTabDescriptor = Descriptor<
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type NativeBottomTabDescriptorMap = Record<
  string,
  NativeBottomTabDescriptor
>;

export type NativeBottomTabNavigationConfig = {};

export type NativeBottomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: NativeBottomTabDescriptorMap;
  navigation: NavigationHelpers<
    ParamListBase,
    NativeBottomTabNavigationEventMap
  >;
  insets: EdgeInsets;
};

export type NativeBottomTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationProp<ParamListBase>
> &
  TabRouterOptions &
  NativeBottomTabNavigationConfig;

export type NativeBottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  NativeBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type NativeBottomTabHeaderProps = {
  /**
   * Options for the current screen.
   */
  options: NativeBottomTabNavigationOptions;
  /**
   * Route object for the current screen.
   */
  route: RouteProp<ParamListBase>;
  /**
   * Navigation prop for the header.
   */
  navigation: NativeBottomTabNavigationProp<ParamListBase>;
};
