import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  NavigationParams,
  NavigationDescriptor,
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

export type ThemedColor =
  | string
  | {
      light: string;
      dark: string;
    };

export type Orientation = 'horizontal' | 'vertical';

export type LabelPosition = 'beside-icon' | 'below-icon';

interface BaseAnimation {
  useNativeDriver?: boolean;
}
interface TimingAnimation extends BaseAnimation {
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
}
interface SpringAnimation extends BaseAnimation {
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number | { x: number; y: number };
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
  stiffness?: number;
  mass?: number;
  damping?: number;
  delay?: number;
}
export type TimingKeyboardAnimationConfig = {
  animation: 'timing';
  config?: TimingAnimation;
};
export type SpringKeyboardAnimationConfig = {
  animation: 'spring';
  config?: SpringAnimation;
};
export type KeyboardAnimationConfig =
  | TimingKeyboardAnimationConfig
  | SpringKeyboardAnimationConfig;
export type KeyboardHidesTabBarAnimationConfig = {
  show: KeyboardAnimationConfig;
  hide: KeyboardAnimationConfig;
};

export type BottomTabBarOptions = {
  keyboardHidesTabBar?: boolean;
  keyboardHidesTabBarAnimationConfig?: Partial<
    KeyboardHidesTabBarAnimationConfig
  >;
  activeTintColor?: ThemedColor;
  inactiveTintColor?: ThemedColor;
  activeBackgroundColor?: ThemedColor;
  inactiveBackgroundColor?: ThemedColor;
  allowFontScaling?: boolean;
  showLabel?: boolean;
  showIcon?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  labelPosition?:
    | LabelPosition
    | ((options: { deviceOrientation: Orientation }) => LabelPosition);
  adaptive?: boolean;
  safeAreaInset?: {
    top?: 'always' | 'never' | number;
    right?: 'always' | 'never' | number;
    bottom?: 'always' | 'never' | number;
    left?: 'always' | 'never' | number;
  };
  style?: StyleProp<ViewStyle>;
};

export type ButtonComponentProps = {
  route: NavigationRoute;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityStates?: string[];
  style?: StyleProp<ViewStyle>;
};

export type BottomTabBarProps = BottomTabBarOptions & {
  navigation: NavigationTabProp;
  onTabPress: (props: { route: NavigationRoute }) => void;
  onTabLongPress: (props: { route: NavigationRoute }) => void;
  getAccessibilityLabel: (props: {
    route: NavigationRoute;
  }) => string | undefined;
  getAccessibilityRole: (props: {
    route: NavigationRoute;
  }) => AccessibilityRole | undefined;
  getAccessibilityStates: (props: {
    route: NavigationRoute;
    focused: boolean;
  }) => string[];
  getButtonComponent: (props: {
    route: NavigationRoute;
  }) => React.ComponentType<ButtonComponentProps> | undefined;
  getLabelText: (props: {
    route: NavigationRoute;
  }) =>
    | ((scene: {
        focused: boolean;
        tintColor?: string;
        orientation?: 'horizontal' | 'vertical';
      }) => string | undefined)
    | string
    | undefined;
  getTestID: (props: { route: NavigationRoute }) => string | undefined;
  renderIcon: (props: {
    route: NavigationRoute;
    focused: boolean;
    tintColor?: string;
    horizontal?: boolean;
  }) => React.ReactNode;
  dimensions: { width: number; height: number };
  isLandscape: boolean;
  jumpTo: (key: string) => void;
  screenProps: unknown;
  detachInactiveScreens?: boolean;
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
    route: NavigationRoute;
  }) =>
    | ((scene: { focused: boolean; tintColor: string }) => string | undefined)
    | string
    | undefined;
  getAccessible?: (scene: { route: NavigationRoute }) => boolean | undefined;
  getAccessibilityLabel: (scene: {
    route: NavigationRoute;
  }) => string | undefined;
  getTestID: (scene: { route: NavigationRoute }) => string | undefined;
  renderIcon: (scene: {
    route: NavigationRoute;
    focused: boolean;
    tintColor: string;
    horizontal?: boolean;
  }) => React.ReactNode;
  renderBadge?: (scene: { route: NavigationRoute }) => React.ReactNode;
  onTabPress?: (scene: { route: NavigationRoute }) => void;
  onTabLongPress?: (scene: { route: NavigationRoute }) => void;
  tabBarPosition?: 'top' | 'bottom';
  screenProps: unknown;
  navigation: NavigationTabProp;
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
    navigation: NavigationTabProp;
    defaultHandler: () => void;
  }) => void;
  tabBarOnLongPress?: (props: {
    navigation: NavigationTabProp;
    defaultHandler: () => void;
  }) => void;
};

export type NavigationBottomTabOptions = NavigationCommonTabOptions & {
  tabBarButtonComponent?: React.ComponentType<ButtonComponentProps>;
};

export type NavigationMaterialTabOptions = NavigationCommonTabOptions & {
  tabBarButtonComponent?: React.ComponentType<any>;
  swipeEnabled?: boolean | ((state: NavigationState) => boolean);
};

export type NavigationTabScreenProps<
  Params = NavigationParams,
  ScreenProps = unknown
> = {
  theme: SupportedThemes;
  navigation: NavigationTabProp<NavigationRoute, Params>;
  screenProps: ScreenProps;
};

export type NavigationMaterialTabScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<NavigationTabScreenProps<Params, ScreenProps>> & {
  navigationOptions?: NavigationScreenConfig<
    NavigationMaterialTabOptions,
    NavigationTabProp<NavigationRoute, Params>,
    ScreenProps
  >;
};

export type NavigationBottomTabScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<NavigationTabScreenProps<Params, ScreenProps>> & {
  navigationOptions?: NavigationScreenConfig<
    NavigationBottomTabOptions,
    NavigationTabProp<NavigationRoute, Params>,
    ScreenProps
  >;
};

export type SceneDescriptorMap = {
  [key: string]: NavigationDescriptor<
    NavigationParams,
    NavigationBottomTabOptions | NavigationMaterialTabOptions,
    NavigationTabProp
  >;
};
