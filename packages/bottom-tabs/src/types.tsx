import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityStates,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  Descriptor,
  Route,
} from '@navigation-ex/core';
import { TabNavigationState } from '@navigation-ex/routers';

export type BottomTabNavigationEventMap = {
  refocus: undefined;
  tabPress: undefined;
  tabLongPress: undefined;
};

export type Orientation = 'horizontal' | 'vertical';

export type LabelPosition = 'beside-icon' | 'below-icon';

export type BottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> & {
  /**
   * Jump to an existing tab.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends Extract<keyof ParamList, string>>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;
};

export type BottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Title string of a tab displayed in the tab bar or React Element
   * or a function that given { focused: boolean, tintColor: string } returns a React.Node, to display in tab bar.
   * When undefined, scene title is used. To hide, see tabBarOptions.showLabel in the previous section.
   */
  tabBarLabel?:
    | React.ReactNode
    | ((props: {
        focused: boolean;
        tintColor: string;
        horizontal: boolean;
      }) => React.ReactNode);

  /**
   * React Element or a function that given { focused: boolean, tintColor: string } returns a React.Node, to display in the tab bar.
   */
  tabBarIcon?:
    | React.ReactNode
    | ((props: {
        focused: boolean;
        tintColor: string;
        horizontal: boolean;
      }) => React.ReactNode);

  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * It's recommended to set this if you don't have a label for the tab.
   */
  tabBarAccessibilityLabel?: string;

  /**
   * ID to locate this tab button in tests.
   */
  tabBarTestID?: string;

  /**
   * Boolean indicating whether the tab bar is visible when this screen is active.
   */
  tabBarVisible?: boolean;

  /**
   * Buttton component to render for the tab items instead of the default `TouchableWithoutFeedback`
   */
  tabBarButtonComponent?: React.ComponentType<any>;
};

export type BottomTabDescriptor = Descriptor<
  ParamListBase,
  string,
  TabNavigationState,
  BottomTabNavigationOptions
>;

export type BottomTabDescriptorMap = {
  [key: string]: BottomTabDescriptor;
};

export type BottomTabNavigationConfig = {
  lazy?: boolean;
  tabBarComponent?: React.ComponentType<BottomTabBarProps>;
  tabBarOptions?: BottomTabBarOptions;
};

export type BottomTabBarOptions = {
  keyboardHidesTabBar?: boolean;
  activeTintColor?: string;
  inactiveTintColor?: string;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  allowFontScaling?: boolean;
  showLabel?: boolean;
  showIcon?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  labelPosition?:
    | LabelPosition
    | ((options: { deviceOrientation: Orientation }) => LabelPosition);
  adaptive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type BottomTabBarProps = BottomTabBarOptions & {
  state: TabNavigationState;
  navigation: NavigationHelpers<ParamListBase>;
  onTabPress: (props: { route: Route<string> }) => void;
  onTabLongPress: (props: { route: Route<string> }) => void;
  getAccessibilityLabel: (props: {
    route: Route<string>;
  }) => string | undefined;
  getAccessibilityRole: (props: {
    route: Route<string>;
  }) => AccessibilityRole | undefined;
  getAccessibilityStates: (props: {
    route: Route<string>;
    focused: boolean;
  }) => AccessibilityStates[];
  getButtonComponent: (props: {
    route: Route<string>;
  }) => React.ComponentType<any> | undefined;
  getLabelText: (props: {
    route: Route<string>;
  }) =>
    | ((scene: {
        focused: boolean;
        tintColor: string;
        orientation: 'horizontal' | 'vertical';
      }) => React.ReactNode | undefined)
    | React.ReactNode;
  getTestID: (props: { route: Route<string> }) => string | undefined;
  renderIcon: (props: {
    route: Route<string>;
    focused: boolean;
    tintColor: string;
    horizontal: boolean;
  }) => React.ReactNode;
  safeAreaInset?: React.ComponentProps<typeof SafeAreaView>['forceInset'];
};
