import type {
  DefaultRouterOptions,
  InitialState,
  NavigationAction,
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
} from '@react-navigation/routers';
import type * as React from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList {}
  }
}

type Keyof<T extends {}> = Extract<keyof T, string>;

export type DefaultNavigatorOptions<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = DefaultRouterOptions<Keyof<ParamList>> & {
  /**
   * Optional ID for the navigator. Can be used with `navigation.getParent(id)` to refer to a parent.
   */
  id?: string;
  /**
   * Children React Elements to extract the route configuration from.
   * Only `Screen`, `Group` and `React.Fragment` are supported as children.
   */
  children: React.ReactNode;
  /**
   * Event listeners for all the screens in the navigator.
   */
  screenListeners?:
    | ScreenListeners<State, EventMap>
    | ((props: {
        route: RouteProp<ParamList>;
        navigation: any;
      }) => ScreenListeners<State, EventMap>);
  /**
   * Default options for all screens under this navigator.
   */
  screenOptions?:
    | ScreenOptions
    | ((props: {
        route: RouteProp<ParamList>;
        navigation: any;
      }) => ScreenOptions);
  /**
   * Default options specified by the navigator.
   * It receives the custom options in the arguments if a function is specified.
   */
  defaultScreenOptions?:
    | ScreenOptions
    | ((props: {
        route: RouteProp<ParamList>;
        navigation: any;
        options: ScreenOptions;
      }) => ScreenOptions);
};

export type EventMapBase = Record<
  string,
  { data?: any; canPreventDefault?: boolean }
>;

export type EventMapCore<State extends NavigationState> = {
  focus: { data: undefined };
  blur: { data: undefined };
  state: { data: { state: State } };
  beforeRemove: { data: { action: NavigationAction }; canPreventDefault: true };
};

export type EventArg<
  EventName extends string,
  CanPreventDefault extends boolean | undefined = false,
  Data = undefined
> = {
  /**
   * Type of the event (e.g. `focus`, `blur`)
   */
  readonly type: EventName;
  readonly target?: string;
} & (CanPreventDefault extends true
  ? {
      /**
       * Whether `event.preventDefault()` was called on this event object.
       */
      readonly defaultPrevented: boolean;
      /**
       * Prevent the default action which happens on this event.
       */
      preventDefault(): void;
    }
  : {}) &
  (undefined extends Data
    ? { readonly data?: Readonly<Data> }
    : { readonly data: Readonly<Data> });

export type EventListenerCallback<
  EventMap extends EventMapBase,
  EventName extends keyof EventMap
> = (
  e: EventArg<
    Extract<EventName, string>,
    EventMap[EventName]['canPreventDefault'],
    EventMap[EventName]['data']
  >
) => void;

export type EventConsumer<EventMap extends EventMapBase> = {
  /**
   * Subscribe to events from the parent navigator.
   *
   * @param type Type of the event (e.g. `focus`, `blur`)
   * @param callback Callback listener which is executed upon receiving the event.
   */
  addListener<EventName extends Keyof<EventMap>>(
    type: EventName,
    callback: EventListenerCallback<EventMap, EventName>
  ): () => void;
  removeListener<EventName extends Keyof<EventMap>>(
    type: EventName,
    callback: EventListenerCallback<EventMap, EventName>
  ): void;
};

export type EventEmitter<EventMap extends EventMapBase> = {
  /**
   * Emit an event to child screens.
   *
   * @param options.type Type of the event (e.g. `focus`, `blur`)
   * @param [options.data] Optional information regarding the event.
   * @param [options.target] Key of the target route which should receive the event.
   * If not specified, all routes receive the event.
   */
  emit<EventName extends Keyof<EventMap>>(
    options: {
      type: EventName;
      target?: string;
    } & (EventMap[EventName]['canPreventDefault'] extends true
      ? { canPreventDefault: true }
      : {}) &
      (undefined extends EventMap[EventName]['data']
        ? { data?: EventMap[EventName]['data'] }
        : { data: EventMap[EventName]['data'] })
  ): EventArg<
    EventName,
    EventMap[EventName]['canPreventDefault'],
    EventMap[EventName]['data']
  >;
};

export class PrivateValueStore<T extends [any, any, any]> {
  /**
   * UGLY HACK! DO NOT USE THE TYPE!!!
   *
   * TypeScript requires a type to be used to be able to infer it.
   * The type should exist as its own without any operations such as union.
   * So we need to figure out a way to store this type in a property.
   * The problem with a normal property is that it shows up in intelliSense.
   * Adding private keyword works, but the annotation is stripped away in declaration.
   * Turns out if we use an empty string, it doesn't show up in intelliSense.
   */
  protected ''?: T;
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
  dispatch(
    action: NavigationAction | ((state: State) => NavigationAction)
  ): void;

  /**
   * Navigate to a route in current navigation tree.
   *
   * @param name Name of the route to navigate to.
   * @param [params] Params object for the route.
   */
  navigate<RouteName extends keyof ParamList>(
    ...args: // this first condition allows us to iterate over a union type
    // This is to avoid getting a union of all the params from `ParamList[RouteName]`,
    // which will get our types all mixed up if a union RouteName is passed in.
    RouteName extends unknown
      ? // This condition checks if the params are optional,
        // which means it's either undefined or a union with undefined
        undefined extends ParamList[RouteName]
        ?
            | [screen: RouteName] // if the params are optional, we don't have to provide it
            | [screen: RouteName, params: ParamList[RouteName]]
        : [screen: RouteName, params: ParamList[RouteName]]
      : never
  ): void;

  /**
   * Navigate to a route in current navigation tree.
   *
   * @param route Object with `key` or `name` for the route to navigate to, and a `params` object.
   */
  navigate<RouteName extends keyof ParamList>(
    options: RouteName extends unknown
      ?
          | { key: string; params?: ParamList[RouteName]; merge?: boolean }
          | {
              name: RouteName;
              key?: string;
              params: ParamList[RouteName];
              merge?: boolean;
            }
      : never
  ): void;

  /**
   * Reset the navigation state to the provided state.
   *
   * @param state Navigation state object.
   */
  reset(state: PartialState<State> | State): void;

  /**
   * Go back to the previous route in history.
   */
  goBack(): void;

  /**
   * Check if the screen is focused. The method returns `true` if focused, `false` otherwise.
   * Note that this method doesn't re-render screen when the focus changes. So don't use it in `render`.
   * To get notified of focus changes, use `addListener('focus', cb)` and `addListener('blur', cb)`.
   * To conditionally render content based on focus state, use the `useIsFocused` hook.
   */
  isFocused(): boolean;

  /**
   * Check if dispatching back action will be handled by navigation.
   * Note that this method doesn't re-render screen when the result changes. So don't use it in `render`.
   */
  canGoBack(): boolean;

  /**
   * Returns the name of the navigator specified in the `name` prop.
   * If no name is specified, returns `undefined`.
   */
  getId(): string | undefined;

  /**
   * Returns the navigation helpers from a parent navigator based on the ID.
   * If an ID is provided, the navigation helper from the parent navigator with matching ID (including current) will be returned.
   * If no ID is provided, the navigation helper from the immediate parent navigator will be returned.
   *
   * @param id Optional ID of a parent navigator.
   */
  getParent<T = NavigationHelpers<ParamListBase> | undefined>(id?: string): T;

  /**
   * Returns the navigator's state.
   * Note that this method doesn't re-render screen when the result changes. So don't use it in `render`.
   */
  getState(): State;
} & PrivateValueStore<[ParamList, unknown, unknown]>;

export type NavigationHelpers<
  ParamList extends ParamListBase,
  EventMap extends EventMapBase = {}
> = NavigationHelpersCommon<ParamList> &
  EventEmitter<EventMap> & {
    /**
     * Update the param object for the route.
     * The new params will be shallow merged with the old one.
     *
     * @param params Params object for the current route.
     */
    setParams<RouteName extends keyof ParamList>(
      params: Partial<ParamList[RouteName]>
    ): void;
  };

export type NavigationContainerProps = {
  /**
   * Initial navigation state for the child navigators.
   */
  initialState?: InitialState;
  /**
   * Callback which is called with the latest navigation state when it changes.
   */
  onStateChange?: (state: NavigationState | undefined) => void;
  /**
   * Callback which is called when an action is not handled.
   */
  onUnhandledAction?: (action: NavigationAction) => void;
  /**
   * Whether this navigation container should be independent of parent containers.
   * If this is not set to `true`, this container cannot be nested inside another container.
   * Setting it to `true` disconnects any children navigators from parent container.
   */
  independent?: boolean;
  /**
   * Children elements to render.
   */
  children: React.ReactNode;
};

export type NavigationProp<
  ParamList extends {},
  RouteName extends keyof ParamList = Keyof<ParamList>,
  NavigatorID extends string | undefined = undefined,
  State extends NavigationState = NavigationState<ParamList>,
  ScreenOptions extends {} = {},
  EventMap extends EventMapBase = {}
> = Omit<NavigationHelpersCommon<ParamList, State>, 'getParent'> & {
  /**
   * Returns the navigation prop from a parent navigator based on the ID.
   * If an ID is provided, the navigation prop from the parent navigator with matching ID (including current) will be returned.
   * If no ID is provided, the navigation prop from the immediate parent navigator will be returned.
   *
   * @param id Optional ID of a parent navigator.
   */
  getParent<T = NavigationProp<ParamListBase> | undefined>(id?: NavigatorID): T;

  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Params object for the current route.
   */
  setParams(
    params: ParamList[RouteName] extends undefined
      ? undefined
      : Partial<ParamList[RouteName]>
  ): void;

  /**
   * Update the options for the route.
   * The options object will be shallow merged with default options object.
   *
   * @param options Options object for the route.
   */
  setOptions(options: Partial<ScreenOptions>): void;
} & EventConsumer<EventMap & EventMapCore<State>> &
  PrivateValueStore<[ParamList, RouteName, EventMap]>;

export type RouteProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = Keyof<ParamList>
> = Route<Extract<RouteName, string>, ParamList[RouteName]>;

export type CompositeNavigationProp<
  A extends NavigationProp<ParamListBase, string, any, any, any>,
  B extends NavigationHelpersCommon<ParamListBase, any>
> = Omit<A & B, keyof NavigationProp<any>> &
  NavigationProp<
    /**
     * Param list from both navigation objects needs to be combined
     * For example, we should be able to navigate to screens in both A and B
     */
    (A extends NavigationHelpersCommon<infer T> ? T : never) &
      (B extends NavigationHelpersCommon<infer U> ? U : never),
    /**
     * The route name should refer to the route name specified in the first type
     * Ideally it should work for any of them, but it's not possible to infer that way
     */
    A extends NavigationProp<any, infer R> ? R : string,
    /**
     * ID from both navigation objects needs to be combined for `getParent`
     */
    | (A extends NavigationProp<any, any, infer I> ? I : never)
    | (B extends NavigationProp<any, any, infer J> ? J : never),
    /**
     * The type of state should refer to the state specified in the first type
     */
    A extends NavigationProp<any, any, any, infer S> ? S : NavigationState,
    /**
     * Screen options from both navigation objects needs to be combined
     * This allows typechecking `setOptions`
     */
    (A extends NavigationProp<any, any, any, any, infer O> ? O : {}) &
      (B extends NavigationProp<any, any, any, any, infer P> ? P : {}),
    /**
     * Event consumer config should refer to the config specified in the first type
     * This allows typechecking `addListener`/`removeListener`
     */
    A extends NavigationProp<any, any, any, any, any, infer E> ? E : {}
  >;

export type CompositeScreenProps<
  A extends {
    navigation: NavigationProp<
      ParamListBase,
      string,
      string | undefined,
      any,
      any,
      any
    >;
    route: RouteProp<ParamListBase>;
  },
  B extends {
    navigation: NavigationHelpersCommon<any, any>;
  }
> = {
  navigation: CompositeNavigationProp<A['navigation'], B['navigation']>;
  route: A['route'];
};

export type Descriptor<
  ScreenOptions extends {},
  Navigation extends NavigationProp<any, any, any, any, any, any>,
  Route extends RouteProp<any, any>
> = {
  /**
   * Render the component associated with this route.
   */
  render(): JSX.Element;

  /**
   * Options for the route.
   */
  options: ScreenOptions;

  /**
   * Route object for the screen
   */
  route: Route;

  /**
   * Navigation object for the screen
   */
  navigation: Navigation;
};

export type ScreenListeners<
  State extends NavigationState,
  EventMap extends EventMapBase
> = Partial<{
  [EventName in keyof (EventMap & EventMapCore<State>)]: EventListenerCallback<
    EventMap,
    EventName
  >;
}>;

type ScreenComponentType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> =
  | React.ComponentType<{
      route: RouteProp<ParamList, RouteName>;
      navigation: any;
    }>
  | React.ComponentType<{}>;

export type RouteConfigComponent<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> =
  | {
      /**
       * React component to render for this screen.
       */
      component: ScreenComponentType<ParamList, RouteName>;
      getComponent?: never;
      children?: never;
    }
  | {
      /**
       * Lazily get a React component to render for this screen.
       */
      getComponent: () => ScreenComponentType<ParamList, RouteName>;
      component?: never;
      children?: never;
    }
  | {
      /**
       * Render callback to render content of this screen.
       */
      children: (props: {
        route: RouteProp<ParamList, RouteName>;
        navigation: any;
      }) => React.ReactNode;
      component?: never;
      getComponent?: never;
    };

export type RouteConfig<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = {
  /**
   * Optional key for this screen. This doesn't need to be unique.
   * If the key changes, existing screens with this name will be removed or reset.
   * Useful when we have some common screens and have conditional rendering.
   */
  navigationKey?: string;

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
        navigation: any;
      }) => ScreenOptions);

  /**
   * Event listeners for this screen.
   */
  listeners?:
    | ScreenListeners<State, EventMap>
    | ((props: {
        route: RouteProp<ParamList, RouteName>;
        navigation: any;
      }) => ScreenListeners<State, EventMap>);

  /**
   * Function to return an unique ID for this screen.
   * Receives an object with the route params.
   * For a given screen name, there will always be only one screen corresponding to an ID.
   * If `undefined` is returned, it acts same as no `getId` being specified.
   */
  getId?: ({ params }: { params: ParamList[RouteName] }) => string | undefined;

  /**
   * Initial params object for the route.
   */
  initialParams?: Partial<ParamList[RouteName]>;
} & RouteConfigComponent<ParamList, RouteName>;

export type RouteGroupConfig<
  ParamList extends ParamListBase,
  ScreenOptions extends {}
> = {
  /**
   * Optional key for the screens in this group.
   * If the key changes, all existing screens in this group will be removed or reset.
   */
  navigationKey?: string;

  /**
   * Navigator options for this screen.
   */
  screenOptions?:
    | ScreenOptions
    | ((props: {
        route: RouteProp<ParamList, keyof ParamList>;
        navigation: any;
      }) => ScreenOptions);
  /**
   * Children React Elements to extract the route configuration from.
   * Only `Screen`, `Group` and `React.Fragment` are supported as children.
   */
  children: React.ReactNode;
};

export type NavigationContainerEventMap = {
  /**
   * Event which fires when the navigation state changes.
   */
  state: {
    data: {
      /**
       * The updated state object after the state change.
       */
      state: NavigationState | PartialState<NavigationState> | undefined;
    };
  };
  /**
   * Event which fires when current options changes.
   */
  options: { data: { options: object } };
  /**
   * Event which fires when an action is dispatched.
   * Only intended for debugging purposes, don't use it for app logic.
   * This event will be emitted before state changes have been applied.
   */
  __unsafe_action__: {
    data: {
      /**
       * The action object which was dispatched.
       */
      action: NavigationAction;
      /**
       * Whether the action was a no-op, i.e. resulted any state changes.
       */
      noop: boolean;
      /**
       * Stack trace of the action, this will only be available during development.
       */
      stack: string | undefined;
    };
  };
};

export type NavigationContainerRef<ParamList extends {}> =
  NavigationHelpers<ParamList> &
    EventConsumer<NavigationContainerEventMap> & {
      /**
       * Reset the navigation state of the root navigator to the provided state.
       *
       * @param state Navigation state object.
       */
      resetRoot(state?: PartialState<NavigationState> | NavigationState): void;
      /**
       * Get the rehydrated navigation state of the navigation tree.
       */
      getRootState(): NavigationState;
      /**
       * Get the currently focused navigation route.
       */
      getCurrentRoute(): Route<string> | undefined;
      /**
       * Get the currently focused route's options.
       */
      getCurrentOptions(): object | undefined;
      /**
       * Whether the navigation container is ready to handle actions.
       */
      isReady(): boolean;
    };

export type NavigationContainerRefWithCurrent<ParamList extends {}> =
  NavigationContainerRef<ParamList> & {
    current: NavigationContainerRef<ParamList> | null;
  };

export type TypedNavigator<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigator extends React.ComponentType<any>
> = {
  /**
   * Navigator component which manages the child screens.
   */
  Navigator: React.ComponentType<
    Omit<
      React.ComponentProps<Navigator>,
      keyof DefaultNavigatorOptions<any, any, any, any>
    > &
      DefaultNavigatorOptions<ParamList, State, ScreenOptions, EventMap>
  >;
  /**
   * Component used for grouping multiple route configuration.
   */
  Group: React.ComponentType<RouteGroupConfig<ParamList, ScreenOptions>>;
  /**
   * Component used for specifying route configuration.
   */
  Screen: <RouteName extends keyof ParamList>(
    _: RouteConfig<ParamList, RouteName, State, ScreenOptions, EventMap>
  ) => null;
};

export type NavigatorScreenParams<
  ParamList,
  State extends NavigationState = NavigationState
> =
  | {
      screen?: never;
      params?: never;
      initial?: never;
      path?: string;
      state: PartialState<State> | State | undefined;
    }
  | {
      [RouteName in keyof ParamList]: undefined extends ParamList[RouteName]
        ? {
            screen: RouteName;
            params?: ParamList[RouteName];
            initial?: boolean;
            path?: string;
            state?: never;
          }
        : {
            screen: RouteName;
            params: ParamList[RouteName];
            initial?: boolean;
            path?: string;
            state?: never;
          };
    }[keyof ParamList];

export type PathConfig<ParamList extends {}> = {
  path?: string;
  exact?: boolean;
  parse?: Record<string, (value: string) => any>;
  stringify?: Record<string, (value: any) => string>;
  screens?: PathConfigMap<ParamList>;
  initialRouteName?: keyof ParamList;
};

export type PathConfigMap<ParamList extends {}> = {
  [RouteName in keyof ParamList]?: NonNullable<
    ParamList[RouteName]
  > extends NavigatorScreenParams<infer T, any>
    ? string | PathConfig<T>
    : string | Omit<PathConfig<{}>, 'screens' | 'initialRouteName'>;
};
