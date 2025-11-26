import type { PlatformPressable } from '@react-navigation/elements';
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
import type {
  Animated,
  ColorValue,
  GestureResponderEvent,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type {
  BottomTabsScreenBlurEffect,
  BottomTabsSystemItem,
  TabBarControllerMode,
  TabBarItemLabelVisibilityMode,
  TabBarMinimizeBehavior,
} from 'react-native-screens';
import type { SFSymbol } from 'sf-symbols-typescript';

import type { NativeHeaderOptions } from './views/NativeScreen/types';

export type Variant = 'uikit' | 'material';

export type BottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   *
   * Preventing default is only supported with `custom` implementation.
   */
  tabPress: { data: undefined; canPreventDefault: true };
  /**
   * Event which fires on long press on the tab in the tab bar.
   *
   * Only supported with `custom` implementation.
   */
  tabLongPress: { data: undefined };
  /**
   * Event which fires when a transition animation starts.
   */
  transitionStart: { data: undefined };
  /**
   * Event which fires when a transition animation ends.
   */
  transitionEnd: { data: undefined };
};

export type LabelPosition = 'beside-icon' | 'below-icon';

export type BottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  BottomTabNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type BottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState<ParamList>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  TabActionHelpers<ParamList>
>;

export type BottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = {
  navigation: BottomTabNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type BottomTabOptionsArgs<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = BottomTabScreenProps<ParamList, RouteName> & {
  theme: Theme;
};

export type TimingKeyboardAnimationConfig = {
  animation: 'timing';
  config?: Omit<
    Partial<Animated.TimingAnimationConfig>,
    'toValue' | 'useNativeDriver'
  >;
};

export type SpringKeyboardAnimationConfig = {
  animation: 'spring';
  config?: Omit<
    Partial<Animated.SpringAnimationConfig>,
    'toValue' | 'useNativeDriver'
  >;
};

export type TabBarVisibilityAnimationConfig =
  | TimingKeyboardAnimationConfig
  | SpringKeyboardAnimationConfig;

export type TabAnimationName = 'none' | 'fade' | 'shift';

type IconImage = {
  /**
   * - `image` - Use a local image as the icon.
   */
  type: 'image';
  /**
   * Image source to use as the icon.
   * e.g., `require('./path/to/image.png')`
   */
  source: ImageSourcePropType;
  /**
   * Whether to apply tint color to the icon.
   * Defaults to `true`.
   *
   * @platform ios
   */
  tinted?: boolean;
};

type IconIOSSfSymbol = {
  /**
   * - `sfSymbol` - Use an SF Symbol as the icon on iOS.
   */
  type: 'sfSymbol';
  /**
   * Name of the SF Symbol to use as the icon.
   *
   * @platform ios
   */
  name: SFSymbol;
};

type IconAndroidDrawable = {
  /**
   * - `drawableResource` - Use a drawable resource as the icon on Android.
   */
  type: 'drawableResource';
  /**
   * Name of the drawable resource to use as the icon.
   *
   * @platform android
   */
  name: string;
};

type IconIOS = IconIOSSfSymbol | IconImage;

type IconAndroid = IconAndroidDrawable | IconImage;

export type Icon = IconIOS | IconAndroid;

type BottomTabCustomOptions = {
  /**
   * How the screen should animate when switching tabs.
   *
   * Supported values:
   * - 'none': don't animate the screen (default)
   * - 'fade': cross-fade the screens.
   * - 'shift': shift the screens slightly shift to left/right.
   *
   * Only supported with `custom` implementation.
   */
  animation?: TabAnimationName;

  /**
   * Function which specifies interpolated styles for bottom-tab scenes.
   *
   * Only supported with `custom` implementation.
   */
  sceneStyleInterpolator?: BottomTabSceneStyleInterpolator;

  /**
   * Object which specifies the animation type (timing or spring) and their options (such as duration for timing).
   *
   * Only supported with `custom` implementation.
   */
  transitionSpec?: TransitionSpec;

  /**
   * Whether the label is shown below the icon or beside the icon.
   *
   * - `below-icon`: the label is shown below the icon (typical for iPhones)
   * - `beside-icon` the label is shown next to the icon (typical for iPad)
   *
   * By default, the position is chosen automatically based on device width.
   *
   * Only supported with `custom` implementation.
   */
  tabBarLabelPosition?: LabelPosition;

  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   *
   * Defaults to `true`.
   *
   * Only supported with `custom` implementation.
   */
  tabBarAllowFontScaling?: boolean;

  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * It's recommended to set this if you don't have a label for the tab.
   *
   * Only supported with `custom` implementation.
   */
  tabBarAccessibilityLabel?: string;

  /**
   * ID to locate this tab button in tests.
   *
   * Only supported with `custom` implementation.
   */
  tabBarButtonTestID?: string;

  /**
   * Style object for the tab item container.
   *
   * Only supported with `custom` implementation.
   */
  tabBarItemStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the tab icon.
   *
   * Only supported with `custom` implementation.
   */
  tabBarIconStyle?: StyleProp<TextStyle>;

  /**
   * Whether the tab bar gets hidden when the keyboard is shown.
   *
   * Defaults to `false`.
   *
   * Only supported with `custom` implementation.
   */
  tabBarHideOnKeyboard?: boolean;

  /**
   * Animation config for showing and hiding the tab bar when the keyboard is shown/hidden.
   *
   * Only supported with `custom` implementation.
   */
  tabBarVisibilityAnimationConfig?: {
    show?: TabBarVisibilityAnimationConfig;
    hide?: TabBarVisibilityAnimationConfig;
  };

  /**
   * Variant of the tab bar. Defaults to `uikit`.
   *
   * Only supported with `custom` implementation.
   */
  tabBarVariant?: Variant;

  /**
   * Style object for the tab bar container.
   *
   * Only supported with `custom` implementation.
   */
  tabBarStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;

  /**
   * Function which returns a React Element to use as background for the tab bar.
   * You could render an image, a gradient, blur view etc.
   *
   * When using `BlurView`, make sure to set `position: 'absolute'` in `tabBarStyle` as well.
   * You'd also need to use `useBottomTabBarHeight()` to add a bottom padding to your content.
   *
   * Only supported with `custom` implementation.
   */
  tabBarBackground?: () => React.ReactNode;

  /**
   * Position of the tab bar on the screen. Defaults to `bottom`.
   *
   * Only supported with `custom` implementation.
   */
  tabBarPosition?: 'bottom' | 'left' | 'right' | 'top';

  /**
   * Background color for the active tab.
   *
   * Only supported with `custom` implementation.
   */
  tabBarActiveBackgroundColor?: ColorValue;

  /**
   * Background color for the inactive tabs.
   *
   * Only supported with `custom` implementation.
   */
  tabBarInactiveBackgroundColor?: ColorValue;

  /**
   * Function which returns a React element to render as the tab bar button.
   * Renders `PlatformPressable` by default.
   *
   * Only supported with `custom` implementation.
   */
  tabBarButton?: (props: BottomTabBarButtonProps) => React.ReactNode;
};

type BottomTabNativeOptions = {
  /**
   * Uses iOS built-in tab bar items with standard iOS styling and localized titles.
   * If set to `search`, it's positioned next to the tab bar on iOS 26 and above.
   *
   * The `tabBarIcon` and `tabBarLabel` options will override the icon and label from the system item.
   * If you want to keep the system behavior on iOS, but need to provide icon and label for other platforms,
   * Use `Platform.OS`  or `Platform.select`  to conditionally set `undefined` for `tabBarIcon` and `tabBarLabel` on iOS.
   *
   * @platform ios
   */
  tabBarSystemItem?: BottomTabsSystemItem;

  /**
   * Blur effect applied to the tab bar when tab screen is selected.
   *
   * Works with backgroundColor's alpha < 1.
   *
   * Only supported on iOS 18 and lower.
   *
   * The following values are currently supported:
   *
   * - `none` - disables blur effect
   * - `systemDefault` - uses UIKit's default tab bar blur effect
   * - one of styles mapped from UIKit's UIBlurEffectStyle, e.g. `systemUltraThinMaterial`
   *
   * Defaults to `systemDefault`.
   *
   * Complete list of possible blur effect styles is available in the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style|UIBlurEffect.Style}
   *
   * @platform ios
   */
  tabBarBlurEffect?: BottomTabsScreenBlurEffect;

  /**
   * Minimize behavior for the tab bar.
   *
   * Available starting from iOS 26.
   *
   * The following values are currently supported:
   *
   * - `auto` - resolves to the system default minimize behavior
   * - `never` - the tab bar does not minimize
   * - `onScrollDown` - the tab bar minimizes when scrolling down and
   *   expands when scrolling back up
   * - `onScrollUp` - the tab bar minimizes when scrolling up and expands
   *   when scrolling back down
   *
   * Defaults to `auto`.
   *
   * The supported values correspond to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/minimizebehavior|UITabBarController.MinimizeBehavior}
   *
   * @platform ios
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;

  /**
   * Background color of the active indicator.
   *
   * Only supported with `native` implementation.
   *
   * @platform android
   */
  tabBarActiveIndicatorColor?: ColorValue;

  /**
   * Specifies if the active indicator should be used. Defaults to `true`.
   *
   * Only supported with `native` implementation.
   *
   * @platform android
   */
  tabBarActiveIndicatorEnabled?: boolean;
};

export type BottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Title string of the tab displayed in the tab bar
   *
   * Overrides the label provided by `tabBarSystemItem` on iOS.
   *
   * If not provided, or set to `undefined`:
   * - The system values are used if `tabBarSystemItem` is set on iOS.
   * - Otherwise, it falls back to the `title` or route name.
   */
  tabBarLabel?: string;

  /**
   * Label visibility mode for the tab bar items.
   *
   * The following values are currently supported:
   *
   * - `auto` - decided based on platform and implementation
   * - `labeled` - labels are always shown
   * - `unlabeled` - labels are never shown
   * - `selected` - labels shown only for selected tab (only supported on Android with `native` implementation)
   *
   * Defaults to `auto`.
   *
   * Supported on all platforms with `custom` implementation.
   * Only supported on Android with `native` implementation.
   */
  tabBarLabelVisibilityMode?: TabBarItemLabelVisibilityMode;

  /**
   * Style object for the tab label.
   */
  tabBarLabelStyle?: Pick<
    TextStyle,
    'fontFamily' | 'fontSize' | 'fontWeight' | 'fontStyle'
  >;

  /**
   * Icon to display for the tab.
   *
   * Overrides the icon provided by `tabBarSystemItem` on iOS with native implementation.
   *
   * Providing different icon for focused and unfocused states is supported:
   * - on all platforms with `custom` implementation
   * - on iOS with `native` implementation
   *
   * A React element is only supported with `custom` implementation.
   */
  tabBarIcon?:
    | Icon
    | ((props: {
        focused: boolean;
        color: ColorValue;
        size: number;
      }) => Icon | React.ReactNode);

  /**
   * Text to show in a badge on the tab icon.
   */
  tabBarBadge?: number | string;

  /**
   * Custom style for the tab bar badge.
   * You can specify a background color or text color here.
   *
   * @platform android
   */
  tabBarBadgeStyle?: {
    backgroundColor?: ColorValue;
    color?: ColorValue;
  };

  /**
   * Color for the icon and label in the active tab.
   */
  tabBarActiveTintColor?: ColorValue;

  /**
   * Color for the icon and label in the inactive tabs.
   */
  tabBarInactiveTintColor?: ColorValue;

  /**
   * Color of tab bar item's ripple effect.
   *
   * @platform android
   */
  tabBarRippleColor?: ColorValue;

  /**
   * Display mode for the tab bar.
   *
   * Supported values:
   * - `auto` - automatic based on the tab’s content
   * - `tabBar` - tab items are shown in a traditional tab bar
   * - `tabSidebar` - tab items are shown in a sidebar
   *
   * Supported on all platforms with `custom` implementation. By default:
   * - `tabBar` is positioned at the bottom
   * - `tabSidebar` is positioned on the left (LTR) or right (RTL)
   *
   * The `tabBarPosition` option can be used to override this in `custom` implementation.
   *
   * Supported on iOS 18 and above with `native` implementation.
   * Not supported on tvOS.
   */
  tabBarControllerMode?: TabBarControllerMode;

  /**
   * Style object for the tab bar container.
   */
  tabBarStyle?: {
    /**
     * Background color of the tab bar.
     *
     * Only supported on Android and iOS 18 and below.
     */
    backgroundColor?: ColorValue;
    /**
     * Shadow color of the tab bar.
     *
     * Only supported on iOS 18 and below.
     */
    shadowColor?: ColorValue;
  };

  /**
   * Whether this screens should render the first time it's accessed. Defaults to `true`.
   * Set it to `false` if you want to render the screen on initial render.
   */
  lazy?: boolean;

  /**
   * Whether inactive screens should be suspended from re-rendering. Defaults to `false`.
   * Defaults to `true` when `enableFreeze()` is run at the top of the application.
   * Requires `react-native-screens` version >=3.16.0.
   *
   * Only supported on iOS and Android.
   */
  freezeOnBlur?: boolean; // TODO

  /**
   * Whether any nested stack should be popped to top when navigating away from the tab.
   * Defaults to `false`.
   */
  popToTopOnBlur?: boolean; // TODO: handle natively

  /**
   * Style object for the component wrapping the screen content.
   */
  sceneStyle?: StyleProp<ViewStyle>;
} & NativeHeaderOptions &
  BottomTabNativeOptions &
  BottomTabCustomOptions;

export type BottomTabDescriptor = Descriptor<
  BottomTabNavigationOptions,
  BottomTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type BottomTabDescriptorMap = Record<string, BottomTabDescriptor>;

export type BottomTabSceneInterpolationProps = {
  /**
   * Values for the current screen.
   */
  current: {
    /**
     * Animated value for the current screen:
     * - -1 if the index is lower than active tab,
     * - 0 if they're active,
     * - 1 if the index is higher than active tab
     */
    progress: Animated.Value;
  };
};

export type BottomTabSceneInterpolatedStyle = {
  /**
   * Interpolated style for the view representing the scene containing screen content.
   */
  sceneStyle: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

export type BottomTabSceneStyleInterpolator = (
  props: BottomTabSceneInterpolationProps
) => BottomTabSceneInterpolatedStyle;

export type TransitionSpec =
  | {
      animation: 'timing';
      config: Omit<
        Animated.TimingAnimationConfig,
        'toValue' | keyof Animated.AnimationConfig
      >;
    }
  | {
      animation: 'spring';
      config: Omit<
        Animated.SpringAnimationConfig,
        'toValue' | keyof Animated.AnimationConfig
      >;
    };

export type BottomTabTransitionPreset = {
  /**
   * Whether transition animations should be enabled when switching tabs.
   */
  animationEnabled?: boolean;

  /**
   * Function which specifies interpolated styles for bottom-tab scenes.
   */
  sceneStyleInterpolator?: BottomTabSceneStyleInterpolator;

  /**
   * Object which specifies the animation type (timing or spring) and their options (such as duration for timing).
   */
  transitionSpec?: TransitionSpec;
};

export type BottomTabNavigationConfig = {
  /**
   * The implementation to use for rendering the bottom tabs.
   *
   * - `native`: uses native platform bottom tabs on Android and iOS.
   * - `custom`: uses a custom JavaScript implementation for all platforms.
   *
   * Some feature may not be available depending on the implementation used.
   *
   * Defaults to `native` on Android and iOS.
   *
   * On other platforms, it's always `custom` and this option has no effect.
   */
  implementation?: 'native' | 'custom';

  /**
   * Function that returns a React element to display as the tab bar.
   */
  tabBar?: (props: BottomTabBarProps) => React.ReactNode;

  /**
   * Whether inactive screens should be detached from the view hierarchy to save memory.
   *
   * Defaults to `true`.
   *
   * Only supported with `custom` implementation.
   */
  detachInactiveScreens?: boolean;
};

export type BottomTabHeaderProps = {
  /**
   * Options for the current screen.
   */
  options: BottomTabNavigationOptions;
  /**
   * Route object for the current screen.
   */
  route: RouteProp<ParamListBase>;
  /**
   * Navigation prop for the header.
   */
  navigation: BottomTabNavigationProp<ParamListBase>;
};

export type BottomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

export type BottomTabBarButtonProps = Omit<
  React.ComponentProps<typeof PlatformPressable>,
  'style'
> & {
  href?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
};

export type BottomTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  BottomTabNavigationProp<ParamListBase>
> &
  TabRouterOptions &
  BottomTabNavigationConfig;
