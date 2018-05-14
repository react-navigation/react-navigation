// @flow

// ---------------------------------------
// Private Types
// ---------------------------------------

/**
 * First, a bunch of things we would love to import but instead must
 * reconstruct (mostly copy-pasted).
 */

// This is a bastardization of the true StyleObj type located in
// react-native/Libraries/StyleSheet/StyleSheetTypes. We unfortunately can't
// import that here, and it's too lengthy (and consequently too brittle) to
// copy-paste here either.
type $npm$ReactNavigation$StyleObj =
  | null
  | void
  | number
  | false
  | ''
  | $ReadOnlyArray<$npm$ReactNavigation$StyleObj>
  | { [name: string]: any };
type $npm$ReactNavigation$ViewStyleProp = $npm$ReactNavigation$StyleObj;
type $npm$ReactNavigation$TextStyleProp = $npm$ReactNavigation$StyleObj;
type $npm$ReactNavigation$AnimatedViewStyleProp = $npm$ReactNavigation$StyleObj;
type $npm$ReactNavigation$AnimatedTextStyleProp = $npm$ReactNavigation$StyleObj;

// This is copied from the Layout type in
// react-native-tab-view/src/TabViewTypeDefinitions
type $npm$ReactNavigation$TabViewLayout = {
  height: number,
  width: number,
};

// This is copied from react-native/Libraries/Image/ImageSource.js
type $npm$ReactNavigation$ImageURISource = {
  uri?: string,
  bundle?: string,
  method?: string,
  headers?: Object,
  body?: string,
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached',
  width?: number,
  height?: number,
  scale?: number,
};
type $npm$ReactNavigation$ImageSource = $npm$ReactNavigation$ImageURISource | number | Array<$npm$ReactNavigation$ImageURISource>;

// This one is too large to copy. Actual definition is in
// react-native/Libraries/Animated/src/nodes/AnimatedValue.js
type $npm$ReactNavigation$AnimatedValue = Object;

type $npm$ReactNavigation$HeaderForceInset = {
  horizontal?: string,
  vertical?: string,
  left?: string,
  right?: string,
  top?: string,
  bottom?: string,
};

/**
 * Next, all the type declarations
 */

/**
 * Navigation State + Action
 */

type $npm$ReactNavigation$NavigationParams = {
  [key: string]: mixed,
};

type $npm$ReactNavigation$NavigationNavigateAction = {|
  type: 'Navigation/NAVIGATE',
  routeName: string,
  params?: $npm$ReactNavigation$NavigationParams,

  // The action to run inside the sub-router
  action?: $npm$ReactNavigation$NavigationNavigateAction,

  key?: string,
|};

type $npm$ReactNavigation$NavigationBackAction = {|
  type: 'Navigation/BACK',
  key?: ?string,
|};

type $npm$ReactNavigation$NavigationSetParamsAction = {|
  type: 'Navigation/SET_PARAMS',

  // The key of the route where the params should be set
  key: string,

  // The new params to merge into the existing route params
  params: $npm$ReactNavigation$NavigationParams,
|};

type $npm$ReactNavigation$NavigationInitAction = {|
  type: 'Navigation/INIT',
  params?: $npm$ReactNavigation$NavigationParams,
|};

type $npm$ReactNavigation$NavigationResetAction = {|
  type: 'Navigation/RESET',
  index: number,
  key?: ?string,
  actions: Array<$npm$ReactNavigation$NavigationNavigateAction>,
|};

type $npm$ReactNavigation$NavigationUriAction = {|
  type: 'Navigation/URI',
  uri: string,
|};

type $npm$ReactNavigation$NavigationReplaceAction = {|
  +type: 'Navigation/REPLACE',
  +key: string,
  +routeName: string,
  +params?: $npm$ReactNavigation$NavigationParams,
  +action?: $npm$ReactNavigation$NavigationNavigateAction,
|};
type $npm$ReactNavigation$NavigationPopAction = {|
  +type: 'Navigation/POP',
  +n?: number,
  +immediate?: boolean,
|};
type $npm$ReactNavigation$NavigationPopToTopAction = {|
  +type: 'Navigation/POP_TO_TOP',
  +immediate?: boolean,
|};
type $npm$ReactNavigation$NavigationPushAction = {|
  +type: 'Navigation/PUSH',
  +routeName: string,
  +params?: $npm$ReactNavigation$NavigationParams,
  +action?: $npm$ReactNavigation$NavigationNavigateAction,
  +key?: string,
|};

type $npm$ReactNavigation$NavigationAction =
  | $npm$ReactNavigation$NavigationInitAction
  | $npm$ReactNavigation$NavigationNavigateAction
  | $npm$ReactNavigation$NavigationReplaceAction
  | $npm$ReactNavigation$NavigationPopAction
  | $npm$ReactNavigation$NavigationPopToTopAction
  | $npm$ReactNavigation$NavigationPushAction
  | $npm$ReactNavigation$NavigationBackAction
  | $npm$ReactNavigation$NavigationSetParamsAction
  | $npm$ReactNavigation$NavigationResetAction;

/**
 * NavigationState is a tree of routes for a single navigator, where each
 * child route may either be a NavigationScreenRoute or a
 * NavigationRouterRoute. NavigationScreenRoute represents a leaf screen,
 * while the NavigationRouterRoute represents the state of a child navigator.
 *
 * NOTE: NavigationState is a state tree local to a single navigator and
 * its child navigators (via the routes field).
 * If we're in navigator nested deep inside the app, the state will only be
 * the state for that navigator.
 * The state for the root navigator of our app represents the whole navigation
 * state for the whole app.
 */
type $npm$ReactNavigation$NavigationState = {
  /**
   * Index refers to the active child route in the routes array.
   */
  index: number,
  routes: Array<$npm$ReactNavigation$NavigationRoute>,
};

type $npm$ReactNavigation$NavigationRoute =
  | $npm$ReactNavigation$NavigationLeafRoute
  | $npm$ReactNavigation$NavigationStateRoute;

type $npm$ReactNavigation$NavigationLeafRoute = {
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
  params?: $npm$ReactNavigation$NavigationParams,
};

type $npm$ReactNavigation$NavigationStateRoute = $npm$ReactNavigation$NavigationLeafRoute &
  $npm$ReactNavigation$NavigationState;

/**
 * Router
 */

type $npm$ReactNavigation$NavigationScreenOptionsGetter<Options: {}> = (
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationRoute>,
  screenProps?: {}
) => Options;

type $npm$ReactNavigation$NavigationRouter<State: $npm$ReactNavigation$NavigationState, Options: {}> = {
  /**
   * The reducer that outputs the new navigation state for a given action,
   * with an optional previous state. When the action is considered handled
   * but the state is unchanged, the output state is null.
   */
  getStateForAction: (action: $npm$ReactNavigation$NavigationAction, lastState: ?State) => ?State,

  /**
   * Maps a URI-like string to an action. This can be mapped to a state
   * using `getStateForAction`.
   */
  getActionForPathAndParams: (
    path: string,
    params?: $npm$ReactNavigation$NavigationParams
  ) => ?$npm$ReactNavigation$NavigationAction,

  getPathAndParamsForState: (
    state: State
  ) => {
    path: string,
    params?: $npm$ReactNavigation$NavigationParams,
  },

  getComponentForRouteName: (routeName: string) => $npm$ReactNavigation$NavigationComponent,

  getComponentForState: (state: State) => $npm$ReactNavigation$NavigationComponent,

  /**
   * Gets the screen navigation options for a given screen.
   *
   * For example, we could get the config for the 'Foo' screen when the
   * `navigation.state` is:
   *
   *  {routeName: 'Foo', key: '123'}
   */
  getScreenOptions: $npm$ReactNavigation$NavigationScreenOptionsGetter<Options>,
};

type $npm$ReactNavigation$NavigationScreenDetails<T> = {
  options: T,
  state: $npm$ReactNavigation$NavigationRoute,
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationRoute>,
};

type $npm$ReactNavigation$NavigationScreenOptions = {
  title?: string,
};

type $npm$ReactNavigation$NavigationScreenConfigProps = $Shape<{
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationRoute>,
  screenProps: {},
}>;

type $npm$ReactNavigation$NavigationScreenConfig<Options> =
  | Options
  | (({
      ...$Exact<$npm$ReactNavigation$NavigationScreenConfigProps>,
      navigationOptions: Options,
    }) => Options);

type $npm$ReactNavigation$NavigationComponent =
  | $npm$ReactNavigation$NavigationScreenComponent<$npm$ReactNavigation$NavigationRoute, *, *>
  | $npm$ReactNavigation$NavigationContainer<$npm$ReactNavigation$NavigationStateRoute, *, *>;

type $npm$ReactNavigation$NavigationScreenComponent<
  Route: $npm$ReactNavigation$NavigationRoute,
  Options: {},
  Props: {}
> = React$ComponentType<$npm$ReactNavigation$NavigationNavigatorProps<Options, Route> & Props> &
  ({} | { navigationOptions: $npm$ReactNavigation$NavigationScreenConfig<Options> });

type $npm$ReactNavigation$NavigationNavigator<
  State: $npm$ReactNavigation$NavigationState,
  Options: {},
  Props: {}
> = React$ComponentType<$npm$ReactNavigation$NavigationNavigatorProps<Options, State> & Props> & {
  router: $npm$ReactNavigation$NavigationRouter<State, Options>,
  navigationOptions?: ?$npm$ReactNavigation$NavigationScreenConfig<Options>,
};

type $npm$ReactNavigation$NavigationRouteConfig =
  | $npm$ReactNavigation$NavigationComponent
  | ({
      navigationOptions?: $npm$ReactNavigation$NavigationScreenConfig<*>,
      path?: string,
    } & $npm$ReactNavigation$NavigationScreenRouteConfig);

type $npm$ReactNavigation$NavigationScreenRouteConfig =
  | {
      screen: $npm$ReactNavigation$NavigationComponent,
    }
  | {
      getScreen: () => $npm$ReactNavigation$NavigationComponent,
    };

type $npm$ReactNavigation$NavigationPathsConfig = {
  [routeName: string]: string,
};

type $npm$ReactNavigation$NavigationRouteConfigMap = {
  [routeName: string]: $npm$ReactNavigation$NavigationRouteConfig,
};

/**
 * Header
 */

type $npm$ReactNavigation$HeaderMode = 'float' | 'screen' | 'none';

type $npm$ReactNavigation$HeaderProps = $Shape<
  $npm$ReactNavigation$NavigationSceneRendererProps & {
    mode: $npm$ReactNavigation$HeaderMode,
    router: $npm$ReactNavigation$NavigationRouter<$npm$ReactNavigation$NavigationState, $npm$ReactNavigation$NavigationStackScreenOptions>,
    getScreenDetails: $npm$ReactNavigation$NavigationScene => $npm$ReactNavigation$NavigationScreenDetails<
      $npm$ReactNavigation$NavigationStackScreenOptions
    >,
    leftInterpolator: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
    titleInterpolator: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
    rightInterpolator: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
  }
>;

/**
 * Stack Navigator
 */

type $npm$ReactNavigation$NavigationStackScreenOptions = $npm$ReactNavigation$NavigationScreenOptions & {
  header?: ?(React$Node | ($npm$ReactNavigation$HeaderProps => React$Node)),
  headerTransparent?: boolean,
  headerTitle?: string | React$Node | React$ElementType,
  headerTitleStyle?: $npm$ReactNavigation$AnimatedTextStyleProp,
  headerTitleAllowFontScaling?: boolean,
  headerTintColor?: string,
  headerLeft?: React$Node | React$ElementType,
  headerBackTitle?: string,
  headerBackImage?: $npm$ReactNavigation$ImageSource,
  headerTruncatedBackTitle?: string,
  headerBackTitleStyle?: $npm$ReactNavigation$TextStyleProp,
  headerPressColorAndroid?: string,
  headerRight?: React$Node,
  headerStyle?: $npm$ReactNavigation$ViewStyleProp,
  headerForceInset?: $npm$ReactNavigation$HeaderForceInset,
  headerBackground?: React$Node | React$ElementType,
  gesturesEnabled?: boolean,
  gestureResponseDistance?: { vertical?: number, horizontal?: number },
  gestureDirection?: 'default' | 'inverted',
};

type $npm$ReactNavigation$NavigationStackRouterConfig = {|
  initialRouteName?: string,
  initialRouteParams?: $npm$ReactNavigation$NavigationParams,
  paths?: $npm$ReactNavigation$NavigationPathsConfig,
  navigationOptions?: $npm$ReactNavigation$NavigationScreenConfig<*>,
  initialRouteKey?: string,
|};

type $npm$ReactNavigation$NavigationStackViewConfig = {|
  mode?: 'card' | 'modal',
  headerMode?: $npm$ReactNavigation$HeaderMode,
  headerTransitionPreset?: 'fade-in-place' | 'uikit',
  cardStyle?: $npm$ReactNavigation$ViewStyleProp,
  transitionConfig?: () => $npm$ReactNavigation$TransitionConfig,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
|};

type $npm$ReactNavigation$StackNavigatorConfig = {|
  ...$npm$ReactNavigation$NavigationStackViewConfig,
  ...$npm$ReactNavigation$NavigationStackRouterConfig,
|};

/**
 * Switch Navigator
 */

type $npm$ReactNavigation$NavigationSwitchRouterConfig = {|
  initialRouteName?: string,
  initialRouteParams?: $npm$ReactNavigation$NavigationParams,
  paths?: $npm$ReactNavigation$NavigationPathsConfig,
  navigationOptions?: $npm$ReactNavigation$NavigationScreenConfig<*>,
  order?: Array<string>,
  backBehavior?: 'none' | 'initialRoute', // defaults to `'none'`
  resetOnBlur?: boolean, // defaults to `true`
|};

/**
 * Tab Navigator
 */

type $npm$ReactNavigation$NavigationTabRouterConfig = {|
  initialRouteName?: string,
  initialRouteParams?: $npm$ReactNavigation$NavigationParams,
  paths?: $npm$ReactNavigation$NavigationPathsConfig,
  navigationOptions?: $npm$ReactNavigation$NavigationScreenConfig<*>,
  // todo: type these as the real route names rather than 'string'
  order?: Array<string>,
  // Does the back button cause the router to switch to the initial tab
  backBehavior?: 'none' | 'initialRoute', // defaults `initialRoute`
|};

type $npm$ReactNavigation$TabScene = {
  route: $npm$ReactNavigation$NavigationRoute,
  focused: boolean,
  index: number,
  tintColor?: ?string,
};

type $npm$ReactNavigation$NavigationTabScreenOptions = {|
  ...$Exact<$npm$ReactNavigation$NavigationScreenOptions>,
  tabBarIcon?:
    | React$Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React$Node),
  tabBarLabel?:
    | string
    | React$Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React$Node),
  tabBarVisible?: boolean,
  tabBarTestIDProps?: { testID?: string, accessibilityLabel?: string },
  tabBarOnPress?: (
    scene: $npm$ReactNavigation$TabScene,
    jumpToIndex: (index: number) => void
  ) => void,
|};

/**
 * Drawer
 */

type $npm$ReactNavigation$NavigationDrawerScreenOptions = {|
  ...$Exact<$npm$ReactNavigation$NavigationScreenOptions>,
  drawerIcon?:
    | React$Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React$Node),
  drawerLabel?:
    | React$Node
    | ((options: { tintColor: ?string, focused: boolean }) => ?React$Node),
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
|};

/**
 * Navigator Prop
 */

type $npm$ReactNavigation$NavigationDispatch = (
  action: $npm$ReactNavigation$NavigationAction
) => boolean;

type $npm$ReactNavigation$NavigationProp<S> = {
  +state: S,
  dispatch: $npm$ReactNavigation$NavigationDispatch,
};

type $npm$ReactNavigation$EventType =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur'
  | 'action';

type $npm$ReactNavigation$NavigationEventPayload = {
  type: $npm$ReactNavigation$EventType,
  action: $npm$ReactNavigation$NavigationAction,
  state: $npm$ReactNavigation$NavigationState,
  lastState: ?$npm$ReactNavigation$NavigationState,
};

type $npm$ReactNavigation$NavigationEventCallback = (
  payload: $npm$ReactNavigation$NavigationEventPayload
) => void;

type $npm$ReactNavigation$NavigationEventSubscription = {
  remove: () => void,
};

type $npm$ReactNavigation$NavigationScreenProp<+S> = {
  +state: S,
  dispatch: $npm$ReactNavigation$NavigationDispatch,
  goBack: (routeKey?: ?string) => boolean,
  navigate: (
    routeName: string,
    params?: $npm$ReactNavigation$NavigationParams,
    action?: $npm$ReactNavigation$NavigationNavigateAction
  ) => boolean,
  setParams: (newParams: $npm$ReactNavigation$NavigationParams) => boolean,
  getParam: (paramName: string, fallback?: any) => any,
  addListener: (
    eventName: string,
    callback: $npm$ReactNavigation$NavigationEventCallback
  ) => $npm$ReactNavigation$NavigationEventSubscription,
  push: (
    routeName: string,
    params?: $npm$ReactNavigation$NavigationParams,
    action?: $npm$ReactNavigation$NavigationNavigateAction
  ) => boolean,
  replace: (
    routeName: string,
    params?: $npm$ReactNavigation$NavigationParams,
    action?: $npm$ReactNavigation$NavigationNavigateAction
  ) => boolean,
  pop: (n?: number, params?: { immediate?: boolean }) => boolean,
  popToTop: (params?: { immediate?: boolean }) => boolean,
};

type $npm$ReactNavigation$NavigationNavigatorProps<O: {}, S: {}> = $Shape<{
  navigation: $npm$ReactNavigation$NavigationScreenProp<S>,
  screenProps?: {},
  navigationOptions?: O,
}>;

/**
 * Navigation container
 */

type $npm$ReactNavigation$NavigationContainer<
  State: $npm$ReactNavigation$NavigationState,
  Options: {},
  Props: {}
> = React$ComponentType<$npm$ReactNavigation$NavigationContainerProps<State, Options> & Props> & {
  router: $npm$ReactNavigation$NavigationRouter<State, Options>,
  navigationOptions?: ?$npm$ReactNavigation$NavigationScreenConfig<Options>,
};

type $npm$ReactNavigation$NavigationContainerProps<S: {}, O: {}> = $Shape<{
  uriPrefix?: string | RegExp,
  onNavigationStateChange?: ?(
    $npm$ReactNavigation$NavigationState,
    $npm$ReactNavigation$NavigationState,
    $npm$ReactNavigation$NavigationAction
  ) => void,
  navigation?: $npm$ReactNavigation$NavigationScreenProp<S>,
  screenProps?: *,
  navigationOptions?: O,
}>;

/**
 * Gestures, Animations, and Interpolators
 */

type $npm$ReactNavigation$NavigationGestureDirection = 'horizontal' | 'vertical';

type $npm$ReactNavigation$NavigationLayout = {
  height: $npm$ReactNavigation$AnimatedValue,
  initHeight: number,
  initWidth: number,
  isMeasured: boolean,
  width: $npm$ReactNavigation$AnimatedValue,
};

type $npm$ReactNavigation$NavigationScene = {
  index: number,
  isActive: boolean,
  isStale: boolean,
  key: string,
  route: $npm$ReactNavigation$NavigationRoute,
};

type $npm$ReactNavigation$NavigationTransitionProps = $Shape<{
  // The layout of the screen container
  layout: $npm$ReactNavigation$NavigationLayout,

  // The destination navigation state of the transition
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,

  // The progressive index of the transitioner's navigation state.
  position: $npm$ReactNavigation$AnimatedValue,

  // The value that represents the progress of the transition when navigation
  // state changes from one to another. Its numeric value will range from 0
  // to 1.
  //  progress.__getAnimatedValue() < 1 : transtion is happening.
  //  progress.__getAnimatedValue() == 1 : transtion completes.
  progress: $npm$ReactNavigation$AnimatedValue,

  // All the scenes of the transitioner.
  scenes: Array<$npm$ReactNavigation$NavigationScene>,

  // The active scene, corresponding to the route at
  // `navigation.state.routes[navigation.state.index]`. When rendering
  // NavigationSceneRendererPropsIndex, the scene does not refer to the active
  // scene, but instead the scene that is being rendered. The index always
  // is the index of the scene
  scene: $npm$ReactNavigation$NavigationScene,
  index: number,

  screenProps?: {},
}>;

// The scene renderer props are nearly identical to the props used for
// rendering a transition. The exception is that the passed scene is not the
// active scene but is instead the scene that the renderer should render
// content for.
type $npm$ReactNavigation$NavigationSceneRendererProps = $npm$ReactNavigation$NavigationTransitionProps;

type $npm$ReactNavigation$NavigationTransitionSpec = {
  duration?: number,
  // An easing function from `Easing`.
  easing?: (t: number) => number,
  // A timing function such as `Animated.timing`.
  timing?: (value: $npm$ReactNavigation$AnimatedValue, config: any) => any,
};

/**
 * Describes a visual transition from one screen to another.
 */
type $npm$ReactNavigation$TransitionConfig = {
  // The basics properties of the animation, such as duration and easing
  transitionSpec?: $npm$ReactNavigation$NavigationTransitionSpec,
  // How to animate position and opacity of the screen
  // based on the value generated by the transitionSpec
  screenInterpolator?: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
  // How to animate position and opacity of the header componetns
  // based on the value generated by the transitionSpec
  headerLeftInterpolator?: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
  headerTitleInterpolator?: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
  headerRightInterpolator?: (props: $npm$ReactNavigation$NavigationSceneRendererProps) => {},
  // The style of the container. Useful when a scene doesn't have
  // 100% opacity and the underlying container is visible.
  containerStyle?: $npm$ReactNavigation$ViewStyleProp,
};

type $npm$ReactNavigation$NavigationAnimationSetter = (
  position: $npm$ReactNavigation$AnimatedValue,
  newState: $npm$ReactNavigation$NavigationState,
  lastState: $npm$ReactNavigation$NavigationState
) => void;

type $npm$ReactNavigation$NavigationSceneRenderer = () => React$Node;

type $npm$ReactNavigation$NavigationStyleInterpolator = (
  props: $npm$ReactNavigation$NavigationSceneRendererProps
) => $npm$ReactNavigation$AnimatedViewStyleProp;

type $npm$ReactNavigation$LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

type $npm$ReactNavigation$SceneIndicesForInterpolationInputRange = {
  first: number,
  last: number,
};

type $npm$ReactNavigation$RouterProp<S: $npm$ReactNavigation$NavigationState, O: {}> = {
  router: $npm$ReactNavigation$NavigationRouter<S, O>,
};

type $npm$ReactNavigation$NavigatorCreator<
  NavigationViewProps: {},
  S: $npm$ReactNavigation$NavigationState,
  O: {}
> = (
  NavigationView: React$ComponentType<$npm$ReactNavigation$RouterProp<S, O> & NavigationViewProps>
) => $npm$ReactNavigation$NavigationNavigator<S, O, NavigationViewProps>;

type $npm$ReactNavigation$TabViewConfig = {|
  tabBarComponent?: React$ElementType,
  tabBarPosition?: 'top' | 'bottom',
  tabBarOptions?: {},
  swipeEnabled?: boolean,
  animationEnabled?: boolean,
  configureTransition?: (
    currentTransitionProps: Object,
    nextTransitionProps: Object
  ) => Object,
  initialLayout?: $npm$ReactNavigation$TabViewLayout,
|};

type $npm$ReactNavigation$TabNavigatorConfig = {|
  ...$npm$ReactNavigation$NavigationTabRouterConfig,
  ...$npm$ReactNavigation$TabViewConfig,
  lazy?: boolean,
  removeClippedSubviews?: boolean,
  containerOptions?: void,
|};

type $npm$ReactNavigation$SwitchNavigatorConfig = {|
  ...$npm$ReactNavigation$NavigationSwitchRouterConfig,
|};

type $npm$ReactNavigation$DrawerViewConfig = {|
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
  drawerWidth?: number | (() => number),
  drawerPosition?: 'left' | 'right',
  drawerOpenRoute?: string,
  drawerCloseRoute?: string,
  drawerToggleRoute?: string,
  contentComponent?: React$ElementType,
  contentOptions?: {},
  style?: $npm$ReactNavigation$ViewStyleProp,
  useNativeAnimations?: boolean,
  drawerBackgroundColor?: string,
  screenProps?: {},
|};

type $npm$ReactNavigation$DrawerNavigatorConfig = $Exact<{
  ...$npm$ReactNavigation$NavigationTabRouterConfig,
  ...$npm$ReactNavigation$DrawerViewConfig,
  containerConfig?: void,
}>;

type $npm$ReactNavigation$TransitionerProps = {
  configureTransition: (
    transitionProps: $npm$ReactNavigation$NavigationTransitionProps,
    prevTransitionProps: ?$npm$ReactNavigation$NavigationTransitionProps
  ) => $npm$ReactNavigation$NavigationTransitionSpec,
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  onTransitionEnd?: (...args: Array<mixed>) => void,
  onTransitionStart?: (...args: Array<mixed>) => void,
  render: (
    transitionProps: $npm$ReactNavigation$NavigationTransitionProps,
    prevTransitionProps: ?$npm$ReactNavigation$NavigationTransitionProps
  ) => React$Node,
};

type $npm$ReactNavigation$CardStackTransitionerProps = {
  headerMode: $npm$ReactNavigation$HeaderMode,
  mode: 'card' | 'modal',
  router: $npm$ReactNavigation$NavigationRouter<$npm$ReactNavigation$NavigationState, $npm$ReactNavigation$NavigationStackScreenOptions>,
  cardStyle?: $npm$ReactNavigation$ViewStyleProp,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => $npm$ReactNavigation$TransitionConfig,
} & $npm$ReactNavigation$NavigationNavigatorProps<$npm$ReactNavigation$NavigationStackScreenOptions, $npm$ReactNavigation$NavigationState>;

type $npm$ReactNavigation$CardStackProps = {
  screenProps?: {},
  headerMode: $npm$ReactNavigation$HeaderMode,
  headerComponent?: React$ElementType,
  mode: 'card' | 'modal',
  router: $npm$ReactNavigation$NavigationRouter<$npm$ReactNavigation$NavigationState, $npm$ReactNavigation$NavigationStackScreenOptions>,
  cardStyle?: $npm$ReactNavigation$ViewStyleProp,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => $npm$ReactNavigation$TransitionConfig,
  // NavigationTransitionProps:
  layout: $npm$ReactNavigation$NavigationLayout,
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  position: $npm$ReactNavigation$AnimatedValue,
  progress: $npm$ReactNavigation$AnimatedValue,
  scenes: Array<$npm$ReactNavigation$NavigationScene>,
  scene: $npm$ReactNavigation$NavigationScene,
  index: number,
};

type $npm$ReactNavigation$CardProps = {
  ...$Exact<$npm$ReactNavigation$NavigationSceneRendererProps>,
  children: React$Node,
  onComponentRef: React$Ref<*>,
  pointerEvents: string,
  style: any,
};

type $npm$ReactNavigation$SafeAreaViewForceInsetValue = 'always' | 'never' | number;
type $npm$ReactNavigation$SafeAreaViewProps = {
  forceInset?: {
    top?: $npm$ReactNavigation$SafeAreaViewForceInsetValue,
    bottom?: $npm$ReactNavigation$SafeAreaViewForceInsetValue,
    left?: $npm$ReactNavigation$SafeAreaViewForceInsetValue,
    right?: $npm$ReactNavigation$SafeAreaViewForceInsetValue,
    vertical?: $npm$ReactNavigation$SafeAreaViewForceInsetValue,
    horizontal?: $npm$ReactNavigation$SafeAreaViewForceInsetValue,
  },
  children?: React$Node,
  style?: $npm$ReactNavigation$AnimatedViewStyleProp,
};

type $npm$ReactNavigation$HeaderTitleProps = {
  children: React$Node,
  selectionColor?: string | number,
  style?: $npm$ReactNavigation$AnimatedTextStyleProp,
};

type $npm$ReactNavigation$HeaderBackButtonProps = {
  onPress?: () => void,
  pressColorAndroid?: string,
  title?: ?string,
  titleStyle?: ?$npm$ReactNavigation$TextStyleProp,
  tintColor?: ?string,
  truncatedTitle?: ?string,
  width?: ?number,
};

type $npm$ReactNavigation$DrawerViewProps = {
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
  drawerWidth: number | (() => number),
  drawerPosition: 'left' | 'right',
  drawerOpenRoute: string,
  drawerCloseRoute: string,
  drawerToggleRoute: string,
  contentComponent: React$ElementType,
  contentOptions?: {},
  style?: $npm$ReactNavigation$ViewStyleProp,
  useNativeAnimations: boolean,
  drawerBackgroundColor: string,
  screenProps?: {},
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  router: $npm$ReactNavigation$NavigationRouter<$npm$ReactNavigation$NavigationState, $npm$ReactNavigation$NavigationDrawerScreenOptions>,
};

type $npm$ReactNavigation$DrawerScene = {
  route: $npm$ReactNavigation$NavigationRoute,
  focused: boolean,
  index: number,
  tintColor?: string,
};

type $npm$ReactNavigation$DrawerItem = {
  route: $npm$ReactNavigation$NavigationRoute,
  focused: boolean,
};

type $npm$ReactNavigation$DrawerItemsProps = {
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  items: Array<$npm$ReactNavigation$NavigationRoute>,
  activeItemKey?: ?string,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: $npm$ReactNavigation$DrawerScene) => ?(React$Node | string),
  renderIcon: (scene: $npm$ReactNavigation$DrawerScene) => ?React$Node,
  onItemPress: (info: $npm$ReactNavigation$DrawerItem) => void,
  itemsContainerForceInset?: Object,
  itemsContainerStyle?: $npm$ReactNavigation$ViewStyleProp,
  itemStyle?: $npm$ReactNavigation$ViewStyleProp,
  labelStyle?: $npm$ReactNavigation$TextStyleProp,
  activeLabelStyle?: $npm$ReactNavigation$TextStyleProp,
  inactiveLabelStyle?: $npm$ReactNavigation$TextStyleProp,
  iconContainerStyle?: $npm$ReactNavigation$ViewStyleProp,
  drawerPosition: 'left' | 'right',
};

type $npm$ReactNavigation$TabViewProps = {
  tabBarComponent?: React$ElementType,
  tabBarPosition?: 'top' | 'bottom',
  tabBarOptions?: {},
  swipeEnabled?: boolean,
  animationEnabled?: boolean,
  configureTransition?: (
    currentTransitionProps: Object,
    nextTransitionProps: Object
  ) => Object,
  initialLayout: $npm$ReactNavigation$TabViewLayout,
  screenProps?: {},
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  router: $npm$ReactNavigation$NavigationRouter<$npm$ReactNavigation$NavigationState, $npm$ReactNavigation$NavigationTabScreenOptions>,
};

type $npm$ReactNavigation$TabBarTopProps = {
  activeTintColor: string,
  inactiveTintColor: string,
  showIcon: boolean,
  showLabel: boolean,
  upperCaseLabel: boolean,
  allowFontScaling: boolean,
  position: $npm$ReactNavigation$AnimatedValue,
  tabBarPosition: string,
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  jumpToIndex: (index: number) => void,
  getLabel: (scene: $npm$ReactNavigation$TabScene) => ?(React$Node | string),
  getOnPress: (
    previousScene: $npm$ReactNavigation$NavigationRoute,
    scene: $npm$ReactNavigation$TabScene
  ) => ({
    previousScene: $npm$ReactNavigation$NavigationRoute,
    scene: $npm$ReactNavigation$TabScene,
    jumpToIndex: (index: number) => void,
  }) => void,
  renderIcon: (scene: $npm$ReactNavigation$TabScene) => React$Element<*>,
  labelStyle?: $npm$ReactNavigation$TextStyleProp,
  iconStyle?: $npm$ReactNavigation$ViewStyleProp,
};

type $npm$ReactNavigation$TabBarBottomProps = {
  activeTintColor: string,
  activeBackgroundColor: string,
  adaptive?: boolean,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  showLabel: boolean,
  showIcon: boolean,
  allowFontScaling: boolean,
  position: $npm$ReactNavigation$AnimatedValue,
  navigation: $npm$ReactNavigation$NavigationScreenProp<$npm$ReactNavigation$NavigationState>,
  jumpToIndex: (index: number) => void,
  getLabel: (scene: $npm$ReactNavigation$TabScene) => ?(React$Node | string),
  getOnPress: (
    previousScene: $npm$ReactNavigation$NavigationRoute,
    scene: $npm$ReactNavigation$TabScene
  ) => ({
    previousScene: $npm$ReactNavigation$NavigationRoute,
    scene: $npm$ReactNavigation$TabScene,
    jumpToIndex: (index: number) => void,
  }) => void,
  getTestIDProps: (scene: $npm$ReactNavigation$TabScene) => (scene: $npm$ReactNavigation$TabScene) => any,
  renderIcon: (scene: $npm$ReactNavigation$TabScene) => React$Node,
  style?: $npm$ReactNavigation$ViewStyleProp,
  animateStyle?: $npm$ReactNavigation$ViewStyleProp,
  labelStyle?: $npm$ReactNavigation$TextStyleProp,
  tabStyle?: $npm$ReactNavigation$ViewStyleProp,
  showIcon?: boolean,
};

// ---------------------------------------
// Module Definition
// ---------------------------------------

declare module 'react-navigation' {

  // ----------------- Exported Types ----------------------

  declare export type NavigationParams                            = $npm$ReactNavigation$NavigationParams;
  declare export type NavigationNavigateAction                    = $npm$ReactNavigation$NavigationNavigateAction;
  declare export type NavigationBackAction                        = $npm$ReactNavigation$NavigationBackAction;
  declare export type NavigationSetParamsAction                   = $npm$ReactNavigation$NavigationSetParamsAction;
  declare export type NavigationInitAction                        = $npm$ReactNavigation$NavigationInitAction;
  declare export type NavigationResetAction                       = $npm$ReactNavigation$NavigationResetAction;
  declare export type NavigationUriAction                         = $npm$ReactNavigation$NavigationUriAction;
  declare export type NavigationReplaceAction                     = $npm$ReactNavigation$NavigationReplaceAction;
  declare export type NavigationPopAction                         = $npm$ReactNavigation$NavigationPopAction;
  declare export type NavigationPopToTopAction                    = $npm$ReactNavigation$NavigationPopToTopAction;
  declare export type NavigationPushAction                        = $npm$ReactNavigation$NavigationPushAction;
  declare export type NavigationAction                            = $npm$ReactNavigation$NavigationAction;
  declare export type NavigationState                             = $npm$ReactNavigation$NavigationState;
  declare export type NavigationRoute                             = $npm$ReactNavigation$NavigationRoute;
  declare export type NavigationLeafRoute                         = $npm$ReactNavigation$NavigationLeafRoute;
  declare export type NavigationStateRoute                        = $npm$ReactNavigation$NavigationStateRoute;
  declare export type NavigationScreenOptionsGetter<Options: {}>  = $npm$ReactNavigation$NavigationScreenOptionsGetter<Options>;

  declare export type NavigationRouter<
    State: $npm$ReactNavigation$NavigationState,
    Options: {}
  >                                                               = $npm$ReactNavigation$NavigationRouter<State, Options>;

  declare export type NavigationScreenDetails<T>                  = $npm$ReactNavigation$NavigationScreenDetails<T>;
  declare export type NavigationScreenOptions                     = $npm$ReactNavigation$NavigationScreenOptions;
  declare export type NavigationScreenConfigProps                 = $npm$ReactNavigation$NavigationScreenConfigProps;
  declare export type NavigationScreenConfig<Options>             = $npm$ReactNavigation$NavigationScreenConfig<Options>;
  declare export type NavigationComponent                         = $npm$ReactNavigation$NavigationComponent;

  declare export type NavigationScreenComponent<
    Route: $npm$ReactNavigation$NavigationRoute,
    Options: {},
    Props: {}
  >                                                               = $npm$ReactNavigation$NavigationScreenComponent<Route, Options, Props>;

  declare export type NavigationNavigator<
    State: $npm$ReactNavigation$NavigationState,
    Options: {},
    Props: {}
  >                                                               = $npm$ReactNavigation$NavigationNavigator<State, Options, Props>;

  declare export type NavigationRouteConfig                       = $npm$ReactNavigation$NavigationRouteConfig;
  declare export type NavigationScreenRouteConfig                 = $npm$ReactNavigation$NavigationScreenRouteConfig;
  declare export type NavigationPathsConfig                       = $npm$ReactNavigation$NavigationPathsConfig;
  declare export type NavigationRouteConfigMap                    = $npm$ReactNavigation$NavigationRouteConfigMap;
  declare export type HeaderMode                                  = $npm$ReactNavigation$HeaderMode;
  declare export type HeaderProps                                 = $npm$ReactNavigation$HeaderProps;
  declare export type NavigationStackScreenOptions                = $npm$ReactNavigation$NavigationStackScreenOptions;
  declare export type NavigationStackRouterConfig                 = $npm$ReactNavigation$NavigationStackRouterConfig;
  declare export type NavigationStackViewConfig                   = $npm$ReactNavigation$NavigationStackViewConfig;
  declare export type StackNavigatorConfig                        = $npm$ReactNavigation$StackNavigatorConfig;
  declare export type NavigationSwitchRouterConfig                = $npm$ReactNavigation$NavigationSwitchRouterConfig;
  declare export type NavigationTabRouterConfig                   = $npm$ReactNavigation$NavigationTabRouterConfig;
  declare export type NavigationTabScreenOptions                  = $npm$ReactNavigation$NavigationTabScreenOptions;
  declare export type NavigationDrawerScreenOptions               = $npm$ReactNavigation$NavigationDrawerScreenOptions;
  declare export type NavigationDispatch                          = $npm$ReactNavigation$NavigationDispatch;
  declare export type NavigationProp<S>                           = $npm$ReactNavigation$NavigationProp<S>;
  declare export type EventType                                   = $npm$ReactNavigation$EventType;
  declare export type NavigationEventPayload                      = $npm$ReactNavigation$NavigationEventPayload;
  declare export type NavigationEventCallback                     = $npm$ReactNavigation$NavigationEventCallback;
  declare export type NavigationEventSubscription                 = $npm$ReactNavigation$NavigationEventSubscription;
  declare export type NavigationScreenProp<+S>                    = $npm$ReactNavigation$NavigationScreenProp<S>;
  declare export type NavigationNavigatorProps<O: {}, S: {}>      = $npm$ReactNavigation$NavigationNavigatorProps<O, S>;
  declare export type NavigationContainer<
    State: $npm$ReactNavigation$NavigationState,
    Options: {},
    Props: {}
  >                                                               = $npm$ReactNavigation$NavigationContainer<State, Options, Props>;
  declare export type NavigationContainerProps<S: {}, O: {}>      = $npm$ReactNavigation$NavigationContainerProps<S, O>;
  declare export type NavigationGestureDirection                  = $npm$ReactNavigation$NavigationGestureDirection;
  declare export type NavigationLayout                            = $npm$ReactNavigation$NavigationLayout;
  declare export type NavigationScene                             = $npm$ReactNavigation$NavigationScene;
  declare export type NavigationTransitionProps                   = $npm$ReactNavigation$NavigationTransitionProps;
  declare export type NavigationSceneRendererProps                = $npm$ReactNavigation$NavigationSceneRendererProps;
  declare export type NavigationTransitionSpec                    = $npm$ReactNavigation$NavigationTransitionSpec;
  declare export type TransitionConfig                            = $npm$ReactNavigation$TransitionConfig;
  declare export type NavigationAnimationSetter                   = $npm$ReactNavigation$NavigationAnimationSetter;
  declare export type NavigationStyleInterpolator                 = $npm$ReactNavigation$NavigationStyleInterpolator;
  declare export type LayoutEvent                                 = $npm$ReactNavigation$LayoutEvent;
  declare export type SceneIndicesForInterpolationInputRange      = $npm$ReactNavigation$SceneIndicesForInterpolationInputRange;
  declare export type NavigationSceneRenderer                   = () => React$Node;

  // ----------------- Exported Module ----------------------

  declare module.exports: {
    createNavigationContainer: <S: NavigationState, O: {}>(Component: NavigationNavigator<S, O, *>) => NavigationContainer<S, O, *>,

    StateUtils: {
      get: (state: NavigationState, key: string) => ?NavigationRoute,
      indexOf: (state: NavigationState, key: string) => number,
      has: (state: NavigationState, key: string) => boolean,
      push: (state: NavigationState, route: NavigationRoute) => NavigationState,
      pop: (state: NavigationState) => NavigationState,
      jumpToIndex: (state: NavigationState, index: number) => NavigationState,
      jumpTo: (state: NavigationState, key: string) => NavigationState,
      back: (state: NavigationState) => NavigationState,
      forward: (state: NavigationState) => NavigationState,
      replaceAt: (
        state: NavigationState,
        key: string,
        route: NavigationRoute
      ) => NavigationState,
      replaceAtIndex: (
        state: NavigationState,
        index: number,
        route: NavigationRoute
      ) => NavigationState,
      reset: (
        state: NavigationState,
        routes: Array<NavigationRoute>,
        index?: number
      ) => NavigationState,
    },

    addNavigationHelpers: <S: {}>(navigation: NavigationProp<S>) => NavigationScreenProp<S>,

    NavigationActions: {
      BACK: 'Navigation/BACK',
      INIT: 'Navigation/INIT',
      NAVIGATE: 'Navigation/NAVIGATE',
      RESET: 'Navigation/RESET',
      SET_PARAMS: 'Navigation/SET_PARAMS',
      URI: 'Navigation/URI',
      back: {
        (payload?: { key?: ?string }): NavigationBackAction,
        toString: () => string,
      },
      init: {
        (payload?: { params?: NavigationParams }): NavigationInitAction,
        toString: () => string,
      },
      navigate: {
        (payload: {
          routeName: string,
          params?: ?NavigationParams,
          action?: ?NavigationNavigateAction,
        }): NavigationNavigateAction,
        toString: () => string,
      },
      reset: {
        (payload: {
          index: number,
          key?: ?string,
          actions: Array<NavigationNavigateAction>,
        }): NavigationResetAction,
        toString: () => string,
      },
      setParams: {
        (payload: {
          key: string,
          params: NavigationParams,
        }): NavigationSetParamsAction,
        toString: () => string,
      },
      uri: {
        (payload: { uri: string }): NavigationUriAction,
        toString: () => string,
      },
    },

    createNavigator: <
      S: NavigationState,
      O: {},
      NavigatorConfig: {},
      NavigationViewProps: NavigationNavigatorProps<O, S>
    >(
      router: NavigationRouter<S, O>,
      routeConfigs?: NavigationRouteConfigMap,
      navigatorConfig?: NavigatorConfig
    ) => $npm$ReactNavigation$NavigatorCreator<NavigationViewProps, S, O>,

    StackNavigator: (
      routeConfigMap: NavigationRouteConfigMap,
      stackConfig?: StackNavigatorConfig
    ) => NavigationContainer<*, *, *>,

    TabNavigator: (
      routeConfigs: NavigationRouteConfigMap,
      config?: $npm$ReactNavigation$TabNavigatorConfig
    ) => NavigationContainer<*, *, *>,

    SwitchNavigator: (
      routeConfigs: NavigationRouteConfigMap,
      config?: $npm$ReactNavigation$SwitchNavigatorConfig
    ) => NavigationContainer<*, *, *>,

    DrawerNavigator: (
      routeConfigs: NavigationRouteConfigMap,
      config?: $npm$ReactNavigation$DrawerNavigatorConfig
    ) => NavigationContainer<*, *, *>,

    StackRouter: (
      routeConfigs: NavigationRouteConfigMap,
      stackConfig?: NavigationStackRouterConfig
    ) => NavigationRouter<*, NavigationStackScreenOptions>,

    TabRouter: (
      routeConfigs: NavigationRouteConfigMap,
      config?: NavigationTabRouterConfig
    ) => NavigationRouter<*, *>,

    Transitioner:           React$ComponentType<$npm$ReactNavigation$TransitionerProps>,
    CardStackTransitioner:  React$ComponentType<$npm$ReactNavigation$CardStackTransitionerProps>,
    CardStack:              React$ComponentType<$npm$ReactNavigation$CardStackProps>,
    Card:                   React$ComponentType<$npm$ReactNavigation$CardProps>,
    SafeAreaView:           React$ComponentType<$npm$ReactNavigation$SafeAreaViewProps>,
    Header:                 React$ComponentType<HeaderProps> & { HEIGHT: number },
    HeaderTitle:            React$ComponentType<$npm$ReactNavigation$HeaderTitleProps>,
    HeaderBackButton:       React$ComponentType<$npm$ReactNavigation$HeaderBackButtonProps>,
    DrawerView:             React$ComponentType<$npm$ReactNavigation$DrawerViewProps>,
    DrawerItems:            React$ComponentType<$npm$ReactNavigation$DrawerItemsProps>,
    TabView:                React$ComponentType<$npm$ReactNavigation$TabViewProps>,
    TabBarTop:              React$ComponentType<$npm$ReactNavigation$TabBarTopProps>,
    TabBarBottom:           React$ComponentType<$npm$ReactNavigation$TabBarBottomProps>,

    withNavigation: <Props: {}>(
      Component: React$ComponentType<Props>
    ) => React$ComponentType<
      $Diff<
        Props,
        {
          navigation: NavigationScreenProp<NavigationStateRoute> | void,
        }
        >
      >,

    withNavigationFocus: <Props: {}>(
      Component: React$ComponentType<Props>
    ) => React$ComponentType<$Diff<Props, { isFocused: boolean | void }>>,
  }
}
