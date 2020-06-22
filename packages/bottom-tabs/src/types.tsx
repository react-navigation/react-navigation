import type * as React from 'react';
import type {
  Animated,
  TouchableWithoutFeedbackProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import type {
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  Descriptor,
  TabNavigationState,
  TabActionHelpers,
  RouteProp,
} from '@react-navigation/native';

export type BottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
  /**
   * Event which fires on long press on the tab in the tab bar.
   */
  tabLongPress: { data: undefined };
};

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
> &
  TabActionHelpers<ParamList>;

export type BottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {
  navigation: BottomTabNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type BottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Title string of a tab displayed in the tab bar
   * or a function that given { focused: boolean, color: string } returns a React.Node to display in tab bar.
   * When undefined, scene title is used. To hide, see tabBarOptions.showLabel in the previous section.
   */
  tabBarLabel?:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);

  /**
   * A function that given { focused: boolean, color: string } returns a React.Node to display in the tab bar.
   */
  tabBarIcon?: (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;

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
   * Function which returns a React element to render as the tab bar button.
   * Renders `TouchableWithoutFeedback` by default.
   */
  tabBarButton?: (props: BottomTabBarButtonProps) => React.ReactNode;

  /**
   * Whether this screen should be unmounted when navigating away from it.
   * Defaults to `false`.
   */
  unmountOnBlur?: boolean;
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

export type BottomTabNavigationConfig<T = BottomTabBarOptions> = {
  /**
   * Whether the screens should render the first time they are accessed. Defaults to `true`.
   * Set it to `false` if you want to render all screens on initial render.
   */
  lazy?: boolean;
  /**
   * Function that returns a React element to display as the tab bar.
   */
  tabBar?: (props: BottomTabBarProps<T>) => React.ReactNode;
  /**
   * Options for the tab bar which will be passed as props to the tab bar component.
   */
  tabBarOptions?: T;
};

export type BottomTabBarOptions = {
  /**
   * Whether the tab bar gets hidden when the keyboard is shown. Defaults to `false`.
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
   * Background color for the active tab.
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
   * Style object for the tab label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the tab icon.
   */
  iconStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the tab container.
   */
  tabStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the label is rendered below the icon or beside the icon.
   * By default, in `vertical` orientation, label is rendered below and in `horizontal` orientation, it's rendered beside.
   */
  labelPosition?: LabelPosition;
  /**
   * Whether the label position should adapt to the orientation.
   */
  adaptive?: boolean;
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
   * Style object for the tab bar container.
   */
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

export type BottomTabBarProps<T = BottomTabBarOptions> = T & {
  state: TabNavigationState;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

export type BottomTabBarButtonProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress'
> & {
  to?: string;
  children: React.ReactNode;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
};
