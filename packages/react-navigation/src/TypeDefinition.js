/* @flow */

import * as React from 'react';

import type { TabScene } from './views/TabView/TabView';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { Animated } from 'react-native';

export type ViewStyleProp = StyleObj;
export type TextStyleProp = StyleObj;
export type AnimatedViewStyleProp = $PropertyType<
  $PropertyType<Animated.View, 'props'>,
  'style'
>;
export type AnimatedTextStyleProp = $PropertyType<
  $PropertyType<Animated.Text, 'props'>,
  'style'
>;

/**
 * Navigation State + Action
 */

export type NavigationParams = {
  [key: string]: mixed,
};

export type NavigationNavigateAction = {|
  type: 'Navigation/NAVIGATE',
  routeName: string,
  params?: NavigationParams,

  // The action to run inside the sub-router
  action?: NavigationNavigateAction,
|};

export type DeprecatedNavigationNavigateAction = {|
  type: 'Navigate',
  routeName: string,
  params?: NavigationParams,

  // The action to run inside the sub-router
  action?: NavigationNavigateAction | DeprecatedNavigationNavigateAction,
|};

export type NavigationBackAction = {|
  type: 'Navigation/BACK',
  key?: ?string,
|};

export type DeprecatedNavigationBackAction = {|
  type: 'Back',
  key?: ?string,
|};

export type NavigationSetParamsAction = {|
  type: 'Navigation/SET_PARAMS',

  // The key of the route where the params should be set
  key: string,

  // The new params to merge into the existing route params
  params: NavigationParams,
|};

export type DeprecatedNavigationSetParamsAction = {|
  type: 'SetParams',

  // The key of the route where the params should be set
  key: string,

  // The new params to merge into the existing route params
  params: NavigationParams,
|};

export type NavigationInitAction = {|
  type: 'Navigation/INIT',
  params?: NavigationParams,
|};

export type DeprecatedNavigationInitAction = {|
  type: 'Init',
  params?: NavigationParams,
|};

export type NavigationResetAction = {|
  type: 'Navigation/RESET',
  index: number,
  key?: ?string,
  actions: Array<NavigationNavigateAction>,
|};

export type DeprecatedNavigationResetAction = {|
  type: 'Reset',
  index: number,
  key?: ?string,
  actions: Array<NavigationNavigateAction | DeprecatedNavigationNavigateAction>,
|};

export type NavigationUriAction = {|
  type: 'Navigation/URI',
  uri: string,
|};

export type DeprecatedNavigationUriAction = {|
  type: 'Uri',
  uri: string,
|};

export type NavigationAction =
  | NavigationInitAction
  | NavigationNavigateAction
  | NavigationBackAction
  | NavigationSetParamsAction
  | NavigationResetAction;

export type DeprecatedNavigationAction =
  | DeprecatedNavigationInitAction
  | DeprecatedNavigationNavigateAction
  | DeprecatedNavigationBackAction
  | DeprecatedNavigationSetParamsAction
  | DeprecatedNavigationResetAction;

export type PossiblyDeprecatedNavigationAction =
  | NavigationAction
  | DeprecatedNavigationAction;

/**
 * NavigationState is a tree of routes for a single navigator, where each child
 * route may either be a NavigationScreenRoute or a NavigationRouterRoute.
 * NavigationScreenRoute represents a leaf screen, while the
 * NavigationRouterRoute represents the state of a child navigator.
 *
 * NOTE: NavigationState is a state tree local to a single navigator and
 * its child navigators (via the routes field).
 * If we're in navigator nested deep inside the app, the state will only be the
 * state for that navigator.
 * The state for the root navigator of our app represents the whole navigation
 * state for the whole app.
 */
export type NavigationState = {
  /**
   * Index refers to the active child route in the routes array.
   */
  index: number,
  routes: Array<NavigationRoute>,
};

export type NavigationRoute = NavigationLeafRoute | NavigationStateRoute;

export type NavigationLeafRoute = {
  /**
   * React's key used by some navigators. No need to specify these manually,
   * they will be defined by the router.
   */
  key: string,
  /**
   * For example 'Home'.
   * This is used as a key in a route config when creating a navigator.
   */
  routeName: string,
  /**
   * Path is an advanced feature used for deep linking and on the web.
   */
  path?: string,
  /**
   * Params passed to this route when navigating to it,
   * e.g. `{ car_id: 123 }` in a route that displays a car.
   */
  params?: NavigationParams,
};

export type NavigationStateRoute = NavigationLeafRoute & NavigationState;

/**
 * Router
 */

export type NavigationScreenOptionsGetter<Options: {}> = (
  navigation: NavigationScreenProp<NavigationRoute>,
  screenProps?: {}
) => Options;

export type NavigationRouter<State: NavigationState, Options: {}> = {
  /**
   * The reducer that outputs the new navigation state for a given action, with
   * an optional previous state. When the action is considered handled but the
   * state is unchanged, the output state is null.
   */
  getStateForAction: (action: NavigationAction, lastState: ?State) => ?State,

  /**
   * Maps a URI-like string to an action. This can be mapped to a state
   * using `getStateForAction`.
   */
  getActionForPathAndParams: (
    path: string,
    params?: NavigationParams
  ) => ?NavigationAction,

  getPathAndParamsForState: (
    state: State
  ) => {
    path: string,
    params?: NavigationParams,
  },

  getComponentForRouteName: (routeName: string) => NavigationComponent,

  getComponentForState: (state: State) => NavigationComponent,

  /**
   * Gets the screen navigation options for a given screen.
   *
   * For example, we could get the config for the 'Foo' screen when the
   * `navigation.state` is:
   *
   *  {routeName: 'Foo', key: '123'}
   */
  getScreenOptions: NavigationScreenOptionsGetter<Options>,
};

export type NavigationScreenDetails<T> = {
  options: T,
  state: NavigationRoute,
  navigation: NavigationScreenProp<NavigationRoute>,
};

export type NavigationScreenOptions = {|
  title?: string,
|};

export type NavigationScreenConfigProps = {
  navigation: NavigationScreenProp<NavigationRoute>,
  screenProps: {},
};

export type NavigationScreenConfig<Options> =
  | Options
  | (({
      ...$Exact<NavigationScreenConfigProps>,
      navigationOptions: Options,
    }) => Options);

export type NavigationComponent =
  | NavigationScreenComponent<NavigationRoute, *, *>
  | NavigationNavigator<NavigationStateRoute, *, *>;

export type NavigationScreenComponent<
  Route: NavigationRoute,
  Options: {},
  Props: {}
> = React.ComponentType<NavigationNavigatorProps<Options, Route> & Props> & {
  router?: void,
  navigationOptions?: NavigationScreenConfig<Options>,
};

export type NavigationNavigator<
  State: NavigationState,
  Options: {},
  Props: {}
> = React.ComponentType<NavigationNavigatorProps<Options, State> & Props> & {
  router: NavigationRouter<State, Options>,
  navigationOptions?: ?NavigationScreenConfig<Options>,
};

export type NavigationRouteConfig<T: {}> = {
  ...$Exact<T>,
  navigationOptions?: NavigationScreenConfig<*>,
  path?: string,
};

export type NavigationScreenRouteConfig =
  | {
      screen: NavigationComponent,
    }
  | {
      getScreen: () => NavigationComponent,
    };

export type NavigationPathsConfig = {
  [routeName: string]: string,
};

export type NavigationRouteConfigMap = {
  [routeName: string]: NavigationRouteConfig<*>,
};

/**
 * Header
 */

export type HeaderMode = 'float' | 'screen' | 'none';

export type HeaderProps = NavigationSceneRendererProps & {
  mode: HeaderMode,
  router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
  getScreenDetails: NavigationScene => NavigationScreenDetails<
    NavigationStackScreenOptions
  >,
};

/**
 * Stack Navigator
 */

export type NavigationStackScreenOptions = NavigationScreenOptions & {
  header?: ?(React.Node | (HeaderProps => React.Node)),
  headerTitle?: string | React.Node | React.ComponentType<any>,
  headerTitleStyle?: AnimatedTextStyleProp,
  headerTitleAllowFontScaling?: boolean,
  headerTintColor?: string,
  headerLeft?: React.Node | React.ComponentType<any>,
  headerBackTitle?: string,
  headerTruncatedBackTitle?: string,
  headerBackTitleStyle?: TextStyleProp,
  headerPressColorAndroid?: string,
  headerRight?: React.Node,
  headerStyle?: ViewStyleProp,
  gesturesEnabled?: boolean,
  gestureResponseDistance?: { vertical?: number, horizontal?: number },
};

export type NavigationStackRouterConfig = {
  initialRouteName?: string,
  initialRouteParams?: NavigationParams,
  paths?: NavigationPathsConfig,
  navigationOptions?: NavigationScreenConfig<*>,
};

export type NavigationStackViewConfig = {
  mode?: 'card' | 'modal',
  headerMode?: HeaderMode,
  cardStyle?: ViewStyleProp,
  transitionConfig?: () => TransitionConfig,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
};

export type StackNavigatorConfig = {
  ...$Exact<NavigationStackViewConfig>,
  ...$Exact<NavigationStackRouterConfig>,
};

/**
 * Tab Navigator
 */

export type NavigationTabRouterConfig = {
  initialRouteName?: string,
  paths?: NavigationPathsConfig,
  navigationOptions?: NavigationScreenConfig<*>,
  order?: Array<string>, // todo: type these as the real route names rather than 'string'

  // Does the back button cause the router to switch to the initial tab
  backBehavior?: 'none' | 'initialRoute', // defaults `initialRoute`
};

export type NavigationTabScreenOptions = {|
  ...$Exact<NavigationScreenOptions>,
  tabBarIcon?:
    | React.Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React.Node),
  tabBarLabel?:
    | string
    | React.Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React.Node),
  tabBarVisible?: boolean,
  tabBarTestIDProps?: { testID?: string, accessibilityLabel?: string },
  tabBarOnPress?: (
    scene: TabScene,
    jumpToIndex: (index: number) => void
  ) => void,
|};

/**
 * Drawer
 */

export type NavigationDrawerScreenOptions = {|
  ...$Exact<NavigationScreenOptions>,
  drawerIcon?:
    | React.Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React.Node),
  drawerLabel?:
    | React.Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React.Node),
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
|};

/**
 * Navigator Prop
 */

export type NavigationDispatch = (
  action: PossiblyDeprecatedNavigationAction
) => boolean;

export type NavigationProp<S> = {
  +state: S,
  dispatch: NavigationDispatch,
};

export type NavigationScreenProp<+S> = {
  +state: S,
  dispatch: NavigationDispatch,
  goBack: (routeKey?: ?string) => boolean,
  navigate: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction
  ) => boolean,
  setParams: (newParams: NavigationParams) => boolean,
};

export type NavigationNavigatorProps<O: {}, S: {}> = {
  navigation: NavigationScreenProp<S>,
  screenProps?: {},
  navigationOptions?: O,
};

/**
 * Gestures, Animations, and Interpolators
 */

export type NavigationGestureDirection = 'horizontal' | 'vertical';

export type NavigationLayout = {
  height: Animated.Value,
  initHeight: number,
  initWidth: number,
  isMeasured: boolean,
  width: Animated.Value,
};

export type NavigationScene = {
  index: number,
  isActive: boolean,
  isStale: boolean,
  key: string,
  route: NavigationRoute,
};

export type NavigationTransitionProps = {
  // The layout of the screen container
  layout: NavigationLayout,

  // The destination navigation state of the transition
  navigation: NavigationScreenProp<NavigationState>,

  // The progressive index of the transitioner's navigation state.
  position: Animated.Value,

  // The value that represents the progress of the transition when navigation
  // state changes from one to another. Its numeric value will range from 0
  // to 1.
  //  progress.__getAnimatedValue() < 1 : transtion is happening.
  //  progress.__getAnimatedValue() == 1 : transtion completes.
  progress: Animated.Value,

  // All the scenes of the transitioner.
  scenes: Array<NavigationScene>,

  // The active scene, corresponding to the route at
  // `navigation.state.routes[navigation.state.index]`. When rendering
  // NavigationSceneRendererPropsIndex, the scene does not refer to the active
  // scene, but instead the scene that is being rendered. The index always
  // is the index of the scene
  scene: NavigationScene,
  index: number,

  screenProps?: {},
};

// The scene renderer props are nearly identical to the props used for rendering
// a transition. The exception is that the passed scene is not the active scene
// but is instead the scene that the renderer should render content for.
export type NavigationSceneRendererProps = NavigationTransitionProps;

export type NavigationTransitionSpec = {
  duration?: number,
  // An easing function from `Easing`.
  easing?: (t: number) => number,
  // A timing function such as `Animated.timing`.
  timing?: (value: Animated.Value, config: any) => any,
};

/**
 * Describes a visual transition from one screen to another.
 */
export type TransitionConfig = {
  // The basics properties of the animation, such as duration and easing
  transitionSpec?: NavigationTransitionSpec,
  // How to animate position and opacity of the screen
  // based on the value generated by the transitionSpec
  screenInterpolator?: (props: NavigationSceneRendererProps) => {},
  // The style of the container. Useful when a scene doesn't have
  // 100% opacity and the underlying container is visible.
  containerStyle?: ViewStyleProp,
};

export type NavigationAnimationSetter = (
  position: Animated.Value,
  newState: NavigationState,
  lastState: NavigationState
) => void;

export type NavigationSceneRenderer = () => React.Node;

export type NavigationStyleInterpolator = (
  props: NavigationSceneRendererProps
) => AnimatedViewStyleProp;

export type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

export type SceneIndicesForInterpolationInputRange = {
  first: number,
  last: number,
};
