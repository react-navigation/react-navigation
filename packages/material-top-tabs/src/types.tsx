import { StyleProp, ViewStyle } from 'react-native';
import { TabBar, SceneRendererProps, TabView } from 'react-native-tab-view';
import {
  ParamListBase,
  Descriptor,
  NavigationHelpers,
  Route,
  NavigationProp,
} from '@navigation-ex/core';
import { TabNavigationState } from '@navigation-ex/routers';

export type MaterialTopTabNavigationEventMap = {
  tabPress: {
    defaultPrevented: boolean;
    preventDefault(): void;
  };
  tabLongPress: undefined;
  swipeStart: undefined;
  swipeEnd: undefined;
};

export type MaterialTopTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap
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

export type MaterialTopTabNavigationOptions = {
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
    | ((props: { focused: boolean; tintColor: string }) => React.ReactNode);

  /**
   * React Element or a function that given { focused: boolean, tintColor: string } returns a React.Node, to display in the tab bar.
   */
  tabBarIcon?:
    | React.ReactNode
    | ((props: { focused: boolean; tintColor: string }) => React.ReactNode);

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
};

export type MaterialTopTabDescriptor = Descriptor<
  ParamListBase,
  string,
  TabNavigationState,
  MaterialTopTabNavigationOptions
>;

export type MaterialTopTabDescriptorMap = {
  [key: string]: MaterialTopTabDescriptor;
};

export type MaterialTopTabNavigationConfig = Partial<
  Omit<
    React.ComponentProps<typeof TabView>,
    | 'navigationState'
    | 'onIndexChange'
    | 'onSwipeStart'
    | 'onSwipeEnd'
    | 'renderScene'
    | 'renderTabBar'
    | 'renderLazyPlaceholder'
  >
> & {
  lazyPlaceholderComponent?: React.ComponentType<{ route: Route<string> }>;
  tabBarComponent?: React.ComponentType<MaterialTopTabBarProps>;
  tabBarOptions?: MaterialTopTabBarOptions;
  tabBarPosition?: 'top' | 'bottom';
};

export type MaterialTopTabBarOptions = Partial<
  Omit<
    React.ComponentProps<typeof TabBar>,
    | 'navigationState'
    | 'activeColor'
    | 'inactiveColor'
    | 'renderLabel'
    | 'renderIcon'
    | 'getLabelText'
    | 'getAccessibilityLabel'
    | 'getTestID'
    | 'onTabPress'
    | 'onTabLongPress'
    | keyof SceneRendererProps
  >
> & {
  activeTintColor?: string;
  inactiveTintColor?: string;
  iconStyle?: StyleProp<ViewStyle>;
  showLabel?: boolean;
  showIcon?: boolean;
  upperCaseLabel?: boolean;
  allowFontScaling?: boolean;
};

export type MaterialTopTabBarProps = MaterialTopTabBarOptions &
  SceneRendererProps & {
    state: TabNavigationState;
    navigation: NavigationHelpers<ParamListBase>;
    descriptors: MaterialTopTabDescriptorMap;
    getLabelText: (props: {
      route: Route<string>;
    }) =>
      | ((scene: { focused: boolean; tintColor: string }) => React.ReactNode)
      | React.ReactNode;
    getAccessibilityLabel: (props: {
      route: Route<string>;
    }) => string | undefined;
    getTestID: (props: { route: Route<string> }) => string | undefined;
    onTabPress: (props: {
      route: Route<string>;
      preventDefault(): void;
    }) => void;
    onTabLongPress: (props: { route: Route<string> }) => void;
    tabBarPosition: 'top' | 'bottom';
  };
