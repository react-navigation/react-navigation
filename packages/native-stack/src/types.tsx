import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import type {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  StackNavigationState,
  StackRouterOptions,
  StackActionHelpers,
  RouteProp,
} from '@react-navigation/native';
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
};

export type NativeStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState<ParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
> &
  StackActionHelpers<ParamList>;

export type NativeStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {
  navigation: NativeStackNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type NativeStackNavigationHelpers = NavigationHelpers<
  ParamListBase,
  NativeStackNavigationEventMap
>;

// We want it to be an empty object because navigator does not have any additional props
export type NativeStackNavigationConfig = {};

export type NativeStackNavigationOptions = {
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
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
   * Use `headerBackTitleVisible: false` to hide it.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitle?: string;
  /**
   * Whether the back button title should be visible or not.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitleVisible?: boolean;
  /**
   * Style object for header back title. Supported properties:
   * - fontFamily
   * - fontSize
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
  };
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
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitle?: boolean;
  /**
   * Whether drop shadow of header is visible when a large title is shown.
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
  headerTranslucent?: boolean;
  /**
   * Blur effect for the translucent header.
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
   * Function which returns a React Element to display on the left side of the header.
   * This replaces the back button. See `headerBackVisible` to show the back button along side left element.
   */
  headerLeft?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to scene `title`.
   *
   * It receives `tintColor` and`children` in the options object as an argument.
   * The title string is passed in `children`.
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
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   */
  headerTitleStyle?: StyleProp<{
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  }>;
  /**
   * Whether there should be additional top inset to account for translucent status bar.
   * If you don't have a translucent status bar, you can disable this by passing `false`
   *
   * Only supported on Android. Insets are always applied on iOS because the
   * header cannot be opaque.
   *
   * @platform android
   */
  headerTopInsetEnabled?: boolean;
  /**
   * Options to render a native search bar on iOS.
   *
   * @platform ios
   */
  headerSearchBar?: SearchBarProps;
  /**
   * Sets the status bar animation (similar to the `StatusBar` component).
   * Requires setting `View controller-based status bar appearance -> YES` in your Info.plist file.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  statusBarAnimation?: ScreenStackHeaderConfigProps['statusBarAnimation'];
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
   * Requires setting `View controller-based status bar appearance -> YES` in your Info.plist file.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  statusBarStyle?: ScreenStackHeaderConfigProps['statusBarStyle'];
  /**
   * Style object for the scene content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   * Only supported on iOS.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * The type of animation to use when this screen replaces another screen. Defaults to `pop`.
   *
   * Supported values:
   * - "push": the new screen will perform push animation.
   * - "pop": the new screen will perform pop animation.
   */
  animationTypeForReplace?: ScreenProps['replaceAnimation'];
  /**
   * How the screen should animate when pushed or popped.
   *
   * Supported values:
   * - "default": use the platform default animation
   * - "fade": fade screen in or out
   * - "flip": flip the screen, requires stackPresentation: "modal" (iOS only)
   * - "slide_from_right": slide in the new screen from right (Android only, uses default animation on iOS)
   * - "slide_from_left": slide in the new screen from left (Android only, uses default animation on iOS)
   * - "none": don't animate the screen
   */
  animation?: ScreenProps['stackAnimation'];
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
   */
  presentation?: Exclude<ScreenProps['stackPresentation'], 'push'> | 'card';
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
   */
  orientation?: ScreenStackHeaderConfigProps['screenOrientation'];
};

export type NativeStackNavigatorProps = DefaultNavigatorOptions<NativeStackNavigationOptions> &
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
