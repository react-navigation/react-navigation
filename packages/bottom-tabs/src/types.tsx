import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Animated from 'react-native-reanimated';

export type Route = {
  key: string;
  routeName: string;
} & (NavigationState | undefined);

export type NavigationEventName =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur';

export type NavigationState = {
  key: string;
  index: number;
  routes: Route[];
  isTransitioning?: boolean;
  params?: { [key: string]: unknown };
};

export type NavigationProp<RouteName = string, Params = object> = {
  emit(eventName: string): void;
  navigate(routeName: RouteName): void;
  goBack(): void;
  goBack(key: string | null): void;
  addListener: (
    event: NavigationEventName,
    callback: () => void
  ) => { remove: () => void };
  isFocused(): boolean;
  state: NavigationState;
  setParams(params: Params): void;
  getParam(): Params;
  dispatch(action: { type: string }): void;
  dangerouslyGetParent(): NavigationProp | undefined;
};

export type Orientation = 'horizontal' | 'vertical';

export type LabelPosition = 'beside-icon' | 'below-icon';

export type BottomTabBarOptions = {
  keyboardHidesTabBar: boolean;
  activeTintColor?: string;
  inactiveTintColor?: string;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  allowFontScaling: boolean;
  showLabel: boolean;
  showIcon: boolean;
  labelStyle: StyleProp<TextStyle>;
  tabStyle: StyleProp<ViewStyle>;
  labelPosition?:
    | LabelPosition
    | ((options: { deviceOrientation: Orientation }) => LabelPosition);
  adaptive?: boolean;
  style: StyleProp<ViewStyle>;
};

export type BottomTabBarProps = BottomTabBarOptions & {
  navigation: NavigationProp;
  onTabPress: (props: { route: Route }) => void;
  onTabLongPress: (props: { route: Route }) => void;
  getAccessibilityLabel: (props: { route: Route }) => string | undefined;
  getAccessibilityRole: (props: {
    route: Route;
  }) => AccessibilityRole | undefined;
  getAccessibilityStates: (props: {
    route: Route;
    focused: boolean;
  }) => AccessibilityState[];
  getButtonComponent: (props: {
    route: Route;
  }) => React.ComponentType<any> | undefined;
  getLabelText: (props: {
    route: Route;
  }) =>
    | ((scene: {
        focused: boolean;
        tintColor?: string;
        orientation?: 'horizontal' | 'vertical';
      }) => string | undefined)
    | string
    | undefined;
  getTestID: (props: { route: Route }) => string | undefined;
  renderIcon: (props: {
    route: Route;
    focused: boolean;
    tintColor?: string;
    horizontal?: boolean;
  }) => React.ReactNode;
  dimensions: { width: number; height: number };
  isLandscape: boolean;
  safeAreaInset: React.ComponentProps<typeof SafeAreaView>['forceInset'];
};

export type MaterialTabBarOptions = {
  activeTintColor?: string;
  allowFontScaling?: boolean;
  bounces?: boolean;
  inactiveTintColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  scrollEnabled?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  upperCaseLabel?: boolean;
  tabStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export type MaterialTabBarProps = MaterialTabBarOptions & {
  layout: {
    width: number;
    height: number;
  };
  position: Animated.Node<number>;
  jumpTo: (key: string) => void;
  getLabelText: (scene: {
    route: Route;
  }) =>
    | ((scene: { focused: boolean; tintColor: string }) => string | undefined)
    | string
    | undefined;
  getAccessible?: (scene: { route: Route }) => boolean | undefined;
  getAccessibilityLabel: (scene: { route: Route }) => string | undefined;
  getTestID: (scene: { route: Route }) => string | undefined;
  renderIcon: (scene: {
    route: Route;
    focused: boolean;
    tintColor: string;
    horizontal?: boolean;
  }) => React.ReactNode;
  renderBadge?: (scene: { route: Route }) => React.ReactNode;
  onTabPress?: (scene: { route: Route }) => void;
  onTabLongPress?: (scene: { route: Route }) => void;
  tabBarPosition?: 'top' | 'bottom';
  screenProps: unknown;
  navigation: NavigationProp;
};

export type NavigationCommonTabOptions = {
  title?: string;
  tabBarLabel?: React.ReactNode;
  tabBarVisible?: boolean;
  tabBarAccessibilityLabel?: string;
  tabBarTestID?: string;
  tabBarIcon?:
    | React.ReactNode
    | ((props: {
        focused: boolean;
        tintColor?: string;
        horizontal?: boolean;
      }) => React.ReactNode);
  tabBarOnPress?: (props: {
    navigation: NavigationProp;
    defaultHandler: () => void;
  }) => void;
  tabBarOnLongPress?: (props: {
    navigation: NavigationProp;
    defaultHandler: () => void;
  }) => void;
};

export type NavigationBottomTabOptions = NavigationCommonTabOptions & {
  tabBarButtonComponent?: React.ComponentType<BottomTabBarProps>;
};

export type NavigationMaterialTabOptions = NavigationCommonTabOptions & {
  tabBarButtonComponent?: React.ComponentType<any>;
  swipeEnabled?: boolean | ((state: NavigationState) => boolean);
};

export type SceneDescriptor<Options extends NavigationCommonTabOptions> = {
  key: string;
  options: Options;
  navigation: NavigationProp;
  getComponent(): React.ComponentType;
};

export type Screen<
  Options extends NavigationCommonTabOptions
> = React.ComponentType<any> & {
  navigationOptions?: Options & {
    [key: string]: any;
  };
};
