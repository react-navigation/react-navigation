// @flow

declare module 'react-navigation' {
  /**
   * First, a bunch of things we would love to import but instead must
   * reconstruct (mostly copy-pasted).
   */

  // This is a bastardization of the true StyleObj type located in
  // react-native/Libraries/StyleSheet/StyleSheetTypes. We unfortunately can't
  // import that here, and it's too lengthy (and consequently too brittle) to
  // copy-paste here either.
  declare type StyleObj =
    | null
    | void
    | number
    | false
    | ''
    | $ReadOnlyArray<StyleObj>
    | { [name: string]: any };
  declare type ViewStyleProp = StyleObj;
  declare type TextStyleProp = StyleObj;
  declare type AnimatedViewStyleProp = StyleObj;
  declare type AnimatedTextStyleProp = StyleObj;

  // This is copied from the Layout type in
  // react-native-tab-view/src/TabViewTypeDefinitions
  declare type TabViewLayout = {
    height: number,
    width: number,
  };

  // This is copied from react-native/Libraries/Image/ImageSource.js
  declare type ImageURISource = {
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
  declare type ImageSource = ImageURISource | number | Array<ImageURISource>;

  // This one is too large to copy. Actual definition is in
  // react-native/Libraries/Animated/src/nodes/AnimatedValue.js
  declare type AnimatedValue = Object;

  declare type HeaderForceInset = {
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

  declare export type NavigationParams = {
    [key: string]: mixed,
  };

  declare export type NavigationNavigateAction = {|
    type: 'Navigation/NAVIGATE',
    routeName: string,
    params?: NavigationParams,

    // The action to run inside the sub-router
    action?: NavigationNavigateAction,

    key?: string,
  |};

  declare export type NavigationBackAction = {|
    type: 'Navigation/BACK',
    key?: ?string,
  |};

  declare export type NavigationSetParamsAction = {|
    type: 'Navigation/SET_PARAMS',

    // The key of the route where the params should be set
    key: string,

    // The new params to merge into the existing route params
    params: NavigationParams,
  |};

  declare export type NavigationInitAction = {|
    type: 'Navigation/INIT',
    params?: NavigationParams,
  |};

  declare export type NavigationResetAction = {|
    type: 'Navigation/RESET',
    index: number,
    key?: ?string,
    actions: Array<NavigationNavigateAction>,
  |};

  declare export type NavigationUriAction = {|
    type: 'Navigation/URI',
    uri: string,
  |};

  declare export type NavigationReplaceAction = {|
    +type: 'Navigation/REPLACE',
    +key: string,
    +routeName: string,
    +params?: NavigationParams,
    +action?: NavigationNavigateAction,
  |};
  declare export type NavigationPopAction = {|
    +type: 'Navigation/POP',
    +n?: number,
    +immediate?: boolean,
  |};
  declare export type NavigationPopToTopAction = {|
    +type: 'Navigation/POP_TO_TOP',
    +immediate?: boolean,
  |};
  declare export type NavigationPushAction = {|
    +type: 'Navigation/PUSH',
    +routeName: string,
    +params?: NavigationParams,
    +action?: NavigationNavigateAction,
    +key?: string,
  |};

  declare export type NavigationAction =
    | NavigationInitAction
    | NavigationNavigateAction
    | NavigationReplaceAction
    | NavigationPopAction
    | NavigationPopToTopAction
    | NavigationPushAction
    | NavigationBackAction
    | NavigationSetParamsAction
    | NavigationResetAction;

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
  declare export type NavigationState = {
    /**
     * Index refers to the active child route in the routes array.
     */
    index: number,
    routes: Array<NavigationRoute>,
  };

  declare export type NavigationRoute =
    | NavigationLeafRoute
    | NavigationStateRoute;

  declare export type NavigationLeafRoute = {
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

  declare export type NavigationStateRoute = NavigationLeafRoute &
    NavigationState;

  /**
   * Router
   */

  declare export type NavigationScreenOptionsGetter<Options: {}> = (
    navigation: NavigationScreenProp<NavigationRoute>,
    screenProps?: {}
  ) => Options;

  declare export type NavigationRouter<State: NavigationState, Options: {}> = {
    /**
     * The reducer that outputs the new navigation state for a given action,
     * with an optional previous state. When the action is considered handled
     * but the state is unchanged, the output state is null.
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

  declare export type NavigationScreenDetails<T> = {
    options: T,
    state: NavigationRoute,
    navigation: NavigationScreenProp<NavigationRoute>,
  };

  declare export type NavigationScreenOptions = {
    title?: string,
  };

  declare export type NavigationScreenConfigProps = $Shape<{
    navigation: NavigationScreenProp<NavigationRoute>,
    screenProps: {},
  }>;

  declare export type NavigationScreenConfig<Options> =
    | Options
    | (({
        ...$Exact<NavigationScreenConfigProps>,
        navigationOptions: Options,
      }) => Options);

  declare export type NavigationComponent =
    | NavigationScreenComponent<NavigationRoute, *, *>
    | NavigationContainer<NavigationStateRoute, *, *>;

  declare export type NavigationScreenComponent<
    Route: NavigationRoute,
    Options: {},
    Props: {}
  > = React$ComponentType<NavigationNavigatorProps<Options, Route> & Props> &
    ({} | { navigationOptions: NavigationScreenConfig<Options> });

  declare export type NavigationNavigator<
    State: NavigationState,
    Options: {},
    Props: {}
  > = React$ComponentType<NavigationNavigatorProps<Options, State> & Props> & {
    router: NavigationRouter<State, Options>,
    navigationOptions?: ?NavigationScreenConfig<Options>,
  };

  declare export type NavigationRouteConfig =
    | NavigationComponent
    | ({
        navigationOptions?: NavigationScreenConfig<*>,
        path?: string,
      } & NavigationScreenRouteConfig);

  declare export type NavigationScreenRouteConfig =
    | {
        screen: NavigationComponent,
      }
    | {
        getScreen: () => NavigationComponent,
      };

  declare export type NavigationPathsConfig = {
    [routeName: string]: string,
  };

  declare export type NavigationRouteConfigMap = {
    [routeName: string]: NavigationRouteConfig,
  };

  /**
   * Header
   */

  declare export type HeaderMode = 'float' | 'screen' | 'none';

  declare export type HeaderProps = $Shape<
    NavigationSceneRendererProps & {
      mode: HeaderMode,
      router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
      getScreenDetails: NavigationScene => NavigationScreenDetails<
        NavigationStackScreenOptions
      >,
      leftInterpolator: (props: NavigationSceneRendererProps) => {},
      titleInterpolator: (props: NavigationSceneRendererProps) => {},
      rightInterpolator: (props: NavigationSceneRendererProps) => {},
    }
  >;

  /**
   * Stack Navigator
   */

  declare export type NavigationStackScreenOptions = NavigationScreenOptions & {
    header?: ?(React$Node | (HeaderProps => React$Node)),
    headerTransparent?: boolean,
    headerTitle?: string | React$Node | React$ElementType,
    headerTitleStyle?: AnimatedTextStyleProp,
    headerTitleAllowFontScaling?: boolean,
    headerTintColor?: string,
    headerLeft?: React$Node | React$ElementType,
    headerBackTitle?: string,
    headerBackImage?: ImageSource,
    headerTruncatedBackTitle?: string,
    headerBackTitleStyle?: TextStyleProp,
    headerPressColorAndroid?: string,
    headerRight?: React$Node,
    headerStyle?: ViewStyleProp,
    headerForceInset?: HeaderForceInset,
    headerBackground?: React$Node | React$ElementType,
    gesturesEnabled?: boolean,
    gestureResponseDistance?: { vertical?: number, horizontal?: number },
    gestureDirection?: 'default' | 'inverted',
  };

  declare export type NavigationStackRouterConfig = {|
    initialRouteName?: string,
    initialRouteParams?: NavigationParams,
    paths?: NavigationPathsConfig,
    navigationOptions?: NavigationScreenConfig<*>,
    initialRouteKey?: string,
  |};

  declare export type NavigationStackViewConfig = {|
    mode?: 'card' | 'modal',
    headerMode?: HeaderMode,
    headerTransitionPreset?: 'fade-in-place' | 'uikit',
    cardStyle?: ViewStyleProp,
    transitionConfig?: () => TransitionConfig,
    onTransitionStart?: () => void,
    onTransitionEnd?: () => void,
  |};

  declare export type StackNavigatorConfig = {|
    ...NavigationStackViewConfig,
    ...NavigationStackRouterConfig,
  |};

  /**
   * Switch Navigator
   */

  declare export type NavigationSwitchRouterConfig = {|
    initialRouteName?: string,
    initialRouteParams?: NavigationParams,
    paths?: NavigationPathsConfig,
    navigationOptions?: NavigationScreenConfig<*>,
    order?: Array<string>,
    backBehavior?: 'none' | 'initialRoute', // defaults to `'none'`
    resetOnBlur?: boolean, // defaults to `true`
  |};

  /**
   * Tab Navigator
   */

  declare export type NavigationTabRouterConfig = {|
    initialRouteName?: string,
    initialRouteParams?: NavigationParams,
    paths?: NavigationPathsConfig,
    navigationOptions?: NavigationScreenConfig<*>,
    // todo: type these as the real route names rather than 'string'
    order?: Array<string>,
    // Does the back button cause the router to switch to the initial tab
    backBehavior?: 'none' | 'initialRoute', // defaults `initialRoute`
  |};

  declare type TabScene = {
    route: NavigationRoute,
    focused: boolean,
    index: number,
    tintColor?: ?string,
  };

  declare export type NavigationTabScreenOptions = {|
    ...$Exact<NavigationScreenOptions>,
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
      scene: TabScene,
      jumpToIndex: (index: number) => void
    ) => void,
  |};

  /**
   * Drawer
   */

  declare export type NavigationDrawerScreenOptions = {|
    ...$Exact<NavigationScreenOptions>,
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

  declare export type NavigationDispatch = (
    action: NavigationAction
  ) => boolean;

  declare export type NavigationProp<S> = {
    +state: S,
    dispatch: NavigationDispatch,
  };

  declare export type EventType =
    | 'willFocus'
    | 'didFocus'
    | 'willBlur'
    | 'didBlur'
    | 'action';

  declare export type NavigationEventPayload = {
    type: EventType,
    action: NavigationAction,
    state: NavigationState,
    lastState: ?NavigationState,
  };

  declare export type NavigationEventCallback = (
    payload: NavigationEventPayload
  ) => void;

  declare export type NavigationEventSubscription = {
    remove: () => void,
  };

  declare export type NavigationScreenProp<+S> = {
    +state: S,
    dispatch: NavigationDispatch,
    goBack: (routeKey?: ?string) => boolean,
    navigate: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction
    ) => boolean,
    setParams: (newParams: NavigationParams) => boolean,
    addListener: (
      eventName: string,
      callback: NavigationEventCallback
    ) => NavigationEventSubscription,
    push: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction
    ) => boolean,
    replace: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction
    ) => boolean,
    pop: (n?: number, params?: { immediate?: boolean }) => boolean,
    popToTop: (params?: { immediate?: boolean }) => boolean,
  };

  declare export type NavigationNavigatorProps<O: {}, S: {}> = $Shape<{
    navigation: NavigationScreenProp<S>,
    screenProps?: {},
    navigationOptions?: O,
  }>;

  //declare export type NavigationNavigatorProps<O: {}, S: {}> =
  //  | {}
  //  | { navigation: NavigationScreenProp<S> }
  //  | { screenProps: {} }
  //  | { navigationOptions: O }
  //  | {
  //      navigation: NavigationScreenProp<S>,
  //      screenProps: {},
  //    }
  //  | {
  //      navigation: NavigationScreenProp<S>,
  //      navigationOptions: O,
  //    }
  //  | {
  //      screenProps: {},
  //      navigationOptions: O,
  //    }
  //  | {
  //      navigation: NavigationScreenProp<S>,
  //      screenProps: {},
  //      navigationOptions: O,
  //    };

  /**
   * Navigation container
   */

  declare export type NavigationContainer<
    State: NavigationState,
    Options: {},
    Props: {}
  > = React$ComponentType<NavigationContainerProps<State, Options> & Props> & {
    router: NavigationRouter<State, Options>,
    navigationOptions?: ?NavigationScreenConfig<Options>,
  };

  declare export type NavigationContainerProps<S: {}, O: {}> = $Shape<{
    uriPrefix?: string | RegExp,
    onNavigationStateChange?: ?(
      NavigationState,
      NavigationState,
      NavigationAction
    ) => void,
    navigation?: NavigationScreenProp<S>,
    screenProps?: *,
    navigationOptions?: O,
  }>;

  /**
   * Gestures, Animations, and Interpolators
   */

  declare export type NavigationGestureDirection = 'horizontal' | 'vertical';

  declare export type NavigationLayout = {
    height: AnimatedValue,
    initHeight: number,
    initWidth: number,
    isMeasured: boolean,
    width: AnimatedValue,
  };

  declare export type NavigationScene = {
    index: number,
    isActive: boolean,
    isStale: boolean,
    key: string,
    route: NavigationRoute,
  };

  declare export type NavigationTransitionProps = $Shape<{
    // The layout of the screen container
    layout: NavigationLayout,

    // The destination navigation state of the transition
    navigation: NavigationScreenProp<NavigationState>,

    // The progressive index of the transitioner's navigation state.
    position: AnimatedValue,

    // The value that represents the progress of the transition when navigation
    // state changes from one to another. Its numeric value will range from 0
    // to 1.
    //  progress.__getAnimatedValue() < 1 : transtion is happening.
    //  progress.__getAnimatedValue() == 1 : transtion completes.
    progress: AnimatedValue,

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
  }>;

  // The scene renderer props are nearly identical to the props used for
  // rendering a transition. The exception is that the passed scene is not the
  // active scene but is instead the scene that the renderer should render
  // content for.
  declare export type NavigationSceneRendererProps = NavigationTransitionProps;

  declare export type NavigationTransitionSpec = {
    duration?: number,
    // An easing function from `Easing`.
    easing?: (t: number) => number,
    // A timing function such as `Animated.timing`.
    timing?: (value: AnimatedValue, config: any) => any,
  };

  /**
   * Describes a visual transition from one screen to another.
   */
  declare export type TransitionConfig = {
    // The basics properties of the animation, such as duration and easing
    transitionSpec?: NavigationTransitionSpec,
    // How to animate position and opacity of the screen
    // based on the value generated by the transitionSpec
    screenInterpolator?: (props: NavigationSceneRendererProps) => {},
    // How to animate position and opacity of the header componetns
    // based on the value generated by the transitionSpec
    headerLeftInterpolator?: (props: NavigationSceneRendererProps) => {},
    headerTitleInterpolator?: (props: NavigationSceneRendererProps) => {},
    headerRightInterpolator?: (props: NavigationSceneRendererProps) => {},
    // The style of the container. Useful when a scene doesn't have
    // 100% opacity and the underlying container is visible.
    containerStyle?: ViewStyleProp,
  };

  declare export type NavigationAnimationSetter = (
    position: AnimatedValue,
    newState: NavigationState,
    lastState: NavigationState
  ) => void;

  declare export type NavigationSceneRenderer = () => React$Node;

  declare export type NavigationStyleInterpolator = (
    props: NavigationSceneRendererProps
  ) => AnimatedViewStyleProp;

  declare export type LayoutEvent = {
    nativeEvent: {
      layout: {
        x: number,
        y: number,
        width: number,
        height: number,
      },
    },
  };

  declare export type SceneIndicesForInterpolationInputRange = {
    first: number,
    last: number,
  };

  /**
   * Now we type the actual exported module
   */

  declare export function createNavigationContainer<S: NavigationState, O: {}>(
    Component: NavigationNavigator<S, O, *>
  ): NavigationContainer<S, O, *>;

  declare export var StateUtils: {
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
  };

  declare export function addNavigationHelpers<S: {}>(
    navigation: NavigationProp<S>
  ): NavigationScreenProp<S>;

  declare export var NavigationActions: {
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
  };

  declare type _RouterProp<S: NavigationState, O: {}> = {
    router: NavigationRouter<S, O>,
  };
  declare type _NavigatorCreator<
    NavigationViewProps: {},
    S: NavigationState,
    O: {}
  > = (
    NavigationView: React$ComponentType<_RouterProp<S, O> & NavigationViewProps>
  ) => NavigationNavigator<S, O, NavigationViewProps>;
  declare export function createNavigator<
    S: NavigationState,
    O: {},
    NavigatorConfig: {},
    NavigationViewProps: NavigationNavigatorProps<O, S>
  >(
    router: NavigationRouter<S, O>,
    routeConfigs?: NavigationRouteConfigMap,
    navigatorConfig?: NavigatorConfig
  ): _NavigatorCreator<NavigationViewProps, S, O>;

  declare export function StackNavigator(
    routeConfigMap: NavigationRouteConfigMap,
    stackConfig?: StackNavigatorConfig
  ): NavigationContainer<*, *, *>;

  declare type _TabViewConfig = {|
    tabBarComponent?: React$ElementType,
    tabBarPosition?: 'top' | 'bottom',
    tabBarOptions?: {},
    swipeEnabled?: boolean,
    animationEnabled?: boolean,
    configureTransition?: (
      currentTransitionProps: Object,
      nextTransitionProps: Object
    ) => Object,
    initialLayout?: TabViewLayout,
  |};
  declare type _TabNavigatorConfig = {|
    ...NavigationTabRouterConfig,
    ..._TabViewConfig,
    lazy?: boolean,
    removeClippedSubviews?: boolean,
    containerOptions?: void,
  |};
  declare export function TabNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _TabNavigatorConfig
  ): NavigationContainer<*, *, *>;
  declare type _SwitchNavigatorConfig = {|
    ...NavigationSwitchRouterConfig,
  |};
  declare export function SwitchNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _SwitchNavigatorConfig
  ): NavigationContainer<*, *, *>;

  declare type _DrawerViewConfig = {|
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
    drawerWidth?: number | (() => number),
    drawerPosition?: 'left' | 'right',
    drawerOpenRoute?: string,
    drawerCloseRoute?: string,
    drawerToggleRoute?: string,
    contentComponent?: React$ElementType,
    contentOptions?: {},
    style?: ViewStyleProp,
    useNativeAnimations?: boolean,
    drawerBackgroundColor?: string,
    screenProps?: {},
  |};
  declare type _DrawerNavigatorConfig = $Exact<{
    ...NavigationTabRouterConfig,
    ..._DrawerViewConfig,
    containerConfig?: void,
  }>;
  declare export function DrawerNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _DrawerNavigatorConfig
  ): NavigationContainer<*, *, *>;

  declare export function StackRouter(
    routeConfigs: NavigationRouteConfigMap,
    stackConfig?: NavigationStackRouterConfig
  ): NavigationRouter<*, NavigationStackScreenOptions>;

  declare export function TabRouter(
    routeConfigs: NavigationRouteConfigMap,
    config?: NavigationTabRouterConfig
  ): NavigationRouter<*, *>;

  declare type _TransitionerProps = {
    configureTransition: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: ?NavigationTransitionProps
    ) => NavigationTransitionSpec,
    navigation: NavigationScreenProp<NavigationState>,
    onTransitionEnd?: (...args: Array<mixed>) => void,
    onTransitionStart?: (...args: Array<mixed>) => void,
    render: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: ?NavigationTransitionProps
    ) => React$Node,
  };
  declare export var Transitioner: React$ComponentType<_TransitionerProps>;

  declare type _CardStackTransitionerProps = {
    headerMode: HeaderMode,
    mode: 'card' | 'modal',
    router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
    cardStyle?: ViewStyleProp,
    onTransitionStart?: () => void,
    onTransitionEnd?: () => void,
    /**
     * Optional custom animation when transitioning between screens.
     */
    transitionConfig?: () => TransitionConfig,
  } & NavigationNavigatorProps<NavigationStackScreenOptions, NavigationState>;
  declare export var CardStackTransitioner: React$ComponentType<
    _CardStackTransitionerProps
  >;

  declare type _CardStackProps = {
    screenProps?: {},
    headerMode: HeaderMode,
    headerComponent?: React$ElementType,
    mode: 'card' | 'modal',
    router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
    cardStyle?: ViewStyleProp,
    onTransitionStart?: () => void,
    onTransitionEnd?: () => void,
    /**
     * Optional custom animation when transitioning between screens.
     */
    transitionConfig?: () => TransitionConfig,
    // NavigationTransitionProps:
    layout: NavigationLayout,
    navigation: NavigationScreenProp<NavigationState>,
    position: AnimatedValue,
    progress: AnimatedValue,
    scenes: Array<NavigationScene>,
    scene: NavigationScene,
    index: number,
  };
  declare export var CardStack: React$ComponentType<_CardStackProps>;

  declare type _CardProps = {
    ...$Exact<NavigationSceneRendererProps>,
    children: React$Node,
    onComponentRef: React$Ref<*>,
    pointerEvents: string,
    style: any,
  };
  declare export var Card: React$ComponentType<_CardProps>;

  declare type _SafeAreaViewForceInsetValue = 'always' | 'never' | number;
  declare type _SafeAreaViewProps = {
    forceInset?: {
      top?: _SafeAreaViewForceInsetValue,
      bottom?: _SafeAreaViewForceInsetValue,
      left?: _SafeAreaViewForceInsetValue,
      right?: _SafeAreaViewForceInsetValue,
      vertical?: _SafeAreaViewForceInsetValue,
      horizontal?: _SafeAreaViewForceInsetValue,
    },
    children?: React$Node,
    style?: AnimatedViewStyleProp,
  };
  declare export var SafeAreaView: React$ComponentType<_SafeAreaViewProps>;

  declare export var Header: React$ComponentType<HeaderProps> & {
    HEIGHT: number,
  };

  declare type _HeaderTitleProps = {
    children: React$Node,
    selectionColor?: string | number,
    style?: AnimatedTextStyleProp,
  };
  declare export var HeaderTitle: React$ComponentType<_HeaderTitleProps>;

  declare type _HeaderBackButtonProps = {
    onPress?: () => void,
    pressColorAndroid?: string,
    title?: ?string,
    titleStyle?: ?TextStyleProp,
    tintColor?: ?string,
    truncatedTitle?: ?string,
    width?: ?number,
  };
  declare export var HeaderBackButton: React$ComponentType<
    _HeaderBackButtonProps
  >;

  declare type _DrawerViewProps = {
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
    drawerWidth: number | (() => number),
    drawerPosition: 'left' | 'right',
    drawerOpenRoute: string,
    drawerCloseRoute: string,
    drawerToggleRoute: string,
    contentComponent: React$ElementType,
    contentOptions?: {},
    style?: ViewStyleProp,
    useNativeAnimations: boolean,
    drawerBackgroundColor: string,
    screenProps?: {},
    navigation: NavigationScreenProp<NavigationState>,
    router: NavigationRouter<NavigationState, NavigationDrawerScreenOptions>,
  };
  declare export var DrawerView: React$ComponentType<_DrawerViewProps>;

  declare type _DrawerScene = {
    route: NavigationRoute,
    focused: boolean,
    index: number,
    tintColor?: string,
  };
  declare type _DrawerItem = {
    route: NavigationRoute,
    focused: boolean,
  };
  declare type _DrawerItemsProps = {
    navigation: NavigationScreenProp<NavigationState>,
    items: Array<NavigationRoute>,
    activeItemKey?: ?string,
    activeTintColor?: string,
    activeBackgroundColor?: string,
    inactiveTintColor?: string,
    inactiveBackgroundColor?: string,
    getLabel: (scene: _DrawerScene) => ?(React$Node | string),
    renderIcon: (scene: _DrawerScene) => ?React$Node,
    onItemPress: (info: _DrawerItem) => void,
    itemsContainerForceInset?: Object,
    itemsContainerStyle?: ViewStyleProp,
    itemStyle?: ViewStyleProp,
    labelStyle?: TextStyleProp,
    activeLabelStyle?: TextStyleProp,
    inactiveLabelStyle?: TextStyleProp,
    iconContainerStyle?: ViewStyleProp,
    drawerPosition: 'left' | 'right',
  };
  declare export var DrawerItems: React$ComponentType<_DrawerItemsProps>;

  declare type _TabViewProps = {
    tabBarComponent?: React$ElementType,
    tabBarPosition?: 'top' | 'bottom',
    tabBarOptions?: {},
    swipeEnabled?: boolean,
    animationEnabled?: boolean,
    configureTransition?: (
      currentTransitionProps: Object,
      nextTransitionProps: Object
    ) => Object,
    initialLayout: TabViewLayout,
    screenProps?: {},
    navigation: NavigationScreenProp<NavigationState>,
    router: NavigationRouter<NavigationState, NavigationTabScreenOptions>,
  };
  declare export var TabView: React$ComponentType<_TabViewProps>;

  declare type _TabBarTopProps = {
    activeTintColor: string,
    inactiveTintColor: string,
    showIcon: boolean,
    showLabel: boolean,
    upperCaseLabel: boolean,
    allowFontScaling: boolean,
    position: AnimatedValue,
    tabBarPosition: string,
    navigation: NavigationScreenProp<NavigationState>,
    jumpToIndex: (index: number) => void,
    getLabel: (scene: TabScene) => ?(React$Node | string),
    getOnPress: (
      previousScene: NavigationRoute,
      scene: TabScene
    ) => ({
      previousScene: NavigationRoute,
      scene: TabScene,
      jumpToIndex: (index: number) => void,
    }) => void,
    renderIcon: (scene: TabScene) => React$Element<*>,
    labelStyle?: TextStyleProp,
    iconStyle?: ViewStyleProp,
  };
  declare export var TabBarTop: React$ComponentType<_TabBarTopProps>;

  declare type _TabBarBottomProps = {
    activeTintColor: string,
    activeBackgroundColor: string,
    adaptive?: boolean,
    inactiveTintColor: string,
    inactiveBackgroundColor: string,
    showLabel: boolean,
    showIcon: boolean,
    allowFontScaling: boolean,
    position: AnimatedValue,
    navigation: NavigationScreenProp<NavigationState>,
    jumpToIndex: (index: number) => void,
    getLabel: (scene: TabScene) => ?(React$Node | string),
    getOnPress: (
      previousScene: NavigationRoute,
      scene: TabScene
    ) => ({
      previousScene: NavigationRoute,
      scene: TabScene,
      jumpToIndex: (index: number) => void,
    }) => void,
    getTestIDProps: (scene: TabScene) => (scene: TabScene) => any,
    renderIcon: (scene: TabScene) => React$Node,
    style?: ViewStyleProp,
    animateStyle?: ViewStyleProp,
    labelStyle?: TextStyleProp,
    tabStyle?: ViewStyleProp,
    showIcon?: boolean,
  };
  declare export var TabBarBottom: React$ComponentType<_TabBarBottomProps>;

  declare type _NavigationInjectedProps = {
    navigation: NavigationScreenProp<NavigationStateRoute>,
  };
  declare export function withNavigation<T: {}>(
    Component: React$ComponentType<T & _NavigationInjectedProps>
  ): React$ComponentType<T>;
  declare export function withNavigationFocus<T: {}>(
    Component: React$ComponentType<T & _NavigationInjectedProps>
  ): React$ComponentType<T>;
}
