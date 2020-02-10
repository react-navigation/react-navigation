import { BottomNavigation } from 'react-native-paper';
import {
  ParamListBase,
  Descriptor,
  NavigationProp,
  NavigationHelpers,
  TabNavigationState,
} from '@react-navigation/native';

export type MaterialBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
};

export type MaterialBottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  MaterialBottomTabNavigationEventMap
>;

export type MaterialBottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap
> & {
  /**
   * Jump to an existing tab.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends Extract<keyof ParamList, string>>(
    ...args: ParamList[RouteName] extends undefined | any
      ? [RouteName] | [RouteName, ParamList[RouteName]]
      : [RouteName, ParamList[RouteName]]
  ): void;
};

export type MaterialBottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Color of the tab bar when this tab is active. Only used when `shifting` is `true`.
   */
  tabBarColor?: string;

  /**
   * Label text of the tab displayed in the navigation bar. When undefined, scene title is used.
   */
  tabBarLabel?: string;

  /**
   * String referring to an icon in the `MaterialCommunityIcons` set, or a
   * function that given { focused: boolean, color: string } returns a React.Node to display in the navigation bar.
   */
  tabBarIcon?:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);

  /**
   * Badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
   */
  tabBarBadge?: boolean | number | string;

  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   */
  tabBarAccessibilityLabel?: string;

  /**
   * ID to locate this tab button in tests.
   */
  tabBarTestID?: string;
};

export type MaterialBottomTabDescriptor = Descriptor<
  ParamListBase,
  string,
  TabNavigationState,
  MaterialBottomTabNavigationOptions
>;

export type MaterialBottomTabDescriptorMap = {
  [key: string]: MaterialBottomTabDescriptor;
};

export type MaterialBottomTabNavigationConfig = Partial<
  Omit<
    React.ComponentProps<typeof BottomNavigation>,
    | 'navigationState'
    | 'onIndexChange'
    | 'onTabPress'
    | 'renderScene'
    | 'renderLabel'
    | 'renderIcon'
    | 'getAccessibilityLabel'
    | 'getBadge'
    | 'getColor'
    | 'getLabelText'
    | 'getTestID'
  >
>;
