import {
  StyleProp,
  TextStyle,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';

export type Route = {
  key: string;
  routeName: string;
};

export type NavigationEventName =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur';

export type NavigationState = {
  key: string;
  index: number;
  routes: Route[];
  transitions: {
    pushing: string[];
    popping: string[];
  };
  params?: { [key: string]: unknown };
};

export type NavigationProp<RouteName = string, Params = object> = {
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
  isFirstRouteInParent(): boolean;
  dangerouslyGetParent(): NavigationProp | undefined;
};

export type Layout = { width: number; height: number };

export type GestureDirection = 'horizontal' | 'vertical';

export type HeaderMode = 'float' | 'screen' | 'none';

export type HeaderScene<T> = {
  route: T;
  descriptor: SceneDescriptor;
  progress: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
    previous?: Animated.Node<number>;
  };
};

export type HeaderOptions = {
  headerTitle?: string;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  headerTintColor?: string;
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackTitle?: string;
  headerBackTitleStyle?: StyleProp<TextStyle>;
  headerTruncatedBackTitle?: string;
  headerLeft?: (props: HeaderBackButtonProps) => React.ReactNode;
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: () => React.ReactNode;
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerBackImage?: HeaderBackButtonProps['backImage'];
  headerPressColorAndroid?: string;
  headerBackground?: () => React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  headerStatusBarHeight?: number;
};

export type HeaderProps = {
  mode: 'float' | 'screen';
  layout: Layout;
  scene: HeaderScene<Route>;
  previous?: HeaderScene<Route>;
  navigation: NavigationProp;
  styleInterpolator: HeaderStyleInterpolator;
};

export type NavigationStackOptions = HeaderOptions & {
  title?: string;
  header?: null | ((props: HeaderProps) => React.ReactNode);
  animationEnabled?: boolean;
  gesturesEnabled?: boolean;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  disableKeyboardHandling?: boolean;
};

export type NavigationConfig = TransitionPreset & {
  mode: 'card' | 'modal';
  headerMode: HeaderMode;
  headerBackTitleVisible?: boolean;
  cardShadowEnabled?: boolean;
  cardOverlayEnabled?: boolean;
  transparentCard?: boolean;
};

export type SceneDescriptor = {
  key: string;
  options: NavigationStackOptions;
  navigation: NavigationProp;
  getComponent(): React.ComponentType;
};

export type HeaderBackButtonProps = {
  disabled?: boolean;
  onPress: () => void;
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
};

export type Screen = React.ComponentType<any> & {
  navigationOptions?: NavigationStackOptions & {
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
  direction: GestureDirection;
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  cardStyleInterpolator: CardStyleInterpolator;
  headerStyleInterpolator: HeaderStyleInterpolator;
};
