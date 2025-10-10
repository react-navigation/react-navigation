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

export type Layout = { width: number; height: number };

export type ExperimentalBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
};

export type LabelPosition = 'beside-icon' | 'below-icon';

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
   * Title string of a tab displayed in the tab bar
   * or a function that given { focused: boolean, color: string, position: 'below-icon' | 'beside-icon', children: string } returns a React.Node to display in tab bar.
   *
   * When undefined, scene title is used. Use `tabBarShowLabel` to hide the label.
   */
  tabBarLabel?: string;

  /**
   * Whether the tab label should be visible. Defaults to `true`.
   */
  tabBarShowLabel?: boolean;

  /**
   * Style object for the tab label.
   */
  tabBarLabelStyle?: StyleProp<TextStyle>;

  /**
   * Image to display as the icon for the tab.
   */
  // TODO
  tabBarIcon?: string;

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
    textColor?: ColorValue;
  };

  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * It's recommended to set this if you don't have a label for the tab.
   */
  // TODO
  tabBarAccessibilityLabel?: string;

  /**
   * ID to locate this tab button in tests.
   */
  // TODO
  tabBarButtonTestID?: string;

  /**
   * Color for the icon and label in the active tab.
   */
  tabBarActiveTintColor?: string;

  /**
   * Color for the icon and label in the inactive tabs.
   */
  tabBarInactiveTintColor?: string;

  /**
   * Style object for the tab bar container.
   */
  tabBarStyle?: {
    backgroundColor?: ColorValue;
    shadowColor?: ColorValue;
  };

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

export type ExperimentalBottomTabNavigationConfig = {
  /**
   * Function that returns a React element to display as the tab bar.
   */
  // TODO
  tabBar?: (props: ExperimentalBottomTabBarProps) => React.ReactNode;
  /**
   * Safe area insets for the tab bar. This is used to avoid elements like the navigation bar on Android and bottom safe area on iOS.
   * By default, the device's safe area insets are automatically detected. You can override the behavior with this option.
   */
  safeAreaInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /**
   * Whether inactive screens should be detached from the view hierarchy to save memory.
   * Make sure to call `enableScreens` from `react-native-screens` to make it work.
   * Defaults to `true` on Android.
   */
  // NOT EXPECTED
  detachInactiveScreens?: boolean;
};

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
