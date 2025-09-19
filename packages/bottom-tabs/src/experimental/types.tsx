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
  // DONE
  title?: string;

  /**
   * Title string of a tab displayed in the tab bar
   * or a function that given { focused: boolean, color: string, position: 'below-icon' | 'beside-icon', children: string } returns a React.Node to display in tab bar.
   *
   * When undefined, scene title is used. Use `tabBarShowLabel` to hide the label.
   */
  // DONE
  tabBarLabel?: string;

  /**
   * Whether the tab label should be visible. Defaults to `true`.
   */
  // DONE
  tabBarShowLabel?: boolean;

  /**
   * Whether the label is shown below the icon or beside the icon.
   *
   * - `below-icon`: the label is shown below the icon (typical for iPhones)
   * - `beside-icon` the label is shown next to the icon (typical for iPad)
   *
   * By default, the position is chosen automatically based on device width.
   */
  // IMPOSSIBLE
  tabBarLabelPosition?: LabelPosition;

  /**
   * Style object for the tab label.
   */
  // TODO TEXT
  tabBarLabelStyle?: StyleProp<TextStyle>;

  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  // IMPOSSIBLE
  tabBarAllowFontScaling?: boolean;

  /**
   * Image to display as the icon for the tab.
   */
  // TODO
  tabBarIcon?: string;

  /**
   * Style object for the tab icon.
   */
  // IMPOSSIBLE
  // tabBarIconStyle?: StyleProp<TextStyle>;

  /**
   * Text to show in a badge on the tab icon.
   */
  // DONE
  tabBarBadge?: number | string;

  /**
   * Custom style for the tab bar badge.
   * You can specify a background color or text color here.
   */
  // DONE
  tabBarBadgeStyle?: {
    // android specific
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
   * Function which returns a React element to render as the tab bar button.
   * Renders `PlatformPressable` by default.
   */
  // IMPOSSIBLE
  // tabBarButton?: (
  //   props: any //ExperimentalBottomTabBarButtonProps
  // ) => React.ReactNode;

  /**
   * Color for the icon and label in the active tab.
   */
  // DONE
  tabBarActiveTintColor?: string;

  /**
   * Color for the icon and label in the inactive tabs.
   */
  // DONE
  tabBarInactiveTintColor?: string;

  /**
   * Background color for the active tab.
   */
  // IMPOSSIBLE
  // tabBarActiveBackgroundColor?: string;

  /**
   * Background color for the inactive tabs.
   */
  // IMPOSSIBLE
  // tabBarInactiveBackgroundColor?: string;

  /**
   * Style object for the tab item container.
   */
  // IMPOSSIBLE
  // tabBarItemStyle?: StyleProp<ViewStyle>;

  /**
   * Whether the tab bar gets hidden when the keyboard is shown. Defaults to `false`.
   */
  // IMPOSSIBLE
  // tabBarHideOnKeyboard?: boolean;

  /**
   * Animation config for showing and hiding the tab bar when the keyboard is shown/hidden.
   */
  // IMPOSSIBLE
  // tabBarVisibilityAnimationConfig?: {
  //   show?: TabBarVisibilityAnimationConfig;
  //   hide?: TabBarVisibilityAnimationConfig;
  // };

  /**
   * Variant of the tab bar. Defaults to `uikit`.
   */
  // IMPOSSIBLE
  // tabBarVariant?: any; //Variant;

  /**
   * Style object for the tab bar container.
   */
  // DONE
  tabBarStyle?: {
    backgroundColor?: ColorValue;
    shadowColor?: ColorValue;
    // width?: number | string;
  };

  /**
   * Function which returns a React Element to use as background for the tab bar.
   * You could render an image, a gradient, blur view etc.
   *
   * When using `BlurView`, make sure to set `position: 'absolute'` in `tabBarStyle` as well.
   * You'd also need to use `useBottomTabBarHeight()` to add a bottom padding to your content.
   */
  // IMPOSSIBLE
  // tabBarBackground?: () => React.ReactNode;

  /**
   * Position of the tab bar on the screen. Defaults to `bottom`.
   */
  // IMPOSSIBLE
  // tabBarPosition?: 'bottom' | 'left' | 'right' | 'top';

  /**
   * Whether this screens should render the first time it's accessed. Defaults to `true`.
   * Set it to `false` if you want to render the screen on initial render.
   */
  // NOT EXPECTED
  // lazy?: boolean;

  /**
   * Function that given returns a React Element to display as a header.
   */
  // DONE
  header?: (props: ExperimentalBottomTabHeaderProps) => React.ReactNode;

  /**
   * Whether to show the header. Setting this to `false` hides the header.
   * Defaults to `true`.
   */
  // DONE
  headerShown?: boolean;

  /**
   * Whether any nested stack should be popped to top when navigating away from the tab.
   * Defaults to `false`.
   */
  // DONE // TEST
  popToTopOnBlur?: boolean;

  /**
   * Whether inactive screens should be suspended from re-rendering. Defaults to `false`.
   * Defaults to `true` when `enableFreeze()` is run at the top of the application.
   * Requires `react-native-screens` version >=3.16.0.
   *
   * Only supported on iOS and Android.
   */
  // NOT EXPECTED
  // freezeOnBlur?: boolean;

  /**
   * Style object for the component wrapping the screen content.
   */
  // DONE
  sceneStyle?: StyleProp<ViewStyle>;

  /**
   * How the screen should animate when switching tabs.
   *
   * Supported values:
   * - 'none': don't animate the screen (default)
   * - 'fade': cross-fade the screens.
   * - 'shift': shift the screens slightly shift to left/right.
   */
  // IMPOSSIBLE
  // animation?: TabAnimationName;

  /**
   * Function which specifies interpolated styles for bottom-tab scenes.
   */
  // IMPOSSIBLE
  // sceneStyleInterpolator?: any; //ExperimentalBottomTabSceneStyleInterpolator;

  /**
   * Object which specifies the animation type (timing or spring) and their options (such as duration for timing).
   */
  // IMPOSSIBLE
  // transitionSpec?: any; //TransitionSpec;
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
