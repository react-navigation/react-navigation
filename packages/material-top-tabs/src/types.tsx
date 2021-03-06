import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { SceneRendererProps, TabView } from 'react-native-tab-view';
import type {
  ParamListBase,
  Descriptor,
  NavigationHelpers,
  Route,
  NavigationProp,
  TabNavigationState,
  TabActionHelpers,
  RouteProp,
} from '@react-navigation/native';

export type MaterialTopTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
  /**
   * Event which fires on long press on the tab in the tab bar.
   */
  tabLongPress: { data: undefined };
  /**
   * Event which fires when a swipe gesture starts, i.e. finger touches the screen.
   */
  swipeStart: { data: undefined };
  /**
   * Event which fires when a swipe gesture ends, i.e. finger leaves the screen.
   */
  swipeEnd: { data: undefined };
};

export type MaterialTopTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  MaterialTopTabNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type MaterialTopTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState<ParamList>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type MaterialTopTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {
  navigation: MaterialTopTabNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type MaterialTopTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Title string of a tab displayed in the tab bar
   * or a function that given { focused: boolean, color: string } returns a React.Node, to display in tab bar.
   *
   * When undefined, scene title is used. Use `tabBarShowLabel` to hide the label.
   */
  tabBarLabel?:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);

  /**
   * A function that given { focused: boolean, color: string } returns a React.Node to display in the tab bar.
   */
  tabBarIcon?: (props: { focused: boolean; color: string }) => React.ReactNode;

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
   * Color for the icon and label in the active tab.
   */
  tabBarActiveTintColor?: string;

  /**
   * Color for the icon and label in the inactive tabs.
   */
  tabBarInactiveTintColor?: string;

  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  tabBarPressColor?: string;

  /**
   * Opacity for pressed tab (iOS and Android < 5.0 only).
   */
  tabBarPressOpacity?: number;

  /**
   * Whether the tab label should be visible. Defaults to `true`.
   */
  tabBarShowLabel?: boolean;

  /**
   * Whether the tab icon should be visible. Defaults to `false`.
   */
  tabBarShowIcon?: boolean;

  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  tabBarAllowFontScaling?: boolean;

  /**
   * Boolean indicating whether the tab bar bounces when overscrolling.
   */
  tabBarBounces?: boolean;

  /**
   * Boolean indicating whether to make the tab bar scrollable.
   *
   * If you set this to `true`, you should also specify a width in `tabBarItemStyle` to improve the performance of initial render.
   */
  tabBarScrollEnabled?: boolean;

  /**
   * Style object for the tab icon container.
   */
  tabBarIconStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the tab label.
   */
  tabBarLabelStyle?: StyleProp<TextStyle>;

  /**
   * Style object for the individual tab items.
   */
  tabBarItemStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the tab bar indicator.
   */
  tabBarIndicatorStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the view containing the tab bar indicator.
   */
  tabBarIndicatorContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the view containing the tab items.
   */
  tabBarContentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the the tab bar.
   */
  tabBarStyle?: StyleProp<ViewStyle>;
};

export type MaterialTopTabDescriptor = Descriptor<
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase, string>
>;

export type MaterialTopTabDescriptorMap = Record<
  string,
  MaterialTopTabDescriptor
>;

export type MaterialTopTabNavigationConfig = Partial<
  Omit<
    React.ComponentProps<typeof TabView>,
    | 'navigationState'
    | 'onIndexChange'
    | 'onSwipeStart'
    | 'onSwipeEnd'
    | 'renderScene'
    | 'renderTabBar'
    | 'renderPager'
    | 'renderLazyPlaceholder'
  >
> & {
  /**
   * Function that returns a React element to use as the pager.
   * The pager handles swipe gestures and page switching.
   */
  pager?: React.ComponentProps<typeof TabView>['renderPager'];
  /**
   * Function that returns a React element to render for routes that haven't been rendered yet.
   * Receives an object containing the route as the prop.
   * The lazy prop also needs to be enabled.
   *
   * This view is usually only shown for a split second. Keep it lightweight.
   *
   * By default, this renders null.
   */
  lazyPlaceholder?: (props: { route: Route<string> }) => React.ReactNode;
  /**
   * Function that returns a React element to display as the tab bar.
   */
  tabBar?: (props: MaterialTopTabBarProps) => React.ReactNode;
  /**
   * Position of the tab bar. Defaults to `top`.
   */
  tabBarPosition?: 'top' | 'bottom';
};

export type MaterialTopTabBarProps = SceneRendererProps & {
  state: TabNavigationState<ParamListBase>;
  navigation: NavigationHelpers<
    ParamListBase,
    MaterialTopTabNavigationEventMap
  >;
  descriptors: MaterialTopTabDescriptorMap;
};
