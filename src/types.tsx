import * as BaseActions from './BaseActions';

export type CommonAction = BaseActions.Action;

export type TargetRoute<RouteName extends string> =
  | RouteName
  | { name: RouteName }
  | { key: string };

export type NavigationState = {
  /**
   * Unique key for the navigation state.
   */
  key: string;
  /**
   * Index of the currently focused route.
   */
  index: number;
  /**
   * List of valid route names as defined in the screen components.
   */
  routeNames: string[];
  /**
   * List of rendered routes.
   */
  routes: Array<
    Route<string> & { state?: NavigationState | PartialState<NavigationState> }
  >;
  /**
   * Whether the navigation state has been rehydrated.
   */
  stale?: false;
};

export type InitialState = Omit<
  Omit<Omit<NavigationState, 'key'>, 'routes'>,
  'routeNames'
> & {
  key?: string;
  routeNames?: string[];
  routes: Array<Route<string> & { state?: InitialState }>;
};

export type PartialState<State extends NavigationState> = State & {
  stale: true;
  key?: undefined;
  routeNames?: undefined;
};

export type Route<RouteName extends string> = {
  /**
   * Unique key for the route.
   */
  key: string;
  /**
   * User-provided name for the route.
   */
  name: RouteName;
  /**
   * Params for the route.
   */
  params?: object;
};

export type NavigationAction = {
  type: string;
};

export type ActionCreators<Action extends NavigationAction> = {
  [key: string]: (...args: any) => Action;
};

export type Router<
  State extends NavigationState,
  Action extends NavigationAction
> = {
  /**
   * Initialize the navigation state.
   *
   * @param options.routeNames List of valid route names as defined in the screen components.
   * @param options.initialRouteName Route to focus in the state.
   * @param options.initialParamsList Object containing initial params for each route.
   */
  getInitialState(options: {
    routeNames: string[];
    initialRouteName: string;
    initialParamsList: ParamListBase;
  }): State;

  /**
   * Rehydrate the full navigation state from a given partial state.
   *
   * @param options.routeNames List of valid route names as defined in the screen components.
   * @param options.partialState Navigation state to rehydrate from.
   */
  getRehydratedState(options: {
    routeNames: string[];
    partialState: State | PartialState<State>;
  }): State;

  /**
   * Take the current state and updated list of route names, and return a new state.
   *
   * @param state State object to update.
   * @param options.routeNames New list of route names.
   * @param options.initialRouteName Route to focus in the state.
   * @param options.initialParamsList Object containing initial params for each route.
   */
  getStateForRouteNamesChange(
    state: State,
    options: {
      routeNames: string[];
      initialRouteName: string;
      initialParamsList: ParamListBase;
    }
  ): State;

  /**
   * Take the current state and key of a route, and return a new state with the route focused
   *
   * @param state State object to apply the action on.
   * @param key Key of the route to focus.
   */
  getStateForRouteFocus(state: State, key: string): State;

  /**
   * Take the current state and action, and return a new state.
   * If the action cannot be handled, return `null`.
   *
   * @param state State object to apply the action on.
   * @param action Action object to apply.
   */
  getStateForAction(state: State, action: Action): State | null;

  /**
   * Whether the action bubbles to other navigators
   * When an action isn't handled by current navigator, it can be passed to nested navigators
   *
   * @param action Action object to check.
   */
  shouldActionPropagateToChildren(action: NavigationAction): boolean;

  /**
   * Whether the action should also change focus in parent navigator
   *
   * @param action Action object to check.
   */
  shouldActionChangeFocus(action: NavigationAction): boolean;

  /**
   * Action creators for the router.
   */
  actionCreators?: ActionCreators<Action>;
};

export type ParamListBase = { [key: string]: object | undefined };

class PrivateValueStore<T> {
  /**
   * TypeScript requires a type to be actually used to be able to infer it.
   * This is a hacky way of storing type in a property without surfacing it in intellisense.
   */
  // @ts-ignore
  private __private_value_type?: T;
}

type NavigationHelpersCommon<
  ParamList extends ParamListBase,
  State extends NavigationState = NavigationState
> = {
  /**
   * Dispatch an action or an update function to the router.
   * The update function will receive the current state,
   *
   * @param action Action object or update function.
   */
  dispatch(action: NavigationAction | ((state: State) => State)): void;

  /**
   * Navigate to a route in current navigation tree.
   *
   * @param name Name of the route to navigate to.
   * @param [params] Params object for the route.
   */
  navigate<RouteName extends Extract<keyof ParamList, string>>(
    ...args: ParamList[RouteName] extends undefined
      ? [TargetRoute<RouteName>] | [TargetRoute<RouteName>, undefined]
      : [TargetRoute<RouteName>, ParamList[RouteName]]
  ): void;

  /**
   * Replace the current route with a new one.
   *
   * @param name Route name of the new route.
   * @param [params] Params object for the new route.
   */
  replace<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends undefined
      ? [RouteName] | [RouteName, undefined]
      : [RouteName, ParamList[RouteName]]
  ): void;

  /**
   * Reset the navigation state to the provided state.
   * If a key is provided, the state with matching key will be reset.
   *
   * @param state Navigation state object.
   */
  reset(state: PartialState<State> & { key?: string }): void;

  /**
   * Go back to the previous route in history.
   */
  goBack(): void;
} & PrivateValueStore<ParamList>;

export type NavigationHelpers<
  ParamList extends ParamListBase
> = NavigationHelpersCommon<ParamList> & {
  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Params object for the current route.
   * @param target Target route for updating params.
   */
  setParams<RouteName extends Extract<keyof ParamList, string>>(
    params: ParamList[RouteName],
    target: TargetRoute<RouteName>
  ): void;
};

export type NavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
  State extends NavigationState = NavigationState,
  ScreenOptions extends object = {}
> = NavigationHelpersCommon<ParamList, State> & {
  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Params object for the current route.
   * @param [target] Target route for updating params. Defaults to current route.
   */
  setParams<TargetRouteName extends keyof ParamList = RouteName>(
    params: ParamList[TargetRouteName],
    target?: TargetRoute<Extract<TargetRouteName, string>>
  ): void;

  /**
   * Update the options for the route.
   * The options object will be shallow merged with default options object.
   *
   * @param options Options object for the route.
   */
  setOptions(options: Partial<ScreenOptions>): void;
};

export type RouteProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> = Omit<Route<Extract<RouteName, string>>, 'params'> &
  (ParamList[RouteName] extends undefined
    ? {}
    : {
        /**
         * Params for this route
         */
        params: ParamList[RouteName];
      });

export type CompositeNavigationProp<
  A extends NavigationHelpersCommon<ParamListBase>,
  B extends NavigationHelpersCommon<ParamListBase>
> = Omit<A & B, keyof NavigationHelpersCommon<any>> &
  /**
   * We want the common helpers to combine param list from both navigation options
   * For example, we should be able to navigate to screens in both A and B
   */
  NavigationHelpersCommon<
    (A extends NavigationHelpersCommon<infer T> ? T : never) &
      (B extends NavigationHelpersCommon<infer U> ? U : never)
  >;

export type Descriptor<ScreenOptions extends object> = {
  /**
   * Render the component associated with this route.
   */
  render(): JSX.Element;

  /**
   * Options for the route.
   */
  options: ScreenOptions;
};

export type RouteConfig<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  ScreenOptions extends object
> = {
  /**
   * Route name of this screen.
   */
  name: RouteName;

  /**
   * Navigator options for this screen.
   */
  options?:
    | ScreenOptions
    | ((props: {
        route: RouteProp<ParamList, RouteName>;
        navigation: NavigationHelpers<ParamList>;
      }) => ScreenOptions);

  /**
   * Initial params object for the route.
   */
  initialParams?: ParamList[RouteName];
} & (
  | {
      /**
       * React component to render for this screen.
       */
      component: React.ComponentType<any>;
    }
  | {
      /**
       * Render callback to render content of this screen.
       */
      children: (props: any) => React.ReactNode;
    });

export type TypedNavigator<
  ParamList extends ParamListBase,
  ScreenOptions extends object,
  Navigator extends React.ComponentType<any>
> = {
  Navigator: React.ComponentType<
    React.ComponentProps<Navigator> & {
      /**
       * Route to focus on initial render.
       */
      initialRouteName?: keyof ParamList;
    }
  >;
  Screen: React.ComponentType<
    RouteConfig<ParamList, keyof ParamList, ScreenOptions>
  >;
};
