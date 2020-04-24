import * as React from 'react';
import {
  NavigationProp,
  ParamListBase,
  Descriptor,
  RouteProp,
  NavigationHelpers,
  StackNavigationState,
  StackActionHelpers,
} from '@react-navigation/native';

export type WebStackNavigationEventMap = {};

export type WebStackNavigationHelpers = NavigationHelpers<
  ParamListBase,
  WebStackNavigationEventMap
>;

export type WebStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState,
  WebStackNavigationOptions,
  WebStackNavigationEventMap
> &
  StackActionHelpers<ParamList>;

export type WebStackHeaderOptions = {
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to scene `title`.
   * It receives `allowFontScaling`, `onLayout`, `style` and `children` in the options object as an argument.
   * The title string is passed in `children`.
   */
  headerTitle?: string | ((props: WebStackHeaderTitleProps) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `center` on iOS and `left` on Android.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Style object for the title component.
   */
  headerTitleStyle?: React.CSSProperties;
  /**
   * Tint color for the header.
   */
  headerTintColor?: string;
  /**
   * Function which returns a React Element to display on the left side of the header.
   * It receives a number of arguments when rendered (`onPress`, `label`, `labelStyle` and more.
   */
  headerLeft?: (props: WebStackHeaderLeftButtonProps) => React.ReactNode;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Style object for the header. You can specify a custom background color here, for example.
   */
  headerStyle?: React.CSSProperties;
};

export type WebStackHeaderProps = {
  /**
   * Navigation prop for the header.
   */
  route: RouteProp<ParamListBase, string>;
  /**
   * Navigation prop for the header.
   */
  navigation: WebStackNavigationProp<ParamListBase>;
  /**
   * Descriptors for the header.
   */
  descriptor: WebStackDescriptor;
  /**
   * If header should display back button
   */
  canGoBack: boolean;
};

export type WebStackDescriptor = Descriptor<
  ParamListBase,
  string,
  StackNavigationState,
  WebStackNavigationOptions
>;

export type WebStackDescriptorMap = {
  [key: string]: WebStackDescriptor;
};

export type WebStackNavigationOptions = WebStackHeaderOptions & {
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Function that given `HeaderProps` returns a React Element to display as a header.
   */
  header?: (props: WebStackHeaderProps) => React.ReactNode;
  /**
   * Whether to show the header. The header is shown by default unless `headerMode` was set to `none`.
   * Setting this to `false` hides the header.
   */
  headerShown?: boolean;
  /**
   * Style object for the card in stack.
   * You can provide a custom background color to use instead of the default background here.
   *
   * You can also specify `{ backgroundColor: 'transparent' }` to make the previous screen visible underneath.
   * This is useful to implement things like modal dialogs..
   */
  cardStyle?: React.CSSProperties;
  /**
   * Whether transition animation should be enabled the screen.
   * If you set it to `false`, the screen won't animate when pushing or popping. Defaults to `true`.
   */
  animationEnabled?: boolean;
  /**
   * The type of animation to use when this screen replaces another screen. Defaults to `push`.
   * When `pop` is used, the `pop` animation is applied to the screen being replaced.
   */
  animationTypeForReplace?: 'push' | 'pop';
};

export type WebStackNavigationConfig = {};

export type WebStackHeaderLeftButtonProps = {
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Callback to call when the button is clicked.
   * By default, this triggers `goBack`.
   */
  onClick?: () => void;
  /**
   * Style object for the button
   */
  style?: React.CSSProperties;
  /**
   * Whether it's possible to navigate back in stack.
   */
  canGoBack?: boolean;
};

export type WebStackHeaderTitleProps = {
  /**
   * Tint color for the header.
   */
  tintColor?: string;
  /**
   * Content of the title element. Usually the title string.
   */
  children?: string;
  /**
   * Style object for the title element.
   */
  style?: React.CSSProperties;
};
