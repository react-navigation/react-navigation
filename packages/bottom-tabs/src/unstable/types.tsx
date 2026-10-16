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
import type { ColorValue, ImageSourcePropType, TextStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type {
  TabBarItemLabelVisibilityMode,
  TabsScreenBlurEffect,
  TabsScreenSystemItem,
} from 'react-native-screens';
import type { SFSymbol } from 'sf-symbols-typescript';

import type { NativeHeaderOptions } from './NativeScreen/types';

export type Layout = { width: number; height: number };

export type NativeBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   *
   * Use the `tabBarSelectionEnabled: false` option to prevent the tab from being selected.
   * The `data` object contains the following properties:
   * - `origin`: always `native`.
   * - `behavior`: specifies how consumers should handle the tab press:
   *   - `scrollToTop`: whether the content should scroll to top.
   *   - `popToTop`: whether a nested stack should pop to top.
   */
  tabPress: {
    data: {
      origin: 'native';
      behavior: {
        scrollToTop: boolean;
        popToTop: boolean;
      };
    };
    canPreventDefault: false;
  };
  /**
   * Event which fires when a transition animation starts.
   */
  transitionStart: { data: { closing: boolean } };
  /**
   * Event which fires when a transition animation ends.
   */
  transitionEnd: { data: { closing: boolean } };
};

export type NativeBottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type NativeBottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = {
  navigation: NativeBottomTabNavigationProp<ParamList, RouteName, NavigatorID>;
  route: RouteProp<ParamList, RouteName>;
};

export type NativeBottomTabOptionsArgs<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NativeBottomTabScreenProps<ParamList, RouteName, NavigatorID> & {
  theme: Theme;
};

type IconImage = {
  /**
   * - `image` - Use a local image as the icon.
   */
  type: 'image';
  /**
   * Image source to use as the icon.
   * - Local image: `require('./path/to/image.png')`
   * - Drawable resource or xcasset: `{ uri: 'image_name' }`
   */
  source: ImageSourcePropType;
  /**
   * Whether to apply tint color to the image.
   * Disabling will keep the image's original colors.
   *
   * Defaults to `true`.
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
  /**
   * How to color the symbol.
   * - `monochrome`: Single color, using the tint color.
   * - `multicolor`: Uses the symbol's built-in multicolor scheme.
   *
   * Defaults to a single color for system symbols.
   *
   * @platform ios
   */
  renderingMode?: 'monochrome' | 'multicolor';
};

export type NativeBottomTabIcon = IconIOSSfSymbol | IconImage;

type TabBarLabelOffset = {
  horizontal?: number;
  vertical?: number;
};

export type NativeBottomTabNavigationOptions = NativeHeaderOptions & {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Uses iOS built-in tab bar items with standard iOS styling and localized titles.
   *
   * The `tabBarIcon` and `tabBarLabel` options override the icon and label from the system item.
   * If you want to keep the system behavior on iOS, but need to provide icon and label for other platforms,
   * Use `Platform.OS`  or `Platform.select`  to conditionally set `undefined` for `tabBarIcon` and `tabBarLabel` on iOS.
   *
   * If set to `search`, it may receive the prominent visual treatment on iOS 26.
   * See `tabBarRole` for more details on iOS 27 and above.
   *
   * @platform ios
   */
  tabBarSystemItem?: TabsScreenSystemItem;

  /**
   * The role of the tab within the system tab bar.
   *
   * Supported values:
   * - `prominent` - the tab gets the prominent visual treatment when supported
   * - `search` - the tab is used as the system search tab
   *
   * If set to `prominent`, the tab may receive special styling to make it stand out,
   * e.g., being positioned as a separate button next to the tab bar on iOS 27 and above.
   * Only one tab can have the `prominent` role at a time.
   * Supported on iOS 27 and above.
   *
   * If set to `search`, the tab gets the prominent visual treatment on iOS 26.
   * On iOS 27 and above, it gets the prominent styling only if `tabBarSearchAutoFocus` is enabled,
   * and no other tab has the `prominent` role.
   * The tab uses system search icon and label by default.
   * They can be overridden by `tabBarSystemItem`, `tabBarIcon`, and `tabBarLabel` options.
   * Adding or removing the `search` role after the tab is rendered is not supported.
   * Supported on iOS 26.1 and above.
   *
   * @platform ios
   */
  tabBarRole?: 'prominent' | 'search';

  /**
   * Whether the search field is automatically focused when the tab is selected.
   * Cancelling the search selects the previously selected tab.
   *
   * Only applies to tabs with `tabBarRole: 'search'`,
   * and requires `headerSearchBarOptions` to be set in a native stack nested in the tab.
   *
   * Defaults to `false`.
   *
   * Supported on iOS 26.1 and above.
   *
   * @platform ios
   */
  tabBarSearchAutoFocus?: boolean;

  /**
   * Whether the sidebar or the tab bar is preferred when only one of them can be displayed.
   *
   * Supported values:
   * - `auto` - uses the system default (tab bar)
   * - `sidebar` - the sidebar is displayed when it's available
   * - `tabBar` - the tab bar is displayed
   *
   * Requires `tabBarControllerMode` to be set to `tabSidebar`.
   *
   * The sidebar is only available when the horizontal size class is regular,
   * e.g. on iPad, or on larger iPhones in landscape.
   *
   * Defaults to `auto`.
   *
   * Supported on iOS 27 and above.
   * Not supported on tvOS.
   *
   * @platform ios
   */
  tabBarSidebarPreferredPlacement?: 'auto' | 'sidebar' | 'tabBar';

  /**
   * Whether showing and hiding the tab bar is animated.
   *
   * Defaults to `true`.
   *
   * Supported on iOS 18 and above.
   *
   * @platform ios
   */
  tabBarVisibilityAnimationEnabled?: boolean;

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
   * - `auto` - the system decides when to show or hide labels
   * - `selected` - labels are shown only for the selected tab
   * - `labeled` - labels are always shown
   * - `unlabeled` - labels are never shown
   *
   * Defaults to `auto`.
   *
   * @platform android
   */
  tabBarLabelVisibilityMode?: TabBarItemLabelVisibilityMode;

  /**
   * Style object for the tab label.
   */
  tabBarLabelStyle?: Pick<
    TextStyle,
    'fontFamily' | 'fontSize' | 'fontWeight' | 'fontStyle' | 'color'
  >;

  /**
   * Icon to display for the tab.
   *
   * Showing a different icon for focused tab is only supported on iOS.
   *
   * Overrides the icon provided by `tabBarSystemItem` on iOS.
   */
  tabBarIcon?:
    | NativeBottomTabIcon
    | ((props: { focused: boolean }) => NativeBottomTabIcon);

  /**
   * Size of the tab's icon.
   *
   * The largest size is used for the icon area in all tabs.
   * Icons smaller than the largest size are centered in this area.
   *
   * @platform android
   */
  tabBarIconSize?: number;

  /**
   * Text to show in a badge on the tab icon.
   */
  tabBarBadge?: number | string;

  /**
   * Custom style for the tab bar badge.
   * You can specify a background color or text color here.
   * - on iOS, you can only set the background color.
   * - on Android, you can set both background and text colors.
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
   *
   * @platform android
   */
  tabBarInactiveTintColor?: ColorValue;

  /**
   * Background color of the active indicator.
   *
   * @platform android
   */
  tabBarActiveIndicatorColor?: ColorValue;

  /**
   * Specifies if the active indicator should be used. Defaults to `true`.
   *
   * @platform android
   */
  tabBarActiveIndicatorEnabled?: boolean;

  /**
   * Width of the tab's active indicator.
   *
   * @platform android
   */
  tabBarActiveIndicatorWidth?: number;

  /**
   * Height of the tab's active indicator.
   *
   * @platform android
   */
  tabBarActiveIndicatorHeight?: number;

  /**
   * Color of tab bar item's ripple effect.
   *
   * @platform android
   */
  tabBarRippleColor?: ColorValue;

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
    /**
     * Whether the tab bar is visible.
     * Setting this to `'none'` hides the tab bar.
     */
    display?: 'flex' | 'none';
  };

  /**
   * Whether this tab can be selected.
   * When `false`, tapping on the tab in tab bar won't select the tab.
   * Custom behavior can be implemented by listening to `tabPress` event.
   *
   * Defaults to `true`.
   */
  tabBarSelectionEnabled?: boolean;

  /**
   * Behavior when pressing the tab in the tab bar while it's already focused.
   *
   * - `scrollToTop`: scroll the first scroll view in the screen to top
   * - `popToTop`: pop a nested stack to its first screen
   *
   * Both default to `true`.
   */
  tabBarRepeatedPressBehavior?:
    | {
        scrollToTop?: boolean;
        popToTop?: boolean;
      }
    | undefined;

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
  tabBarBlurEffect?: TabsScreenBlurEffect;

  /**
   * Display mode for the tab bar.
   *
   * Available starting from iOS 18.
   * Not supported on tvOS.
   *
   * The following values are currently supported:
   *
   * - `auto` - the system sets the display mode based on the tab’s content
   * - `tabBar` - the system displays the content only as a tab bar
   * - `tabSidebar` - the tab bar is displayed as a sidebar
   *
   * Defaults to `auto`.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/mode|UITabBarController.Mode}
   *
   * @platform ios
   */
  tabBarControllerMode?: 'auto' | 'tabBar' | 'tabSidebar';

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
  tabBarMinimizeBehavior?: 'auto' | 'none' | 'onScrollDown' | 'onScrollUp';

  /**
   * Offset applied to the tab label relative to its default position.
   * Positive `vertical` moves the label down, positive `horizontal` moves it right.
   *
   * The offset is specified separately for each tab bar item layout:
   *
   * - `stacked` - icon above the label, e.g. on iPhone in portrait
   * - `inline` - icon beside the label in regular width, e.g. on iPad
   * - `compactInline` - icon beside the label in compact width, e.g. on iPhone in landscape
   *
   * @platform ios
   */
  tabBarLabelPositionAdjustment?: {
    stacked?: TabBarLabelOffset;
    inline?: TabBarLabelOffset;
    compactInline?: TabBarLabelOffset;
  };

  /**
   * Function which returns a React element to display as an accessory view.
   *
   * Accepts a `placement` parameter which can be one of the following values:
   * - `regular` - at bottom of the screen, above the tab bar if tab bar is at the bottom
   * - `inline` - inline with the collapsed bottom tab bar (e.g. when minimized based on `tabBarMinimizeBehavior`)
   *
   * Note: the content is rendered twice for both placements, but only one is visible at a time based on the tab bar state.
   * Any shared state should be stored outside of the component to keep both versions in sync.
   *
   * Available starting from iOS 26.
   *
   * @platform ios
   */
  bottomAccessory?: (options: {
    placement: 'regular' | 'inline';
  }) => React.ReactNode;

  /**
   * Specifies whether `contentInsetAdjustmentBehavior` of the `ScrollView`
   * in the screen is automatically adjusted.
   *
   * `react-native`'s `ScrollView`s has `contentInsetAdjustmentBehavior` set to `never` by default.
   * To provide a better UX, it is overridden to `automatic` - so it respects the tab bar.
   * Otherwise, content can get hidden behind the tab bar as it's translucent on iOS 26+.
   *
   * Note that this only affects the `ScrollView` in first descendant chain of the screen,
   * i.e., first view of each nested view is checked until a `ScrollView` is found.
   *
   * To disable this behavior for specific screens, set this option to `false`.
   *
   * Only supported with `native` implementation.
   *
   * Defaults to `true`.
   *
   * @platform ios
   */
  overrideScrollViewContentInsetAdjustmentBehavior?: boolean;

  /**
   * Whether this screen should render only when first accessed.
   *
   * Defaults to `false`.
   *
   * Enabling may result in flicker as React renders
   * after native transition is already finished.
   */
  lazy?: boolean;

  /**
   * Whether any nested stack should be popped to top when navigating away from the tab.
   * Defaults to `false`.
   */
  popToTopOnBlur?: boolean;
};

export type NativeBottomTabDescriptor = Descriptor<
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type NativeBottomTabDescriptorMap = Record<
  string,
  NativeBottomTabDescriptor
>;

export type NativeBottomTabNavigationConfig = {};

export type NativeBottomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: NativeBottomTabDescriptorMap;
  navigation: NavigationHelpers<
    ParamListBase,
    NativeBottomTabNavigationEventMap
  >;
  insets: EdgeInsets;
};

export type NativeBottomTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationProp<ParamListBase>
> &
  TabRouterOptions &
  NativeBottomTabNavigationConfig;

export type NativeBottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  NativeBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type NativeBottomTabHeaderProps = {
  /**
   * Options for the current screen.
   */
  options: NativeBottomTabNavigationOptions;
  /**
   * Route object for the current screen.
   */
  route: RouteProp<ParamListBase>;
  /**
   * Navigation prop for the header.
   */
  navigation: NativeBottomTabNavigationProp<ParamListBase>;
};
