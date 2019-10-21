import { StyleProp, ViewStyle } from 'react-native';
import {
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  NavigationParams,
  NavigationScreenConfig,
  SupportedThemes,
} from 'react-navigation';

export type NavigationTabState = NavigationState;

export type NavigationTabProp<
  State = NavigationRoute,
  Params = NavigationParams
> = NavigationScreenProp<State, Params> & {
  jumpTo(routeName: string, key?: string): void;
};

export type NavigationMaterialBottomTabOptions = {
  title?: string;
  tabBarLabel?: React.ReactNode;
  tabBarBadge?: boolean | number | string;
  tabBarVisible?: boolean;
  tabBarAccessibilityLabel?: string;
  tabBarTestID?: string;
  tabBarColor?: string;
  tabBarIcon?:
    | React.ReactNode
    | ((props: {
        focused: boolean;
        tintColor?: string;
        horizontal?: boolean;
      }) => React.ReactNode);
  tabBarOnPress?: (props: {
    navigation: NavigationTabProp;
    defaultHandler: () => void;
  }) => void;
};

export type NavigationMaterialBottomTabConfig = {
  /**
   * Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label.
   * By default, this is `true` when you have more than 3 tabs.
   */
  shifting?: boolean;
  /**
   * Whether to show labels in tabs. When `false`, only icons will be displayed.
   */
  labeled?: boolean;
  /**
   * Custom color for icon and label in the active tab.
   */
  activeColor?: string;
  activeColorLight?: string;
  activeColorDark?: string;
  /**
   * Custom color for icon and label in the inactive tab.
   */
  inactiveColor?: string;
  inactiveColorLight?: string;
  inactiveColorDark?: string;
  /**
   * Whether the bottom navigation bar is hidden when keyboard is shown.
   * On Android, this works best when [`windowSoftInputMode`](https://developer.android.com/guide/topics/manifest/activity-element#wsoft) is set to `adjustResize`.
   */
  keyboardHidesNavigationBar?: boolean;
  /**
   * Style for the bottom navigation bar.
   * You can set a bottom padding here if you have a translucent navigation bar on Android:
   *
   * ```js
   * barStyle={{ paddingBottom: 48 }}
   * ```
   */
  barStyle?: StyleProp<ViewStyle>;
  barStyleLight?: StyleProp<ViewStyle>;
  barStyleDark?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export type NavigationTabScreenProps<
  Params = NavigationParams,
  ScreenProps = unknown
> = {
  theme: SupportedThemes;
  navigation: NavigationTabProp<NavigationRoute, Params>;
  screenProps: ScreenProps;
};

export type NavigationMaterialBottomTabScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<NavigationTabScreenProps<Params, ScreenProps>> & {
  navigationOptions?: NavigationScreenConfig<
    NavigationMaterialBottomTabOptions,
    NavigationTabProp<NavigationRoute, Params>,
    ScreenProps
  >;
};
