import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type {
  TabBar,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
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
>;

export type MaterialTopTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
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
   * When undefined, scene title is used. To hide, see tabBarOptions.showLabel in the previous section.
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
   * Options for the tab bar which will be passed as props to the tab bar component.
   */
  tabBarOptions?: MaterialTopTabBarOptions;
  /**
   * Position of the tab bar. Defaults to `top`.
   */
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
  /**
   * Color for the icon and label in the active tab.
   */
  activeTintColor?: string;
  /**
   * Color for the icon and label in the inactive tabs.
   */
  inactiveTintColor?: string;
  /**
   * Style object for the tab icon container.
   */
  iconStyle?: StyleProp<ViewStyle>;
  /**
   * Style object for the tab label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Whether the tab label should be visible. Defaults to `true`.
   */
  showLabel?: boolean;
  /**
   * Whether the tab icon should be visible. Defaults to `false`.
   */
  showIcon?: boolean;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
};

export type MaterialTopTabBarProps = MaterialTopTabBarOptions &
  SceneRendererProps & {
    state: TabNavigationState;
    navigation: NavigationHelpers<
      ParamListBase,
      MaterialTopTabNavigationEventMap
    >;
    descriptors: MaterialTopTabDescriptorMap;
  };
