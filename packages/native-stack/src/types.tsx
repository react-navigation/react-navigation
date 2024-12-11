import type {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  Route,
  RouteProp,
  StackActionHelpers,
  StackNavigationState,
  StackRouterOptions,
  Theme,
} from '@react-navigation/native';
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type {
  ScreenProps,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
} from 'react-native-screens';

export type NativeStackNavigationEventMap = {
  /**
   * Event which fires when a transition animation starts.
   */
  transitionStart: { data: { closing: boolean } };
  /**
   * Event which fires when a transition animation ends.
   */
  transitionEnd: { data: { closing: boolean } };
  /**
   * Event which fires when a swipe back is canceled on iOS.
   */
  gestureCancel: { data: undefined };
  /**
   * Event which fires when screen is in sheet presentation & it's detent changes.
   *
   * In payload it caries two fields:
   *
   * * `index` - current detent index in the `sheetAllowedDetents` array,
   * * `stable` - on Android `false` value means that the user is dragging the sheet or it is settling; on iOS it is always `true`.
   */
  sheetDetentChange: { data: { index: number; stable: boolean } };
};

export type NativeStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  StackNavigationState<ParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
> &
  StackActionHelpers<ParamList>;

export type NativeStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
  NavigatorID extends string | undefined = undefined,
> = {
  navigation: NativeStackNavigationProp<ParamList, RouteName, NavigatorID>;
  route: RouteProp<ParamList, RouteName>;
};

export type NativeStackOptionsArgs<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NativeStackScreenProps<ParamList, RouteName, NavigatorID> & {
  theme: Theme;
};

export type NativeStackNavigationHelpers = NavigationHelpers<
  ParamListBase,
  NativeStackNavigationEventMap
>;

// We want it to be an empty object because navigator does not have any additional props
export type NativeStackNavigationConfig = {};

export type NativeStackHeaderProps = {
  /**
   * Options for the back button.
   */
  back?: {
    /**
     * Title of the previous screen.
     */
    title: string | undefined;
    /**
     * The `href` to use for the anchor tag on web
     */
    href: string | undefined;
  };
  /**
   * Options for the current screen.
   */
  options: NativeStackNavigationOptions;
  /**
   * Route object for the current screen.
   */
  route: Route<string>;
  /**
   * Navigation prop for the header.
   */
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export type NativeStackHeaderRightProps = {
  /**
   * Tint color for the header.
   */
  tintColor?: string;
  /**
   * Whether it's possible to navigate back in stack.
   */
  canGoBack?: boolean;
};

export type NativeStackHeaderLeftProps = NativeStackHeaderRightProps & {
  /**
   * Label text for the button. Usually the title of the previous screen.
   * By default, this is only shown on iOS.
   */
  label?: string;
  /**
   * The `href` to use for the anchor tag on web
   */
  href?: string;
};

export type NativeStackNavigationOptions = {
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Function that given `HeaderProps` returns a React Element to display as a header.
   */
  header?: (props: NativeStackHeaderProps) => React.ReactNode;
  /**
   * Whether the back button is visible in the header.
   * You can use it to show a back button alongside `headerLeft` if you have specified it.
   *
   * This will have no effect on the first screen in the stack.
   */
  headerBackVisible?: boolean;
  /**
   * Title string used by the back button on iOS.
   * Defaults to the previous scene's title, or "Back" if there's not enough space.
   * Use `headerBackButtonDisplayMode: "minimal"` to hide it.
   *
   * Only supported on iOS and Web.
   *
   * @platform ios, web
   */
  headerBackTitle?: string;
  /**
   * Style object for header back title. Supported properties:
   * - fontFamily
   * - fontSize
   *
   * Only supported on iOS and Web.
   *
   * @platform ios, web
   */
  headerBackTitleStyle?: StyleProp<{
    fontFamily?: string;
    fontSize?: number;
  }>;
  /**
   * Image to display in the header as the icon in the back button.
   * Defaults to back icon image for the platform
   * - A chevron on iOS
   * - An arrow on Android
   */
  headerBackImageSource?: ImageSourcePropType;
  /**
   * Style of the header when a large title is shown.
   * The large title is shown if `headerLargeTitle` is `true` and
   * the edge of any scrollable content reaches the matching edge of the header.
   *
   * Supported properties:
   * - backgroundColor
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeStyle?: StyleProp<{
    backgroundColor?: string;
  }>;
  /**
   * Whether to enable header with large title which collapses to regular header on scroll.
   *
   * For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`.
   * If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.
   * You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitle?: boolean;
  /**
   * Whether drop shadow of header is visible when a large title is shown.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleShadowVisible?: boolean;
  /**
   * Style object for large title in header. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleStyle?: StyleProp<{
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  }>;
  /**
   * Whether to show the header. The header is shown by default.
   * Setting this to `false` hides the header.
   */
  headerShown?: boolean;
  /**
   * Style object for header. Supported properties:
   * - backgroundColor
   */
  headerStyle?: StyleProp<{
    backgroundColor?: string;
  }>;
  /**
   * Whether to hide the elevation shadow (Android) or the bottom border (iOS) on the header.
   */
  headerShadowVisible?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   * Setting this to `true` makes the header absolutely positioned,
   * and changes the background color to `transparent` unless specified in `headerStyle`.
   */
  headerTransparent?: boolean;
  /**
   * Blur effect for the translucent header.
   * The `headerTransparent` option needs to be set to `true` for this to work.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBlurEffect?: ScreenStackHeaderConfigProps['blurEffect'];
  /**
   * Tint color for the header. Changes the color of back button and title.
   */
  headerTintColor?: string;
  /**
   * Function which returns a React Element to render as the background of the header.
   * This is useful for using backgrounds such as an image, a gradient, blur effect etc.
   * You can use this with `headerTransparent` to render content underneath a translucent header.
   */
  headerBackground?: () => React.ReactNode;
  /**
   * Function which returns a React Element to display on the left side of the header.
   * This replaces the back button. See `headerBackVisible` to show the back button along side left element.
   */
  headerLeft?: (props: NativeStackHeaderLeftProps) => React.ReactNode;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: NativeStackHeaderRightProps) => React.ReactNode;
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to screen `title` or route name.
   *
   * When a function is passed, it receives `tintColor` and`children` in the options object as an argument.
   * The title string is passed in `children`.
   *
   * Note that if you render a custom element by passing a function, animations for the title won't work.
   */
  headerTitle?:
    | string
    | ((props: {
        /**
         * The title text of the header.
         */
        children: string;
        /**
         * Tint color for the header.
         */
        tintColor?: string;
      }) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `left` on platforms other than iOS.
   *
   * Not supported on iOS. It's always `center` on iOS and cannot be changed.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   */
  headerTitleStyle?: StyleProp<
    Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fontWeight'> & {
      color?: string;
    }
  >;
  /**
   * Options to render a native search bar.
   * You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc.
   * If you don't have a `ScrollView`, specify `headerTransparent: false`.
   */
  headerSearchBarOptions?: SearchBarProps;
  /**
   * Boolean indicating whether to show the menu on longPress of iOS >= 14 back button. Defaults to `true`.
   * Requires `react-native-screens` version >=3.3.0.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackButtonMenuEnabled?: boolean;
  /**
   * How the back button displays icon and title.
   *
   * Supported values:
   * - "default" - Displays one of the following depending on the available space: previous screen's title, generic title (e.g. 'Back') or no title (only icon).
   * - "generic" – Displays one of the following depending on the available space: generic title (e.g. 'Back') or no title (only icon).
   * - "minimal" – Always displays only the icon without a title.
   *
   * The "generic" mode is not supported when:
   * - The iOS version is lower than 14
   * - Custom back title is set
   * - Custom back title style is set
   * - Back button menu is disabled
   *
   * In such cases, the "default" mode will be used instead.
   *
   * Defaults to "default" on iOS, and "minimal" on other platforms.
   *
   * Only supported on iOS and Web.
   *
   * @platform ios, web
   */
  headerBackButtonDisplayMode?: ScreenStackHeaderConfigProps['backButtonDisplayMode'];
  /**
   * Whether the home indicator should prefer to stay hidden on this screen. Defaults to `false`.
   *
   * @platform ios
   */
  autoHideHomeIndicator?: boolean;
  /**
   * Whether the keyboard should hide when swiping to the previous screen. Defaults to `false`.
   *
   * @platform ios
   */
  keyboardHandlingEnabled?: boolean;
  /**
   * Sets the navigation bar color. Defaults to initial navigation bar color.
   *
   * @platform android
   */
  navigationBarColor?: string;
  /**
   * Boolean indicating whether the content should be visible behind the navigation bar. Defaults to `false`.
   *
   * @platform android
   */
  navigationBarTranslucent?: boolean;
  /**
   * Sets the visibility of the navigation bar. Defaults to `false`.
   *
   * @platform android
   */
  navigationBarHidden?: boolean;
  /**
   * Sets the status bar animation (similar to the `StatusBar` component).
   * Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  statusBarAnimation?: ScreenProps['statusBarAnimation'];
  /**
   * Sets the status bar color (similar to the `StatusBar` component). Defaults to initial status bar color.
   *
   * @platform android
   */
  statusBarBackgroundColor?: string;
  /**
   * Whether the status bar should be hidden on this screen.
   * Requires setting `View controller-based status bar appearance -> YES` in your Info.plist file.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  statusBarHidden?: boolean;
  /**
   * Sets the status bar color (similar to the `StatusBar` component).
   * Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  statusBarStyle?: ScreenProps['statusBarStyle'];
  /**
   * Sets the translucency of the status bar. Defaults to `false`.
   *
   * @platform android
   */
  statusBarTranslucent?: boolean;
  /**
   * Sets the direction in which you should swipe to dismiss the screen.
   * When using `vertical` option, options `fullScreenGestureEnabled: true`, `animationMatchesGesture: true` and `animation: 'slide_from_bottom'` are set by default.
   *
   * Supported values:
   * - `vertical` – dismiss screen vertically
   * - `horizontal` – dismiss screen horizontally (default)
   *
   * @platform ios
   */
  gestureDirection?: ScreenProps['swipeDirection'];
  /**
   * Style object for the scene content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the gesture to dismiss should use animation provided to `animation` prop. Defaults to `false`.
   *
   * Doesn't affect the behavior of screens presented modally.
   *
   * @platform ios
   */
  animationMatchesGesture?: boolean;
  /**
   * Whether the gesture to dismiss should work on the whole screen. Using gesture to dismiss with this option results in the same
   * transition animation as `simple_push`. This behavior can be changed by setting `animationMatchesGesture` prop. Achieving the
   * default iOS animation isn't possible due to platform limitations. Defaults to `false`.
   *
   * Doesn't affect the behavior of screens presented modally.
   *
   * @platform ios
   */
  fullScreenGestureEnabled?: boolean;
  /**
   * Whether the full screen dismiss gesture has shadow under view during transition. The gesture uses custom transition and thus
   * doesn't have a shadow by default. When enabled, a custom shadow view is added during the transition which tries to mimic the
   * default iOS shadow. Defaults to `true`.
   *
   * This does not affect the behavior of transitions that don't use gestures, enabled by `fullScreenGestureEnabled` prop.
   *
   * @platform ios
   */
  fullScreenGestureShadowEnabled?: boolean;
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * Use it to restrict the distance from the edges of screen in which the gesture should be recognized. To be used alongside `fullScreenGestureEnabled`.
   *
   * @platform ios
   */
  gestureResponseDistance?: ScreenProps['gestureResponseDistance'];
  /**
   * The type of animation to use when this screen replaces another screen. Defaults to `pop`.
   *
   * Supported values:
   * - "push": the new screen will perform push animation.
   * - "pop": the new screen will perform pop animation.
   *
   * Only supported on iOS and Android.
   */
  animationTypeForReplace?: ScreenProps['replaceAnimation'];
  /**
   * How the screen should animate when pushed or popped.
   *
   * Supported values:
   * - "default": use the platform default animation
   * - "fade": fade screen in or out
   * - "fade_from_bottom" – performs a fade from bottom animation
   * - "flip": flip the screen, requires presentation: "modal" (iOS only)
   * - "simple_push": use the platform default animation, but without shadow and native header transition (iOS only)
   * - "slide_from_bottom": slide in the new screen from bottom
   * - "slide_from_right": slide in the new screen from right (Android only, uses default animation on iOS)
   * - "slide_from_left": slide in the new screen from left (Android only, uses default animation on iOS)
   * - "ios_from_right" - iOS like slide in animation. pushes in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "ios_from_left" - iOS like slide in animation. pushes in the new screen from left to right (Android only, resolves to default transition on iOS)
   * - "none": don't animate the screen
   *
   * Only supported on iOS and Android.
   */
  animation?: ScreenProps['stackAnimation'];
  /**
   * Changes the duration (in milliseconds) of `slide_from_bottom`, `fade_from_bottom`, `fade` and `simple_push` transitions on iOS. Defaults to `500`.
   * The duration of `default` and `flip` transitions isn't customizable.
   *
   * @platform ios
   */
  animationDuration?: number;
  /**
   * How should the screen be presented.
   *
   * Supported values:
   * - "card": the new screen will be pushed onto a stack, which means the default animation will be slide from the side on iOS, the animation on Android will vary depending on the OS version and theme.
   * - "modal": the new screen will be presented modally. this also allows for a nested stack to be rendered inside the screen.
   * - "transparentModal": the new screen will be presented modally, but in addition, the previous screen will stay so that the content below can still be seen if the screen has translucent background.
   * - "containedModal": will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
   * - "containedTransparentModal": will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
   * - "fullScreenModal": will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
   * - "formSheet": will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to "modal" on Android.
   *
   * Only supported on iOS and Android.
   */
  presentation?: Exclude<ScreenProps['stackPresentation'], 'push'> | 'card';
  /**
   * Describes heights where a sheet can rest.
   * Works only when `presentation` is set to `formSheet`.
   *
   * Heights should be described as fraction (a number from `[0, 1]` interval) of screen height / maximum detent height.
   * You can pass an array of ascending values each defining allowed sheet detent. iOS accepts any number of detents,
   * while **Android is limited to three**.
   *
   * There is also possibility to specify `fitToContents` literal, which intents to set the sheet height
   * to the height of its contents.
   *
   * Please note that the array **must** be sorted in ascending order. This invariant is verified only in developement mode,
   * where violation results in error.
   *
   * **Android is limited to up 3 values in the array** -- any surplus values, beside first three are ignored.
   *
   * Defaults to `[1.0]`.
   */
  sheetAllowedDetents?: number[] | 'fitToContents';
  /**
   * Integer value describing elevation of the sheet, impacting shadow on the top edge of the sheet.
   *
   * Not dynamic - changing it after the component is rendered won't have an effect.
   *
   * Defaults to `24`.
   *
   * @platform Android
   */
  sheetElevation?: number;
  /**
   * Whether the sheet should expand to larger detent when scrolling.
   * Works only when `presentation` is set to `formSheet`.
   * Defaults to `true`.
   *
   * @platform ios
   */
  sheetExpandsWhenScrolledToEdge?: boolean;
  /**
   * The corner radius that the sheet will try to render with.
   * Works only when `presentation` is set to `formSheet`.
   *
   * If set to non-negative value it will try to render sheet with provided radius, else it will apply system default.
   *
   * If left unset system default is used.
   */
  sheetCornerRadius?: number;
  /**
   * Index of the detent the sheet should expand to after being opened.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * If the specified index is out of bounds of `sheetAllowedDetents` array, in dev environment more error will be thrown,
   * in production the value will be reset to default value.
   *
   * Additionaly there is `last` value available, when set the sheet will expand initially to last (largest) detent.
   *
   * Defaults to `0` - which represents first detent in the detents array.
   */
  sheetInitialDetentIndex?: number | 'last';
  /**
   * Boolean indicating whether the sheet shows a grabber at the top.
   * Works only when `presentation` is set to `formSheet`.
   * Defaults to `false`.
   *
   * @platform ios
   */
  sheetGrabberVisible?: boolean;
  /**
   * The largest sheet detent for which a view underneath won't be dimmed.
   * Works only when `presentation` is set to `formSheet`.
   *
   * This prop can be set to an number, which indicates index of detent in `sheetAllowedDetents` array for which
   * there won't be a dimming view beneath the sheet.
   *
   * Additionaly there are following options available:
   *
   * * `none` - there will be dimming view for all detents levels,
   * * `last` - there won't be a dimming view for any detent level.
   *
   * Defaults to `none`, indicating that the dimming view should be always present.
   */
  sheetLargestUndimmedDetentIndex?: number | 'none' | 'last';
  /**
   * The display orientation to use for the screen.
   *
   * Supported values:
   * - "default" - resolves to "all" without "portrait_down" on iOS. On Android, this lets the system decide the best orientation.
   * - "all": all orientations are permitted.
   * - "portrait": portrait orientations are permitted.
   * - "portrait_up": right-side portrait orientation is permitted.
   * - "portrait_down": upside-down portrait orientation is permitted.
   * - "landscape": landscape orientations are permitted.
   * - "landscape_left": landscape-left orientation is permitted.
   * - "landscape_right": landscape-right orientation is permitted.
   *
   * Only supported on iOS and Android.
   */
  orientation?: ScreenProps['screenOrientation'];
  /**
   * Whether inactive screens should be suspended from re-rendering. Defaults to `false`.
   * Defaults to `true` when `enableFreeze()` is run at the top of the application.
   * Requires `react-native-screens` version >=3.16.0.
   *
   * Only supported on iOS and Android.
   */
  freezeOnBlur?: boolean;
  /**
   * Footer component that can be used alongside formSheet stack presentation style.
   *
   * This option is provided, because due to implementation details it might be problematic
   * to implement such layout with JS-only code.
   *
   * Please note that this prop is marked as unstable and might be subject of breaking changes,
   * including removal, in particular when we find solution that will make implementing it with JS
   * straightforward.
   *
   * @platform android
   */
  unstable_sheetFooter?: () => React.ReactNode;
};

export type NativeStackNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  NativeStackNavigationProp<ParamListBase>
> &
  StackRouterOptions &
  NativeStackNavigationConfig;

export type NativeStackDescriptor = Descriptor<
  NativeStackNavigationOptions,
  NativeStackNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type NativeStackDescriptorMap = {
  [key: string]: NativeStackDescriptor;
};
