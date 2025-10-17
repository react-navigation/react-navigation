import type { HeaderOptions } from '@react-navigation/elements';
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
import type * as React from 'react';
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type {
  BottomTabsSystemItem,
  Icon,
  TabBarControllerMode,
} from 'react-native-screens';
import type { TabBarMinimizeBehavior } from 'react-native-screens/src/components/bottom-tabs/BottomTabs.types';

export type Layout = { width: number; height: number };

export type ExperimentalBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
};

export type ExperimentalBottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  ExperimentalBottomTabNavigationOptions,
  ExperimentalBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type ExperimentalBottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = {
  navigation: ExperimentalBottomTabNavigationProp<
    ParamList,
    RouteName,
    NavigatorID
  >;
  route: RouteProp<ParamList, RouteName>;
};

export type ExperimentalBottomTabOptionsArgs<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = ExperimentalBottomTabScreenProps<ParamList, RouteName, NavigatorID> & {
  theme: Theme;
};

export type ExperimentalBottomTabNavigationOptions = HeaderOptions & {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Uses iOS built-in tab bar items with standard iOS styling and localized titles.
   * If set to `search`, it's positioned next to the tab bar on iOS 26 and above.
   *
   * @platform ios
   */
  tabBarSystemItem?: BottomTabsSystemItem;

  /**
   * Title string of a tab displayed in the tab bar
   *
   * When undefined, scene title is used. Use `tabBarShowLabel` to hide the label.
   */
  tabBarLabel?: string;

  /**
   * Style object for the tab label.
   */
  tabBarLabelStyle?: Pick<
    TextStyle,
    'fontFamily' | 'fontSize' | 'fontWeight' | 'fontStyle'
  >;

  /**
   * Image to display as the icon for the tab.
   */
  tabBarIcon?: Icon;

  /**
   * Text to show in a badge on the tab icon.
   */
  tabBarBadge?: number | string;

  /**
   * Custom style for the tab bar badge.
   * You can specify a background color or text color here.
   * Only supported on Android.
   */
  tabBarBadgeStyle?: {
    backgroundColor?: ColorValue;
    color?: ColorValue;
  };

  /**
   * Color for the icon and label in the active tab.
   */
  tabBarActiveTintColor?: string;

  /**
   * Color for the icon and label in the inactive tabs.
   *
   * @platform android
   */
  tabBarInactiveTintColor?: string;

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
   * Whether this screens should render the first time it's accessed. Defaults to `true`.
   * Set it to `false` if you want to render the screen on initial render.
   */
  lazy?: boolean;

  /**
   * Function that given returns a React Element to display as a header.
   */
  header?: (props: ExperimentalBottomTabHeaderProps) => React.ReactNode;

  /**
   * Whether to show the header. Setting this to `false` hides the header.
   * Defaults to `true`.
   */
  headerShown?: boolean;

  /**
   * Whether any nested stack should be popped to top when navigating away from the tab.
   * Defaults to `false`.
   */
  popToTopOnBlur?: boolean;

  /**
   * Style object for the component wrapping the screen content.
   */
  sceneStyle?: StyleProp<ViewStyle>;

  /**
   * Specifies the display mode for the tab bar.
   *
   * Available starting from iOS 18.
   * Not supported on tvOS.
   *
   * The following values are currently supported:
   *
   * - `automatic` - the system sets the display mode based on the tab’s content
   * - `tabBar` - the system displays the content only as a tab bar
   * - `tabSidebar` - the tab bar is displayed as a sidebar
   *
   * See the official documentation for more details:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/mode|UITabBarController.Mode}
   *
   * @default Defaults to `automatic`.
   *
   * @platform ios
   * @supported iOS 18 or higher, not supported on tvOS
   */
  tabBarControllerMode?: TabBarControllerMode;
  /**
   * Specifies the minimize behavior for the tab bar.
   *
   * The following values are currently supported:
   *
   * - `automatic` - resolves to the system default minimize behavior
   * - `never` - the tab bar does not minimize
   * - `onScrollDown` - the tab bar minimizes when scrolling down and
   *   expands when scrolling back up
   * - `onScrollUp` - the tab bar minimizes when scrolling up and expands
   *   when scrolling back down
   *
   * The supported values correspond to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/minimizebehavior|UITabBarController.MinimizeBehavior}
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;
  /**
   * Specifies the background color of the active indicator.
   *
   * @platform android
   */
  tabBarItemActiveIndicatorColor?: ColorValue;
  /**
   * Specifies if the active indicator should be used. Defaults to `true`.
   *
   * @platform android
   */
  tabBarItemActiveIndicatorEnabled?: boolean;
  /**
   * Specifies the color of each tab bar item's ripple effect.
   *
   * @platform android
   */
  tabBarItemRippleColor?: ColorValue;
};

export type ExperimentalBottomTabDescriptor = Descriptor<
  ExperimentalBottomTabNavigationOptions,
  ExperimentalBottomTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type ExperimentalBottomTabDescriptorMap = Record<
  string,
  ExperimentalBottomTabDescriptor
>;

export type ExperimentalBottomTabNavigationConfig = {};

export type ExperimentalBottomTabHeaderProps = {
  /**
   * Options for the current screen.
   */
  options: ExperimentalBottomTabNavigationOptions;
  /**
   * Route object for the current screen.
   */
  route: RouteProp<ParamListBase>;
  /**
   * Navigation prop for the header.
   */
  navigation: ExperimentalBottomTabNavigationProp<ParamListBase>;
};

export type ExperimentalBottomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: ExperimentalBottomTabDescriptorMap;
  navigation: NavigationHelpers<
    ParamListBase,
    ExperimentalBottomTabNavigationEventMap
  >;
  insets: EdgeInsets;
};

export type ExperimentalBottomTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  TabNavigationState<ParamListBase>,
  ExperimentalBottomTabNavigationOptions,
  ExperimentalBottomTabNavigationEventMap,
  ExperimentalBottomTabNavigationProp<ParamListBase>
> &
  TabRouterOptions &
  ExperimentalBottomTabNavigationConfig;
