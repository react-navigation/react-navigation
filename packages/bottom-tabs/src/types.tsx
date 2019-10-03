import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityStates,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  Descriptor,
  Route,
} from '@react-navigation/core';
import { TabNavigationState } from '@react-navigation/routers';

export type BottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: undefined;
  /**
   * Event which fires on long press on the tab in the tab bar.
   */
  tabLongPress: undefined;
};

export type Orientation = 'horizontal' | 'vertical';

export type LabelPosition = 'beside-icon' | 'below-icon';

export type BottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  BottomTabNavigationEventMap
>;

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
    ...args: ParamList[RouteName] extends (undefined | any)
      ? [RouteName] | [RouteName, ParamList[RouteName]]
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
  /**
   * Whether the screens should render the first time they are accessed. Defaults to `true`.
   * Set it to `false` if you want to render all screens on initial render.
   */
  lazy?: boolean;
  /**
   * Custom tab bar component.
   */
  tabBarComponent?: React.ComponentType<BottomTabBarProps>;
  /**
   * Options for the tab bar which will be passed as props to the tab bar component.
   */
  tabBarOptions?: BottomTabBarOptions;
};

export type BottomTabBarOptions = {
  /**
   * Whether the tab bar gets hidden when the keyboard is shown.
   */
  keyboardHidesTabBar?: boolean;
  /**
   * Color for the icon and label in the active tab.
   */
  activeTintColor?: string;
  /**
   * Color for the icon and label in the inactive tabs.
   */
  inactiveTintColor?: string;
  /**
   * Background olor for the active tab.
   */
  activeBackgroundColor?: string;
  /**
   * background color for the inactive tabs.
   */
  inactiveBackgroundColor?: string;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
  /**
   * Whether the tab label should be visible. Defaults to `true`.
   */
  showLabel?: boolean;
  /**
   * Whether the tab icon should be visible. Defaults to `true`.
   */
  showIcon?: boolean;
  /**
   * Style object for the tab label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the tab container.
   */
  tabStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the label is renderd below the icon or beside the icon.
   * When a function is passed, it receives the device orientation to render the label differently.
   * By default, in `vertical` orinetation, label is rendered below and in `horizontal` orientation, it's renderd beside.
   */
  labelPosition?:
    | LabelPosition
    | ((options: { deviceOrientation: Orientation }) => LabelPosition);
  /**
   * Whether the label position should adapt to the orientation.
   */
  adaptive?: boolean;
  /**
   * Style object for the tab bar container.
   */
  style?: StyleProp<ViewStyle>;
};

export type BottomTabBarProps = BottomTabBarOptions & {
  state: TabNavigationState;
  descriptors: BottomTabDescriptorMap;
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
  activeTintColor: string;
  inactiveTintColor: string;
};
