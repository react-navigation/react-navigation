import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/core';
import {
  StackNavigationState,
  StackRouterOptions,
} from '@react-navigation/routers';

export type NativeStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState,
  NativeStackNavigationOptions,
  {}
> & {
  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends undefined | any
      ? [RouteName] | [RouteName, ParamList[RouteName]]
      : [RouteName, ParamList[RouteName]]
  ): void;

  /**
   * Pop a screen from the stack.
   */
  pop(count?: number): void;

  /**
   * Pop to the first route in the stack, dismissing all other screens.
   */
  popToTop(): void;
};

export type NativeStackNavigationHelpers = NavigationHelpers<ParamListBase, {}>;

export type NativeStackNavigationConfig = {};

export type NativeStackNavigationOptions = {
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * String to display in the header as title. Defaults to scene `title`.
   */
  headerTitle?: string;
  /**
   * Title to display in the back button.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitle?: string;
  /**
   * Whether the back button title should be visible or not. Defaults to `true`.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitleVisible?: boolean;
  /**
   * Whether to show the header.
   */
  headerShown?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerTranslucent?: boolean;
  /**
   * Boolean to set native property to prefer large title header (like in iOS setting).
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitle?: boolean;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: () => React.ReactNode;
  /**
   * Tint color for the header. Changes the color of back button and title.
   */
  headerTintColor?: string;
  /**
   * Boolean indicating whether to hide the back button in header.
   * Only supported on Android.
   *
   * @platform android
   */
  headerHideBackButton?: boolean;
  /**
   * Boolean indicating whether to hide the elevation shadow or the bottom border on the header.
   */
  headerHideShadow?: boolean;
  /**
   * Style object for header title. Supported properties:
   * - backgroundColor
   */
  headerStyle?: {
    backgroundColor?: string;
  };
  /**
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - color
   */
  headerTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
  };
  /**
   * Style object for header large title. Supported properties:
   * - fontFamily
   * - fontSize
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
  };
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
   * How should the screen be presented.
   */
  presentation?: 'modal' | 'transparentModal' | 'push';
  /**
   * How should the screen should be animated.
   * Only supported on Android.
   *
   * @platform android
   */
  animation?: 'default' | 'fade' | 'none';
};

export type NativeStackNavigatorProps = DefaultNavigatorOptions<
  NativeStackNavigationOptions
> &
  StackRouterOptions &
  NativeStackNavigationConfig;

export type NativeStackDescriptor = Descriptor<
  ParamListBase,
  string,
  StackNavigationState,
  NativeStackNavigationOptions
>;

export type NativeStackDescriptorMap = {
  [key: string]: NativeStackDescriptor;
};
