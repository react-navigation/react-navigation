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
  routes: Array<Route<string> & { state?: NavigationState | PartialState }>;
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

export type PartialState = NavigationState & {
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

export type Router<Action extends NavigationAction> = {
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
  }): NavigationState;

  /**
   * Rehydrate the full navigation state from a given partial state.
   *
   * @param options.routeNames List of valid route names as defined in the screen components.
   * @param options.partialState Navigation state to rehydrate from.
   */
  getRehydratedState(options: {
    routeNames: string[];
    partialState: NavigationState | PartialState;
  }): NavigationState;

  /**
   * Take the current state and updated list of route names, and return a new state.
   *
   * @param state State object to update.
   * @param options.routeNames New list of route names.
   * @param options.initialRouteName Route to focus in the state.
   * @param options.initialParamsList Object containing initial params for each route.
   */
  getStateForRouteNamesChange(
    state: NavigationState,
    options: {
      routeNames: string[];
      initialRouteName: string;
      initialParamsList: ParamListBase;
    }
  ): NavigationState;

  /**
   * Take the current state and key of a route, and return a new state with the route focused
   *
   * @param state State object to apply the action on.
   * @param key Key of the route to focus.
   */
  getStateForRouteFocus(state: NavigationState, key: string): NavigationState;

  /**
   * Take the current state and action, and return a new state.
   * If the action cannot be handled, return `null`.
   *
   * @param state State object to apply the action on.
   * @param action Action object to apply.
   */
  getStateForAction(
    state: NavigationState,
    action: Action
  ): NavigationState | null;

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

export type NavigationProp<
  ParamList extends ParamListBase,
  ScreenOptions extends object = {}
> = {
  /**
   * Dispatch an action or an update function to the router.
   * The update function will receive the current state,
   *
   * @param action Action object or update function.
   */
  dispatch(
    action: NavigationAction | ((state: NavigationState) => NavigationState)
  ): void;

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
  reset(state: PartialState & { key?: string }): void;

  /**
   * Go back to the previous route in history.
   */
  goBack(): void;

  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Params object for the current route.
   * @routeName params Target route for setParam.
   */
  setParams<RouteName extends Extract<keyof ParamList, string>>(
    params: ParamList[RouteName],
    target: TargetRoute<RouteName>
  ): void;

  /**
   * Update the options for the route.
   * The options object will be shallow merged with default options object.
   *
   * @param options Options object for the route.
   */
  setOptions(options: Partial<ScreenOptions>): void;
} & PrivateValueStore<ParamList>;

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
  A extends NavigationProp<ParamListBase, object>,
  B extends NavigationProp<ParamListBase, object>
> = Omit<A & B, keyof NavigationProp<any, any>> &
  NavigationProp<
    (A extends NavigationProp<infer T, any> ? T : never) &
      (B extends NavigationProp<infer U, any> ? U : never),
    (A extends NavigationProp<any, infer O> ? O : never) &
      (B extends NavigationProp<any, infer P> ? P : never)
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
        navigation: NavigationProp<ParamList, ScreenOptions>;
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
