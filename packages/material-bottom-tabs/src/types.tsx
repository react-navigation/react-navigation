import type {
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  RouteProp,
  TabActionHelpers,
  TabNavigationState,
} from '@react-navigation/native';
import type { BottomNavigation } from 'react-native-paper';

export type MaterialBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
};

export type MaterialBottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  MaterialBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type MaterialBottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type MaterialBottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined
> = {
  navigation: MaterialBottomTabNavigationProp<
    ParamList,
    RouteName,
    NavigatorID
  >;
  route: RouteProp<ParamList, RouteName>;
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
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type MaterialBottomTabDescriptorMap = Record<
  string,
  MaterialBottomTabDescriptor
>;

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
