import { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from '@react-navigation/native';

export type Route = {
  key: string;
  routeName: string;
};

export type Scene = {
  key: string;
  index: number;
  isStale: boolean;
  isActive: boolean;
  route: Route;
  descriptor: SceneDescriptor;
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
  isTransitioning?: boolean;
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
  dangerouslyGetParent(): NavigationProp | undefined;
};

export type HeaderMode = 'float' | 'screen';

export type HeaderLayoutPreset = 'left' | 'center';

export type HeaderTransitionPreset = 'fade-in-place' | 'uikit';

export type HeaderBackgroundTransitionPreset = 'translate' | 'fade';

export type HeaderProps = {
  mode: HeaderMode;
  position: Animated.Value;
  navigation: NavigationProp;
  layout: TransitionerLayout;
  scene: Scene;
  scenes: Scene[];
  layoutPreset: HeaderLayoutPreset;
  transitionPreset?: HeaderTransitionPreset;
  backTitleVisible?: boolean;
  leftInterpolator: (props: SceneInterpolatorProps) => any;
  titleInterpolator: (props: SceneInterpolatorProps) => any;
  rightInterpolator: (props: SceneInterpolatorProps) => any;
  backgroundInterpolator: (props: SceneInterpolatorProps) => any;
  isLandscape: boolean;
};

export type HeaderTransitionConfig = {
  headerLeftInterpolator: SceneInterpolator;
  headerLeftLabelInterpolator: SceneInterpolator;
  headerLeftButtonInterpolator: SceneInterpolator;
  headerTitleFromLeftInterpolator: SceneInterpolator;
  headerTitleInterpolator: SceneInterpolator;
  headerRightInterpolator: SceneInterpolator;
  headerBackgroundInterpolator: SceneInterpolator;
  headerLayoutInterpolator: SceneInterpolator;
};

export type NavigationStackOptions = {
  title?: string;
  header?: (props: HeaderProps) => React.ReactNode;
  headerTitle?: string;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  headerTintColor?: string;
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackTitle?: string;
  headerBackTitleStyle?: StyleProp<TextStyle>;
  headerTruncatedBackTitle?: string;
  headerLeft?: React.FunctionComponent<HeaderBackbuttonProps>;
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: (() => React.ReactNode) | React.ReactNode;
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerBackImage?: React.FunctionComponent<{
    tintColor: string;
    title?: string | null;
  }>;
  headerPressColorAndroid?: string;
  headerBackground?: string;
  headerTransparent?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
  headerForceInset?: React.ComponentProps<typeof SafeAreaView>['forceInset'];
  gesturesEnabled?: boolean;
  gestureDirection?: 'inverted' | 'normal';
  gestureResponseDistance?: {
    vertical: number;
    horizontal: number;
  };
  disableKeyboardHandling?: boolean;
};

export type NavigationConfig = {
  mode: 'card' | 'modal';
  headerMode: HeaderMode;
  headerLayoutPreset: HeaderLayoutPreset;
  headerTransitionPreset: HeaderTransitionPreset;
  headerBackgroundTransitionPreset: HeaderBackgroundTransitionPreset;
  headerBackTitleVisible?: boolean;
  cardShadowEnabled?: boolean;
  cardOverlayEnabled?: boolean;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  transitionConfig: (
    transitionProps: TransitionProps,
    prevTransitionProps?: TransitionProps,
    isModal?: boolean
  ) => HeaderTransitionConfig;
};

export type SceneDescriptor = {
  key: string;
  options: NavigationStackOptions;
  navigation: NavigationProp;
  getComponent(): React.ComponentType;
};

export type HeaderBackbuttonProps = {
  disabled?: boolean;
  onPress: () => void;
  pressColorAndroid?: string;
  tintColor: string;
  backImage?: NavigationStackOptions['headerBackImage'];
  title?: string | null;
  truncatedTitle?: string | null;
  backTitleVisible?: boolean;
  allowFontScaling?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  layoutPreset: HeaderLayoutPreset;
  width?: number;
  scene: Scene;
};

export type SceneInterpolatorProps = {
  mode?: HeaderMode;
  layout: TransitionerLayout;
  scene: Scene;
  scenes: Scene[];
  position: Animated.AnimatedInterpolation;
  navigation: NavigationProp;
  shadowEnabled?: boolean;
  cardOverlayEnabled?: boolean;
};

export type SceneInterpolator = (props: SceneInterpolatorProps) => any;

export type TransitionerLayout = {
  height: Animated.Value;
  width: Animated.Value;
  initHeight: number;
  initWidth: number;
  isMeasured: boolean;
};

export type TransitionProps = {
  layout: TransitionerLayout;
  navigation: NavigationProp;
  position: Animated.Value;
  scenes: Scene[];
  scene: Scene;
  index: number;
};

export type TransitionConfig = {
  transitionSpec: {
    timing: Function;
  };
  screenInterpolator: SceneInterpolator;
  containerStyle?: StyleProp<ViewStyle>;
};

export type Screen = React.ComponentType<any> & {
  navigationOptions?: NavigationStackOptions & {
    [key: string]: any;
  };
};
