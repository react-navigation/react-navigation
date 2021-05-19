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
   * Event which fires when the screen appears.
   */
  appear: { data: undefined };
  /**
   * Event which fires when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down).
   */
  dismiss: { data: undefined };
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

// We want it to be an empty object beacuse navigator does not have any additional config
export type NativeStackNavigationConfig = {};

export type NativeStackNavigationOptions = {
  /**
   * Image to display in the header as the back button.
   * Defaults to back icon image for the platform (a chevron on iOS and an arrow on Android).
   */
  backButtonImage?: ImageSourcePropType;
  /**
   * Whether to show the back button with custom left side of the header.
   */
  backButtonInCustomView?: boolean;
  /**
   * Style object for the scene content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the stack should be in rtl or ltr form.
   */
  direction?: 'rtl' | 'ltr';
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   * Only supported on iOS.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * Title to display in the back button.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitle?: string;
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
   * Whether the back button title should be visible or not. Defaults to `true`.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitleVisible?: boolean;
  /**
   * Function which returns a React Element to display in the center of the header.
   */
  headerCenter?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Boolean indicating whether to hide the back button in header.
   */
  headerHideBackButton?: boolean;
  /**
   * Boolean indicating whether to hide the elevation shadow or the bottom border on the header.
   */
  headerHideShadow?: boolean;
  /**
   * Controls the style of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar. Supported properties:
   * - backgroundColor
   *
   * @platform ios
   */
  headerLargeStyle?: {
    backgroundColor?: string;
  };
  /**
   * Boolean to set native property to prefer large title header (like in iOS setting).
   * For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`.
   * If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitle?: boolean;
  /**
   * Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
   */
  headerLargeTitleHideShadow?: boolean;
  /**
   * Style object for header large title. Supported properties:
   * - fontFamily
   * - fontSize
   * - color
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  };
  /**
   * Function which returns a React Element to display on the left side of the header.
   */
  headerLeft?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Whether to show the header.
   */
  headerShown?: boolean;
  /**
   * Style object for header title. Supported properties:
   * - backgroundColor
   * - blurEffect
   */
  headerStyle?: {
    backgroundColor?: string;
    blurEffect?: ScreenStackHeaderConfigProps['blurEffect'];
  };
  /**
   * Tint color for the header. Changes the color of back button and title.
   */
  headerTintColor?: string;
  /**
   * String to display in the header as title. Defaults to scene `title`.
   */
  headerTitle?: string;
  /**
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   */
  headerTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  };
  /**
   * A flag to that lets you opt out of insetting the header. You may want to
   * set this to `false` if you use an opaque status bar. Defaults to `true`.
   * Only supported on Android. Insets are always applied on iOS because the
   * header cannot be opaque.
   *
   * @platform android
   */
  headerTopInsetEnabled?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   */
  headerTranslucent?: boolean;
  /**
   * How should the screen replacing another screen animate. Defaults to `pop`.
   * The following values are currently supported:
   * - "push" – the new screen will perform push animation.
   * - "pop" – the new screen will perform pop animation.
   */
  replaceAnimation?: ScreenProps['replaceAnimation'];
  /**
   * In which orientation should the screen appear.
   * The following values are currently supported:
   * - "default" - resolves to "all" without "portrait_down" on iOS. On Android, this lets the system decide the best orientation.
   * - "all" – all orientations are permitted
   * - "portrait" – portrait orientations are permitted
   * - "portrait_up" – right-side portrait orientation is permitted
   * - "portrait_down" – upside-down portrait orientation is permitted
   * - "landscape" – landscape orientations are permitted
   * - "landscape_left" – landscape-left orientation is permitted
   * - "landscape_right" – landscape-right orientation is permitted
   */
  screenOrientation?: ScreenStackHeaderConfigProps['screenOrientation'];
  /**
   * Object in which you should pass props in order to render native iOS searchBar.
   *
   * @platform ios
   */
  searchBar?: SearchBarProps;
  /**
   * How the screen should appear/disappear when pushed or popped at the top of the stack.
   * The following values are currently supported:
   * - "default" – uses a platform default animation
   * - "fade" – fades screen in or out
   * - "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
   * - "slide_from_right" - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "slide_from_left" - slide in the new screen from left to right (Android only, resolves to default transition on iOS)
   * - "none" – the screen appears/dissapears without an animation
   */
  stackAnimation?: ScreenProps['stackAnimation'];
  /**
   * How should the screen be presented.
   * The following values are currently supported:
   * - "push" – the new screen will be pushed onto a stack which on iOS means that the default animation will be slide from the side, the animation on Android may vary depending on the OS version and theme.
   * - "modal" – the new screen will be presented modally. In addition this allow for a nested stack to be rendered inside such screens.
   * - "transparentModal" – the new screen will be presented modally but in addition the second to last screen will remain attached to the stack container such that if the top screen is non opaque the content below can still be seen. If "modal" is used instead the below screen will get unmounted as soon as the transition ends.
   * - "containedModal" – will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
   * - "containedTransparentModal" – will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
   * - "fullScreenModal" – will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
   * - "formSheet" – will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to "modal" on Android.
   */
  stackPresentation?: ScreenProps['stackPresentation'];
  /**
   * Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.
   *
   * @platform ios
   */
  statusBarAnimation?: ScreenStackHeaderConfigProps['statusBarAnimation'];
  /**
   * Whether the status bar should be hidden on this screen. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.
   *
   * @platform ios
   */
  statusBarHidden?: boolean;
  /** Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.
   *
   * @platform ios
   */
  statusBarStyle?: ScreenStackHeaderConfigProps['statusBarStyle'];
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
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
