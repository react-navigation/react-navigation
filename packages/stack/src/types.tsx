import {
  StyleProp,
  TextStyle,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  NavigationProp,
  ParamListBase,
  Descriptor,
  Route,
} from '@navigation-ex/core';
import { StackNavigationState } from '@navigation-ex/routers';

export type StackNavigationEventMap = {
  transitionStart: { closing: boolean };
  transitionEnd: { closing: boolean };
};

export type StackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState,
  StackNavigationOptions,
  StackNavigationEventMap
> & {
  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
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

export type Layout = { width: number; height: number };

export type GestureDirection = 'horizontal' | 'vertical';

export type HeaderMode = 'float' | 'screen' | 'none';

export type HeaderScene<T> = {
  route: T;
  descriptor: StackDescriptor;
  progress: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
    previous?: Animated.Node<number>;
  };
};

export type HeaderOptions = {
  headerTitle?: string | ((props: HeaderTitleProps) => React.ReactNode);
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  headerTintColor?: string;
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackTitle?: string;
  headerBackTitleStyle?: StyleProp<TextStyle>;
  headerBackTitleVisible?: boolean;
  headerTruncatedBackTitle?: string;
  headerLeft?: (props: HeaderBackButtonProps) => React.ReactNode;
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerBackImage?: HeaderBackButtonProps['backImage'];
  headerPressColorAndroid?: string;
  headerBackground?: () => React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  headerStatusBarHeight?: number;
  headerTransparent?: boolean;
};

export type HeaderProps = {
  mode: 'float' | 'screen';
  layout: Layout;
  scene: HeaderScene<Route<string>>;
  previous?: HeaderScene<Route<string>>;
  navigation: StackNavigationProp<ParamListBase>;
  styleInterpolator: HeaderStyleInterpolator;
};

export type StackDescriptor = Descriptor<
  ParamListBase,
  string,
  StackNavigationState,
  StackNavigationOptions
>;

export type StackDescriptorMap = {
  [key: string]: StackDescriptor;
};

export type TransitionCallbackProps = {
  closing: boolean;
};

export type StackNavigationOptions = HeaderOptions &
  Partial<TransitionPreset> & {
    title?: string;
    header?: null | ((props: HeaderProps) => React.ReactNode);
    cardShadowEnabled?: boolean;
    cardOverlayEnabled?: boolean;
    cardTransparent?: boolean;
    cardStyle?: StyleProp<ViewStyle>;
    animationEnabled?: boolean;
    gestureEnabled?: boolean;
    gestureResponseDistance?: {
      vertical?: number;
      horizontal?: number;
    };
  };

export type StackNavigationConfig = {
  mode?: 'card' | 'modal';
  headerMode?: HeaderMode;
  keyboardHandlingEnabled?: boolean;
};

export type HeaderBackButtonProps = {
  disabled?: boolean;
  onPress?: () => void;
  pressColorAndroid?: string;
  backImage?: (props: { tintColor: string }) => React.ReactNode;
  tintColor?: string;
  label?: string;
  truncatedLabel?: string;
  labelVisible?: boolean;
  labelStyle?: React.ComponentProps<typeof Animated.Text>['style'];
  allowFontScaling?: boolean;
  onLabelLayout?: (e: LayoutChangeEvent) => void;
  screenLayout?: Layout;
  titleLayout?: Layout;
  canGoBack?: boolean;
};

export type HeaderTitleProps = {
  onLayout: (e: LayoutChangeEvent) => void;
  allowFontScaling?: boolean;
  children?: string;
  style?: StyleProp<TextStyle>;
};

export type Screen = React.ComponentType<any> & {
  navigationOptions?: StackNavigationOptions & {
    [key: string]: any;
  };
};

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  restSpeedThreshold: number;
  restDisplacementThreshold: number;
  overshootClamping: boolean;
};

export type TimingConfig = {
  duration: number;
  easing: Animated.EasingFunction;
};

export type TransitionSpec =
  | { timing: 'spring'; config: SpringConfig }
  | { timing: 'timing'; config: TimingConfig };

export type CardInterpolationProps = {
  index: number;
  progress: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
  };
  closing: Animated.Node<0 | 1>;
  layouts: {
    screen: Layout;
  };
};

export type CardInterpolatedStyle = {
  containerStyle?: any;
  cardStyle?: any;
  overlayStyle?: any;
  shadowStyle?: any;
};

export type CardStyleInterpolator = (
  props: CardInterpolationProps
) => CardInterpolatedStyle;

export type HeaderInterpolationProps = {
  progress: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
  };
  layouts: {
    screen: Layout;
    title?: Layout;
    leftLabel?: Layout;
  };
};

export type HeaderInterpolatedStyle = {
  leftLabelStyle?: any;
  leftButtonStyle?: any;
  rightButtonStyle?: any;
  titleStyle?: any;
  backgroundStyle?: any;
};

export type HeaderStyleInterpolator = (
  props: HeaderInterpolationProps
) => HeaderInterpolatedStyle;

export type TransitionPreset = {
  gestureDirection: GestureDirection;
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  cardStyleInterpolator: CardStyleInterpolator;
  headerStyleInterpolator: HeaderStyleInterpolator;
};
