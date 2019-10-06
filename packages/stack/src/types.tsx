import {
  StyleProp,
  TextStyle,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { EdgeInsets } from 'react-native-safe-area-context';
import {
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  NavigationParams,
  NavigationNavigateAction,
  NavigationAction,
  NavigationEventCallback,
  NavigationEventSubscription,
  NavigationDescriptor,
  NavigationScreenConfig,
  SupportedThemes,
} from 'react-navigation';

export type NavigationStackEventName =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur';

export type NavigationStackState = NavigationState;

export type NavigationStackProp<
  State = NavigationRoute,
  Params = NavigationParams
> = NavigationScreenProp<State, Params> & {
  push: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction
  ) => boolean;
  replace: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction
  ) => boolean;
  reset: (actions: NavigationAction[], index: number) => boolean;
  pop: (n?: number, params?: { immediate?: boolean }) => boolean;
  popToTop: (params?: { immediate?: boolean }) => boolean;
  addListener: (
    event: NavigationStackEventName,
    callback: NavigationEventCallback
  ) => NavigationEventSubscription;
};

export type Layout = { width: number; height: number };

export type GestureDirection = 'horizontal' | 'vertical' | 'vertical-inverted';

export type HeaderMode = 'float' | 'screen' | 'none';

export type HeaderScene<T = NavigationRoute> = {
  route: T;
  descriptor: NavigationDescriptor<NavigationParams, NavigationStackOptions>;
  progress: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
    previous?: Animated.Node<number>;
  };
};

export type HeaderOptions = {
  headerTitle?:
    | React.ReactNode
    | ((props: HeaderTitleProps) => React.ReactNode);
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  headerTintColor?: string;
  headerLeftTintColor?: string;
  headerRightTintColor?: string;
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackTitle?: string;
  headerBackTitleStyle?: StyleProp<TextStyle>;
  headerBackTitleVisible?: boolean;
  headerTruncatedBackTitle?: string;
  headerLeft?:
    | React.ReactNode
    | ((props: HeaderBackButtonProps) => React.ReactNode);
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?:
    | React.ReactNode
    | ((props: { tintColor?: string }) => React.ReactNode);
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerBackImage?: HeaderBackButtonProps['backImage'];
  headerPressColorAndroid?: string;
  headerBackground?: React.ReactNode | (() => React.ReactNode);
  headerStyle?: StyleProp<ViewStyle>;
  headerTransparent?: boolean;
};

export type HeaderProps = {
  mode: 'float' | 'screen';
  layout: Layout;
  scene: HeaderScene;
  previous?: HeaderScene;
  navigation: NavigationStackProp;
  styleInterpolator: HeaderStyleInterpolator;
};

export type TransitionCallbackProps = {
  closing: boolean;
};

export type NavigationStackOptions = HeaderOptions &
  Partial<TransitionPreset> & {
    title?: string;
    header?: React.ReactNode | ((props: HeaderProps) => React.ReactNode);
    headerShown?: boolean;
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
    onTransitionStart?: (props: TransitionCallbackProps) => void;
    onTransitionEnd?: (props: TransitionCallbackProps) => void;
    gestureVelocityImpact?: number;
  };

export type NavigationStackConfig = {
  mode?: 'card' | 'modal';
  headerMode?: HeaderMode;
  disableKeyboardHandling?: boolean;
};

export type NavigationStackScreenProps<
  Params = NavigationParams,
  ScreenProps = unknown
> = {
  theme: SupportedThemes;
  navigation: NavigationStackProp<NavigationRoute, Params>;
  screenProps: ScreenProps;
};

export type NavigationStackScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<NavigationStackScreenProps<Params, ScreenProps>> & {
  navigationOptions?: NavigationScreenConfig<
    NavigationStackOptions,
    NavigationStackProp<NavigationRoute, Params>,
    ScreenProps
  >;
};

export type SceneDescriptorMap = {
  [key: string]:
    | NavigationDescriptor<
        NavigationParams,
        NavigationStackOptions,
        NavigationStackProp
      >
    | undefined;
};

export type HeaderBackButtonProps = {
  disabled?: boolean;
  onPress?: () => void;
  pressColorAndroid?: string;
  backImage?:
    | React.ReactNode
    | ((props: { tintColor: string }) => React.ReactNode);
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
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
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
  | { animation: 'spring'; config: SpringConfig }
  | { animation: 'timing'; config: TimingConfig };

export type CardInterpolationProps = {
  current: {
    progress: Animated.Node<number>;
  };
  next?: {
    progress: Animated.Node<number>;
  };
  index: number;
  closing: Animated.Node<0 | 1>;
  layouts: {
    screen: Layout;
  };
  insets: EdgeInsets;
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
  current: {
    progress: Animated.Node<number>;
  };
  next?: {
    progress: Animated.Node<number>;
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
