import type {
  NativeHeaderNavigationOptions,
  NativeStackHeaderProps,
} from '@react-navigation/elements';
import type {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  RouteProp,
  StackActionHelpers,
  StackNavigationState,
  StackRouterOptions,
  Theme,
} from '@react-navigation/native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ScreenProps, ScrollEdgeEffect } from 'react-native-screens';

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

export type NativeStackNavigationOptions = NativeHeaderNavigationOptions & {
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Function that given `HeaderProps` returns a React Element to display as a header.
   */
  header?: (
    props: NativeStackHeaderProps<
      NativeStackNavigationOptions,
      NativeStackNavigationProp<any>
    >
  ) => React.ReactNode;

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
   * Sets the visibility of the navigation bar. Defaults to `false`.
   *
   * @platform android
   */
  navigationBarHidden?: boolean;
  /**
   * Sets the status bar animation (similar to the `StatusBar` component).
   * On Android, setting either `fade` or `slide` will set the transition of status bar color. On iOS, this option applies to appereance animation of the status bar.
   * Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.
   *
   * Defaults to `fade` on iOS and `none` on Android.
   *
   * Only supported on Android and iOS.
   *
   * @platform android, ios
   */
  statusBarAnimation?: ScreenProps['statusBarAnimation'];
  /**
   * Whether the status bar should be hidden on this screen.
   * Requires setting `View controller-based status bar appearance -> YES` in your Info.plist file.
   *
   * Only supported on Android and iOS.
   *
   * @platform android, ios
   */
  statusBarHidden?: boolean;
  /**
   * Sets the status bar color (similar to the `StatusBar` component).
   * Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file.
   * `auto` and `inverted` are supported only on iOS. On Android, they will fallback to `light`.
   *
   * Defaults to `auto` on iOS and `light` on Android.
   *
   * Only supported on Android and iOS.
   *
   * @platform android, ios
   */
  statusBarStyle?: ScreenProps['statusBarStyle'];
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
   * Note that the array **must** be sorted in ascending order. This invariant is verified only in developement mode,
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
   * Configures the scroll edge effect for the _content ScrollView_ (the ScrollView that is present in first descendants chain of the Screen).
   * Depending on values set, it will blur the scrolling content below certain UI elements (Header Items, SearchBar)
   * for the specifed edge of the ScrollView.
   *
   * When set in nested containers, i.e. ScreenStack inside BottomTabs, or the other way around,
   * the ScrollView will use only the innermost one's config.
   *
   * @platform ios
   *
   * @supported iOS 26 or higher
   */
  scrollEdgeEffects?: {
    bottom?: ScrollEdgeEffect;
    left?: ScrollEdgeEffect;
    right?: ScrollEdgeEffect;
    top?: ScrollEdgeEffect;
  };
  /**
   * Footer component that can be used alongside formSheet stack presentation style.
   *
   * This option is provided, because due to implementation details it might be problematic
   * to implement such layout with JS-only code.
   *
   * Note that this prop is marked as unstable and might be subject of breaking changes,
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
