import type {
  CommonNavigationAction,
  DefaultRouterOptions,
  InitialState,
  NavigationAction,
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
  Router,
} from '@react-navigation/routers';
import type * as React from 'react';

import type {
  FlatType,
  KeyOf,
  NotUndefined,
  StandardSchemaV1,
  UnionToIntersection,
} from './utilities';

/**
 * Root navigator used in the app.
 * It's used for the global types in the app.
 * Users need to use module augmentation to add their navigator type:
 *
 * ```ts
 * // Navigator created with static or dynamic API
 * const RootStack = createStackNavigator({
 *   // ...
 * });
 *
 * type RootStackType = typeof RootStack;
 *
 * declare module '@react-navigation/core' {
 *   interface RootNavigator extends RootStackType {}
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootNavigator {}

/**
 * Theme object for the navigation components.
 * Custom properties can be added using declaration merging:
 *
 * ```ts
 * declare module '@react-navigation/core' {
 *   interface Theme extends NativeTheme {
 *     myCustomProperty: string;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Theme {}

export type RootParamList =
  RootNavigator extends PrivateValueStore<
    [infer ParamList extends {}, any, any, any]
  >
    ? ParamList
    : {};

/**
 * Actions dispatchable somewhere in the app's navigation tree, derived from the
 * augmented `RootNavigator`. Used where the surface is definitionally the app's
 * root tree (`NavigationContainerRef` with the root param list, and
 * `GenericNavigation` from a bare `useNavigation()`). The union covers every
 * navigator that actually exists in the app (custom navigators included), with
 * route names and params still checked.
 * Falls back to `Fallback` when `RootNavigator` isn't augmented.
 */
// Computed once (no type params) so the (potentially expensive) full-tree
// expansion is cached and reused across every `RootNavigationAction` consumer.
type RootNavigationActionUnion = ActionOfNavigationProp<
  NavigationListForNested<RootNavigator>[keyof NavigationListForNested<RootNavigator>]
>;

// An unaugmented `RootNavigator` is the empty interface (`keyof` is `never`), so
// fall back to `Fallback` and avoid instantiating the full-tree derivation. An
// augmented navigator has members (`Navigator`, `Screen`, `config`, …).
// A brand match isn't enough here: `{}` structurally satisfies `PrivateValueStore`
// because its only member is an optional protected property.
type RootNavigationAction<Fallback extends NavigationAction> = [
  keyof RootNavigator,
] extends [never]
  ? Fallback
  : RootNavigationActionUnion;

export type DefaultNavigatorOptions<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
> = DefaultRouterOptions<KeyOf<ParamList>> & {
  /**
   * Children React Elements to extract the route configuration from.
   * Only `Screen`, `Group` and `React.Fragment` are supported as children.
   */
  children: React.ReactNode;

  /**
   * Layout for the navigator.
   * Useful for wrapping with a component with access to navigator's state and options.
   */
  layout?:
    | ((props: {
        state: State;
        navigation: NavigationHelpers<ParamList>;
        descriptors: Record<
          string,
          Descriptor<
            ScreenOptions,
            NavigationProp<
              ParamList,
              keyof ParamList,
              State,
              ScreenOptions,
              EventMap
            >,
            ScreenRouteProp<ParamList>
          >
        >;
        children: React.ReactNode;
      }) => React.ReactElement)
    | undefined;

  /**
   * Event listeners for all the screens in the navigator.
   */
  screenListeners?:
    | (
        | ScreenListeners<State, EventMap>
        | ((props: {
            route: ScreenRouteProp<ParamList>;
            navigation: Navigation;
          }) => ScreenListeners<State, EventMap>)
      )
    | undefined;

  /**
   * Default options for all screens under this navigator.
   */
  screenOptions?:
    | (
        | ScreenOptions
        | ((props: {
            route: ScreenRouteProp<ParamList>;
            navigation: Navigation;
            theme: Theme;
          }) => ScreenOptions)
      )
    | undefined;

  /**
   * Layout for all screens under this navigator.
   */
  screenLayout?:
    | ((
        props: ScreenLayoutArgs<
          ParamList,
          keyof ParamList,
          ScreenOptions,
          Navigation
        >
      ) => React.ReactElement)
    | undefined;

  /**
   * A function returning overrides for the underlying router used by the navigator.
   * The overrides will be shallow merged onto the original router.
   * It receives the original router as an argument to the function.
   *
   * This must be a pure function and cannot reference outside dynamic variables.
   */
  router?:
    | (<Action extends NavigationAction>(
        original: Router<State, Action>
      ) => Partial<Router<State, Action>>)
    | undefined;

  /**
   * What should happen when the available route names change.
   * e.g. when different screens are rendered based on a condition.
   *
   * - 'firstMatch': Navigate to the first route in the new list of routes (default).
   * - 'lastUnhandled': Restore the last state that was unhandled due to conditional render.
   *
   * Example cases where previous state might have been unhandled:
   * - Opened a deep link to a screen, but a login screen was shown.
   * - Navigated to a screen containing a navigator, but a different screen was shown.
   * - Reset the navigator to a state with different routes not matching the current list of routes.
   *
   * In these cases, 'lastUnhandled' will reuse the unhandled state if present.
   * If there's no unhandled state, it will fallback to 'firstMatch' behavior.
   *
   * Caveats:
   * - Direct navigation is only handled for `NAVIGATE` actions.
   * - Unhandled state is restored only if the current state becomes invalid, i.e. it doesn't contain any currently defined screens.
   */
  routeNamesChangeBehavior?: ('firstMatch' | 'lastUnhandled') | undefined;
};

export type EventMapBase = Record<
  string,
  { data?: any; canPreventDefault?: boolean | undefined }
>;

export type EventMapCore<in out State extends NavigationState> = {
  focus: { data: undefined };
  blur: { data: undefined };
  state: { data: { state: State } };
  // The action can come from anywhere in the app's navigation tree (it bubbles
  // at runtime). It can't be the root-derived union here: `EventMapCore` is
  // embedded in every navigator's props, which `RootNavigationAction` has to
  // expand, so referencing it would be a value-level self-reference through the
  // augmented `RootNavigator`. Typed wide instead — re-dispatching needs a cast.
  beforeRemove: { data: { action: NavigationAction }; canPreventDefault: true };
};

export type EventArg<
  EventName,
  CanPreventDefault extends boolean | undefined = false,
  Data = undefined,
> = {
  /**
   * Type of the event (e.g. `focus`, `blur`)
   */
  readonly type: EventName;
  /**
   * Key of the route which received the event.
   */
  readonly target?: string | undefined;
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
    ? { readonly data?: Readonly<Data> | undefined }
    : { readonly data: Readonly<Data> });

export type EventListenerCallback<
  in out EventMap extends EventMapBase,
  in out EventName extends keyof EventMap,
  in out EventCanPreventDefault extends boolean | undefined =
    EventMap[EventName]['canPreventDefault'],
> = (
  e: EventArg<
    EventName,
    undefined extends EventCanPreventDefault ? false : EventCanPreventDefault,
    EventMap[EventName]['data']
  >
) => void;

export type EventConsumer<in out EventMap extends EventMapBase> = {
  /**
   * Subscribe to events from the parent navigator.
   *
   * @param type Type of the event (e.g. `focus`, `blur`)
   * @param callback Callback listener which is executed upon receiving the event.
   */
  addListener<EventName extends KeyOf<EventMap>>(
    type: EventName,
    callback: EventListenerCallback<EventMap, EventName>
  ): () => void;
  removeListener<EventName extends KeyOf<EventMap>>(
    type: EventName,
    callback: EventListenerCallback<EventMap, EventName>
  ): void;
};

export type EventEmitter<in out EventMap extends EventMapBase> = {
  /**
   * Emit an event to child screens.
   *
   * @param options.type Type of the event (e.g. `focus`, `blur`)
   * @param [options.data] Optional information regarding the event.
   * @param [options.target] Key of the target route which should receive the event.
   * If not specified, all routes receive the event.
   */
  emit<EventName extends KeyOf<EventMap>>(
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

export class PrivateValueStore<T extends [any, any, any, any]> {
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

type NavigatorLike =
  | {
      Navigator: React.ComponentType<any>;
      Screen: unknown;
      Group: unknown;
    }
  | {
      config: unknown;
      getComponent: () => React.ComponentType<any>;
    };

export type ParamListForNavigator<T extends {}> = T extends NavigatorLike
  ? T extends PrivateValueStore<[infer ParamList extends {}, any, any, any]>
    ? ParamList
    : T
  : T;

// Remove `undefined` before checking for nested navigator params.
// If nothing remains, avoid matching `never` against `NavigatorScreenParams`
type NestedNavigatorForScreenParams<T, Params = NotUndefined<T>> = [
  Params,
] extends [never]
  ? never
  : Params extends NavigatorScreenParams<infer Navigator>
    ? Navigator extends PrivateValueStore<[any, any, any, any]>
      ? Navigator extends NavigatorLike
        ? Navigator
        : never
      : never
    : never;

export type NestedNavigatorsForParamList<ParamList extends {}> = {
  [RouteName in keyof ParamList as NestedNavigatorForScreenParams<
    ParamList[RouteName]
  > extends never
    ? never
    : RouteName]: NestedNavigatorForScreenParams<ParamList[RouteName]>;
};

type NavigateOptions = {
  merge?: boolean | undefined;
  pop?: boolean | undefined;
};

type NavigationHelpersCommon<
  ParamList extends ParamListBase,
  State extends NavigationState = NavigationState,
  Action extends NavigationAction = CommonNavigationAction<ParamList>,
> = {
  /**
   * Dispatch an action or an update function to the router.
   * The update function will receive the current state,
   *
   * @param action Action object or update function.
   */
  dispatch(action: Action | ((state: Readonly<State>) => Action)): void;

  /**
   * Navigate to a screen in the current or parent navigator.
   * If we're already on the screen, update the params instead.
   *
   * @param screen Name of the route to navigate to.
   * @param [params] Params object for the route.
   * @param [options.merge] Whether to merge the params onto the route. Defaults to `false`.
   * @param [options.pop] Whether to pop routes in a stack to go back to the matching route. Defaults to `false`.
   */
  navigate<RouteName extends keyof ParamList>(
    ...args: // This condition allows us to iterate over a union type
    // This is to avoid getting a union of all the params from `ParamList[RouteName]`,
    // which will get our types all mixed up if a union RouteName is passed in.
    RouteName extends unknown
      ? // This condition checks if the params are optional,
        // which means it's either undefined or a union with undefined
        undefined extends ParamList[RouteName]
        ? [
            screen: RouteName,
            params?: ParamList[RouteName],
            options?: NavigateOptions,
          ]
        : [
            screen: RouteName,
            params: ParamList[RouteName],
            options?: NavigateOptions,
          ]
      : never
  ): void;

  /**
   * Preloads the route in current navigation tree.
   *
   * @param screen Name of the route to preload.
   * @param [params] Params object for the route.
   */
  preload<RouteName extends keyof ParamList>(
    ...args: RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName, params: ParamList[RouteName]]
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
   * Note that this method is non-reactive.
   * It doesn't re-render the component when the result changes.
   * So don't use it in `render`.
   *
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
   * Returns the navigator's state.
   * Note that this method is non-reactive.
   * It doesn't re-render the component when the result changes.
   * So don't use it in `render`.
   */
  getState(): State;
};

type ParamType<
  ParamList extends {},
  RouteName,
  IsPartial extends boolean = false,
> = RouteName extends keyof ParamList
  ? ParamList[RouteName] extends undefined
    ? undefined
    : IsPartial extends true
      ? Partial<ParamList[RouteName]>
      : ParamList[RouteName]
  : unknown;

type NavigationHelpersRoute<
  in out ParamList extends {},
  in out RouteName extends keyof ParamList = KeyOf<ParamList>,
> = {
  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Partial params object for the current route.
   */
  setParams(params: ParamType<ParamList, RouteName, true>): void;

  /**
   * Replace the param object for the route
   *
   * @param params Params object for the current route.
   */
  replaceParams(params: ParamType<ParamList, RouteName>): void;

  /**
   * Push new params for the route.
   * The params are not merged with previous params.
   * This adds an entry to navigation history.
   *
   * @param params Params object for the current route.
   */
  pushParams(params: ParamType<ParamList, RouteName>): void;
};

export type NavigationHelpers<
  ParamList extends ParamListBase,
  EventMap extends EventMapBase = {},
  Action extends NavigationAction = CommonNavigationAction<ParamList>,
> = NavigationHelpersCommon<ParamList, NavigationState, Action> &
  EventEmitter<EventMap> &
  NavigationHelpersRoute<ParamList, keyof ParamList> &
  PrivateValueStore<[ParamList, unknown, unknown, unknown]>;

export type NavigationContainerProps = {
  /**
   * Initial state object for the navigation tree.
   */
  initialState?: InitialState | undefined;
  /**
   * Callback which is called with the latest navigation state when it changes.
   */
  onStateChange?:
    | ((state: Readonly<NavigationState> | undefined) => void)
    | undefined;
  /**
   * Callback which is called after the navigation tree mounts.
   */
  onReady?: (() => void) | undefined;
  /**
   * Callback which is called when an action is not handled.
   */
  onUnhandledAction?:
    | ((action: Readonly<NavigationAction>) => void)
    | undefined;
  /**
   * Theme object for the UI elements.
   */
  theme?: Theme | undefined;
  /**
   * Children elements to render.
   */
  children: React.ReactNode;
};

// Everything in `NavigationProp` except `getParent` and the private brand.
// The composite navigation prop intersects this directly, so it doesn't have
// to walk `NavigationProp`'s members with `Omit` to drop `getParent`/the brand.
type NavigationPropBase<
  ParamList extends {},
  RouteName extends keyof ParamList = KeyOf<ParamList>,
  State extends NavigationState = NavigationState<ParamList>,
  ScreenOptions extends {} = {},
  EventMap extends EventMapBase = {},
  ActionHelpers extends Record<string, (...args: any) => void> = {},
  Action extends NavigationAction = CommonNavigationAction<ParamList>,
> = NavigationHelpersCommon<ParamList, State, Action> & {
  /**
   * Update the options for the route.
   * The options object will be shallow merged with default options object.
   *
   * @param options Partial options object for the current screen.
   */
  setOptions(options: Partial<ScreenOptions>): void;
} & NavigationHelpersRoute<ParamList, RouteName> &
  ActionHelpers &
  EventConsumer<EventMap & EventMapCore<State>>;

export type NavigationProp<
  ParamList extends {},
  RouteName extends keyof ParamList = KeyOf<ParamList>,
  State extends NavigationState = NavigationState<ParamList>,
  ScreenOptions extends {} = {},
  EventMap extends EventMapBase = {},
  ActionHelpers extends Record<string, (...args: any) => void> = {},
  Action extends NavigationAction = CommonNavigationAction<ParamList>,
> = NavigationPropBase<
  ParamList,
  RouteName,
  State,
  ScreenOptions,
  EventMap,
  ActionHelpers,
  Action
> & {
  /**
   * Returns the navigation prop of the parent screen.
   * If a route name is provided, the navigation prop from the parent screen with matching route name (including current) will be returned.
   * If no route name is provided, the navigation prop from the immediate parent screen will be returned.
   *
   * @param routeName Optional route name of a parent screen.
   */
  getParent(
    routeName: RouteName
  ): NavigationProp<
    ParamList,
    RouteName,
    State,
    ScreenOptions,
    EventMap,
    ActionHelpers,
    Action
  >;
  getParent():
    | NavigationProp<
        ParamListBase,
        string,
        NavigationState,
        {},
        {},
        {},
        // The parent navigator is by definition somewhere in the app's tree,
        // but its action union can't be derived here: `getParent` is a member of
        // `NavigationProp`, which the root-derived `RootNavigationAction` has to
        // expand, so referencing it here is a value-level self-reference through
        // the augmented `RootNavigator`. Accept any action (route names go
        // unchecked) rather than an unsound built-in-only union.
        NavigationAction
      >
    | undefined;
} & PrivateValueStore<[ParamList, RouteName, EventMap, ActionHelpers]>;

export type RouteProp<
  in out ParamList extends ParamListBase,
  in out RouteName extends keyof ParamList = KeyOf<ParamList>,
> = Route<Extract<RouteName, string>, ParamList[RouteName]>;

type ScreenRouteProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = KeyOf<ParamList>,
> = {
  [Name in Extract<RouteName, string>]: RouteProp<ParamList, Name>;
}[Extract<RouteName, string>];

export type CompositeNavigationProp<
  A extends NavigationProp<ParamListBase, any, any, any, any, {}, any>,
  B extends NavigationProp<ParamListBase, any, any, any, any, {}, any>,
> = CompositeNavigationPropInternal<
  A,
  B,
  /**
   * Param list from both navigation objects needs to be combined
   * For example, we should be able to navigate to screens in both A and B
   */
  ParamListOfNavigationProp<A> & ParamListOfNavigationProp<B>,
  /**
   * The route name should refer to the route name specified in the first type
   */
  RouteNameOfNavigationProp<A>,
  /**
   * Event map should refer to the config specified in the first type
   */
  EventMapOfNavigationProp<A>
>;

type CompositeNavigationPropInternal<
  A extends NavigationProp<ParamListBase, any, any, any, any, {}, any>,
  B extends NavigationProp<ParamListBase, any, any, any, any, {}, any>,
  ParamList extends {},
  RouteName extends keyof ParamList,
  EventMap extends EventMapBase,
> = // Action helpers are read from the private brand (4th slot) instead of
  // `Omit<A & B, keyof NavigationProp>`, which had to walk the whole (possibly
  // deeply composed) member set of `A & B` to drop the standard members.
  ActionHelpersOfNavigationProp<A> &
    ActionHelpersOfNavigationProp<B> &
    // Intersect the brand-free base directly instead of `Omit`-ing `getParent`
    // off a full `NavigationProp`, so we skip a mapped-type pass per composite.
    NavigationPropBase<
      ParamList,
      RouteName,
      StateOfNavigationProp<A>,
      ScreenOptionsOfNavigationProp<A>,
      EventMap,
      {},
      ActionOfNavigationProp<A> | ActionOfNavigationProp<B>
    > & {
      getParent: A['getParent'] & B['getParent'];
    } & PrivateValueStore<
      [
        ParamList,
        RouteName,
        EventMap,
        ActionHelpersOfNavigationProp<A> & ActionHelpersOfNavigationProp<B>,
      ]
    >;

type PrivateValueOfNavigationProp<T> =
  T extends PrivateValueStore<infer Value> ? Value : [never, unknown, {}, {}];

type ParamListOfNavigationProp<T> = PrivateValueOfNavigationProp<T>[0];

type RouteNameOfNavigationProp<T> = PrivateValueOfNavigationProp<T>[1];

type ActionHelpersOfNavigationProp<T> = PrivateValueOfNavigationProp<T>[3];

type StateOfNavigationProp<T> = T extends {
  getState: () => infer State extends NavigationState;
}
  ? State
  : NavigationState;

// Derive the action union structurally from `dispatch` since it isn't stored
// in the private brand. `dispatch`'s param is `Action | ((state) => Action)`,
// so the action union is read off the callback's return type (`infer _` absorbs
// the non-callback member). This is cheaper than inferring the whole param and
// stripping the callback with `Exclude`, which distributes over every member of
// the action union.
type ActionOfNavigationProp<T> = T extends {
  dispatch(
    action: ((...args: any) => infer Action extends NavigationAction) | infer _
  ): void;
}
  ? Action
  : NavigationAction;

type ScreenOptionsOfNavigationProp<T> = T extends {
  setOptions: (options: Partial<infer ScreenOptions>) => void;
}
  ? ScreenOptions
  : {};

type EventMapOfNavigationProp<T> = PrivateValueOfNavigationProp<T>[2];

export type CompositeScreenProps<
  in out A extends {
    navigation: NavigationProp<ParamListBase, string, any, any, any, {}, any>;
    route: RouteProp<ParamListBase>;
  },
  in out B extends {
    navigation: NavigationProp<ParamListBase, string, any, any, any, {}, any>;
  },
> = {
  navigation: CompositeNavigationProp<A['navigation'], B['navigation']>;
  route: A['route'];
};

export type ScreenLayoutArgs<
  in out ParamList extends ParamListBase,
  in out RouteName extends keyof ParamList,
  in out ScreenOptions extends {},
  in out Navigation,
> = {
  route: ScreenRouteProp<ParamList, RouteName>;
  options: ScreenOptions;
  navigation: Navigation;
  theme: Theme;
  children: React.ReactElement;
};

export type Descriptor<
  out ScreenOptions extends {},
  out Navigation extends NavigationProp<
    ParamListBase,
    any,
    any,
    any,
    any,
    {},
    any
  >,
  out Route extends RouteProp<any, any>,
> = {
  /**
   * Render the component associated with this route.
   */
  render(): React.JSX.Element;

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
  in out State extends NavigationState,
  in out EventMap extends EventMapBase,
> = Partial<{
  [EventName in keyof (EventMap & EventMapCore<State>)]: EventListenerCallback<
    EventMap & EventMapCore<State>,
    EventName
  >;
}>;

type ScreenComponentType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
> =
  | React.ComponentType<{
      route: RouteProp<ParamList, RouteName>;
      navigation: any;
    }>
  | React.ComponentType<{}>;

export type RouteConfigComponent<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
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

export type RouteConfigProps<
  in out ParamList extends ParamListBase,
  in out RouteName extends keyof ParamList,
  in out State extends NavigationState,
  in out ScreenOptions extends {},
  in out EventMap extends EventMapBase,
  in out Navigation,
> = {
  /**
   * Optional key for this screen. This doesn't need to be unique.
   * If the key changes, existing screens with this name will be removed or reset.
   * Useful when we have some common screens and have conditional rendering.
   */
  navigationKey?: string | undefined;

  /**
   * Route name of this screen.
   */
  name: RouteName;

  /**
   * Navigator options for this screen.
   */
  options?:
    | (
        | ScreenOptions
        | ((props: {
            route: RouteProp<ParamList, RouteName>;
            navigation: Navigation;
            theme: Theme;
          }) => ScreenOptions)
      )
    | undefined;

  /**
   * Event listeners for this screen.
   */
  listeners?:
    | (
        | ScreenListeners<State, EventMap>
        | ((props: {
            route: RouteProp<ParamList, RouteName>;
            navigation: Navigation;
          }) => ScreenListeners<State, EventMap>)
      )
    | undefined;

  /**
   * Layout for this screen.
   * Useful for wrapping the screen with custom containers.
   * e.g. for styling, error boundaries, suspense, etc.
   */
  layout?:
    | ((
        props: ScreenLayoutArgs<ParamList, RouteName, ScreenOptions, Navigation>
      ) => React.ReactElement)
    | undefined;

  /**
   * Function to return an unique ID for this screen.
   * Receives an object with the route params.
   * For a given screen name, there will always be only one screen corresponding to an ID.
   * If `undefined` is returned, it acts same as no `getId` being specified.
   */
  getId?:
    | (({
        params,
      }: {
        params: Readonly<ParamList[RouteName]>;
      }) => string | undefined)
    | undefined;

  /**
   * Initial params object for the route.
   */
  initialParams?: Partial<ParamList[RouteName]> | undefined;
};

export type RouteConfig<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
> = RouteConfigProps<
  ParamList,
  RouteName,
  State,
  ScreenOptions,
  EventMap,
  Navigation
> &
  RouteConfigComponent<ParamList, RouteName>;

export type RouteGroupConfig<
  in out ParamList extends ParamListBase,
  in out ScreenOptions extends {},
  in out Navigation,
> = {
  /**
   * Optional key for the screens in this group.
   * If the key changes, all existing screens in this group will be removed or reset.
   */
  navigationKey?: string | undefined;

  /**
   * Navigator options for this screen.
   */
  screenOptions?:
    | (
        | ScreenOptions
        | ((props: {
            route: ScreenRouteProp<ParamList>;
            navigation: Navigation;
            theme: Theme;
          }) => ScreenOptions)
      )
    | undefined;

  /**
   * Layout for the screens inside the group.
   * This will override the `screenLayout` of parent group or navigator.
   */
  screenLayout?:
    | (
        | ((
            props: ScreenLayoutArgs<
              ParamList,
              keyof ParamList,
              ScreenOptions,
              Navigation
            >
          ) => React.ReactElement)
        | {
            // FIXME: TypeScript doesn't seem to infer `navigation` correctly without this
          }
      )
    | undefined;

  /**
   * Children React Elements to extract the route configuration from.
   * Only `Screen`, `Group` and `React.Fragment` are supported as children.
   */
  children: React.ReactNode;
};

export type NavigationContainerEventMap = {
  /**
   * Event that fires when the navigation container is ready to be used.
   */
  ready: {
    data: undefined;
  };
  /**
   * Event that fires when the navigation state changes.
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
   * Event that fires when current options changes.
   */
  options: { data: { options: object } };
  /**
   * Event that fires when an action is dispatched.
   * Only intended for debugging purposes, don't use it for app logic.
   * This event will be emitted before state changes have been applied.
   */
  __unsafe_action__: {
    data: {
      /**
       * The action object that was dispatched.
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
  /**
   * Event that fires when an event is emitted.
   * Only intended for debugging purposes, don't use it for app logic.
   * This event will be emitted after all listeners have been called.
   */
  __unsafe_event__: {
    data: {
      /**
       * The type of the event that was emitted.
       */
      type: string;
      /**
       * The data object passed when emitting the event.
       */
      data?: unknown;
      /**
       * The key of the target route which received the event.
       */
      target?: string | undefined;
      /**
       * Whether `event.preventDefault()` was called on this event.
       */
      defaultPrevented?: boolean | undefined;
      /**
       * Prevent the default action which happens on this event.
       */
      preventDefault?: (() => void) | undefined;
    };
  };
};

/**
 * A stripped down NavigationProp if the navigator is not known.
 *
 * The hook can be used in `NavigationContainer` directly, not inside of a navigator.
 * So navigator specific methods won't be available.
 */
export type GenericNavigation<ParamList extends {}> = Omit<
  NavigationProp<
    ParamList,
    KeyOf<ParamList>,
    NavigationState<ParamList>,
    {},
    {},
    {},
    RootNavigationAction<CommonNavigationAction<ParamList>>
  >,
  'getState' | 'setParams' | 'replaceParams' | 'pushParams' | 'setOptions'
> & {
  /**
   * Returns the navigator's state.
   *
   * This may return `undefined` if used outside of a navigator,
   * as the navigator may not have rendered yet
   */
  getState(): NavigationState | undefined;

  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Partial params object for the current route.
   */
  setParams(
    // We don't know which route to set params for
    params: unknown
  ): void;

  /**
   * Replace the param object for the route
   *
   * @param params Params object for the current route.
   */
  replaceParams(
    // We don't know which route to replace params for
    params: unknown
  ): void;

  /**
   * Push new params for the route.
   * The params are not merged with previous params.
   * This adds an entry to navigation history.
   *
   * @param params Params object for the current route.
   */
  pushParams(
    // We don't know which route to push params for
    params: unknown
  ): void;

  /**
   * Update the options for the route.
   * The options object will be shallow merged with default options object.
   *
   * @param options Partial options object for the current screen.
   */
  setOptions(
    // We don't know which navigator to set options for
    options: unknown
  ): void;
};

export type RouteForName<
  ParamList extends {},
  RouteName extends string,
> = string extends RouteName
  ? // RouteName is a not a literal but `string`
    // Return union of all possible routes in the tree
    ParamListRoute<ParamList>
  : RouteForNameInternal<ParamList, RouteName>;

// Look up route object by checking each level and recursing into the nested param lists
// This avoids building a union of all routes, which doesn't scale on large trees
type RouteForNameInternal<ParamList extends {}, RouteName extends string> =
  | (RouteName extends KeyOf<ParamList>
      ? RouteProp<ParamList, RouteName>
      : never)
  | RouteForNameNested<NestedParamLists<ParamList>, RouteName>;

type RouteForNameNested<ParamLists, RouteName extends string> =
  // Distributes over the union of nested param lists
  // e.g. if ParamLists is A | B
  // TypeScript evaluates the branch once per member (A, then B)
  // and unions the outcomes
  ParamLists extends {} ? RouteForNameInternal<ParamLists, RouteName> : never;

/**
 * Union of param lists of the nested navigators in a param list.
 */
export type NestedParamLists<ParamList extends {}> = {
  [RouteName in keyof ParamList]: NavigatorScreenParams<{}> extends ParamList[RouteName]
    ? NotUndefined<ParamList[RouteName]> extends NavigatorScreenParams<infer T>
      ? ParamListForNavigator<T>
      : never
    : never;
}[keyof ParamList];

type ParamListRoute<ParamList extends {}> = {
  [RouteName in keyof ParamList]: NavigatorScreenParams<{}> extends ParamList[RouteName]
    ? NotUndefined<ParamList[RouteName]> extends NavigatorScreenParams<infer T>
      ?
          | ParamListRoute<ParamListForNavigator<T>>
          | RouteProp<ParamList, RouteName>
      : RouteProp<ParamList, RouteName>
    : RouteProp<ParamList, RouteName>;
}[keyof ParamList];

type MaybeParamListRoute<ParamList extends {}> = ParamList extends ParamListBase
  ? ParamListRoute<ParamList>
  : Route<string>;

type BasicNavigationComposite<
  Navigation extends NavigationProp<any, any, any, any, any, {}, any>,
  Parent extends NavigationProp<any, any, any, any, any, {}, any> | undefined,
> = Parent extends undefined
  ? Navigation
  : CompositeNavigationProp<Navigation, NonNullable<Parent>>;

type BasicNavigationList<
  ParamList extends {},
  ExcludedRouteNames,
  Parent extends NavigationProp<any, any, any, any, any, {}, any> | undefined,
> = UnionToIntersection<
  {
    [RouteName in keyof ParamList]: (NavigatorScreenParams<{}> extends ParamList[RouteName]
      ? NotUndefined<ParamList[RouteName]> extends NavigatorScreenParams<
          infer T
        >
        ? ParamListForNavigator<T> extends infer NestedParamList extends {}
          ? keyof NestedParamList extends ExcludedRouteNames
            ? {}
            : BasicNavigationList<
                NestedParamList,
                ExcludedRouteNames,
                NavigationProp<ParamList, RouteName>
              >
          : {}
        : {}
      : {}) &
      (RouteName extends ExcludedRouteNames
        ? {}
        : {
            [Key in RouteName]: BasicNavigationComposite<
              NavigationProp<ParamList, RouteName>,
              Parent
            >;
          });
  }[keyof ParamList]
>;

type InheritedParentParams<ParentParamList, ParamList> = {
  [K in keyof ParentParamList as K extends keyof ParamList
    ? never
    : string extends K
      ? never
      : K]: ParentParamList[K];
};

type GenericNavigationComposite<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  Parent,
> =
  Parent extends NavigationProp<any, any, any, any, any, {}, any>
    ? ParamListOfNavigationProp<Parent> extends infer ParentParamList
      ? NavigationProp<
          ParamList & InheritedParentParams<ParentParamList, ParamList>,
          RouteName
        > & { getParent: Parent['getParent'] }
      : never
    : NavigationProp<ParamList, RouteName>;

type NavigationListForScreenParams<
  T extends {},
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  ExcludedRouteNames,
  Parent extends NavigationProp<any, any, any, any, any, {}, any> | undefined,
> = T extends PrivateValueStore<[any, any, any, any]> & NavigatorLike
  ? NavigationListForNestedInternal<
      T,
      GenericNavigationComposite<ParamList, RouteName, Parent>
    >
  : NavigationListForParamListScreenParams<
      T,
      ParamList,
      RouteName,
      ExcludedRouteNames,
      Parent
    >;

type NavigationListForParamListScreenParams<
  T extends {},
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  ExcludedRouteNames,
  Parent extends NavigationProp<any, any, any, any, any, {}, any> | undefined,
> =
  // `T` is only ever a plain param list here, since navigators are routed to
  // `NavigationListForNestedInternal` by `NavigationListForScreenParams`.
  // So there's no navigator to unwrap with `ParamListForNavigator`.
  T extends ParamListBase
    ? BasicNavigationListForParamList<
        T,
        ExcludedRouteNames,
        GenericNavigationComposite<ParamList, RouteName, Parent>
      >
    : {};

type BasicNavigationListForParamList<
  ParamList extends ParamListBase,
  ExcludedRouteNames,
  Parent extends NavigationProp<any, any, any, any, any, {}, any> | undefined,
> = UnionToIntersection<
  {
    [RouteName in keyof ParamList]: (NavigatorScreenParams<{}> extends ParamList[RouteName]
      ? NotUndefined<ParamList[RouteName]> extends NavigatorScreenParams<
          infer T
        >
        ? NavigationListForScreenParams<
            T,
            ParamList,
            RouteName,
            ExcludedRouteNames,
            Parent
          >
        : {}
      : {}) &
      (RouteName extends ExcludedRouteNames
        ? {}
        : {
            [Key in RouteName]: GenericNavigationComposite<
              ParamList,
              RouteName,
              Parent
            >;
          });
  }[keyof ParamList]
>;

export type NavigationListForNavigator<Navigator> =
  Navigator extends PrivateValueStore<infer Value> ? Value[1] : {};

export type NavigationListForNested<Navigator> =
  NavigationListForNestedInternal<Navigator> extends infer NavigationList
    ? Navigator extends PrivateValueStore<[infer ParamList, any, any, any]>
      ? ParamList extends {}
        ? NavigationList &
            BasicNavigationList<ParamList, keyof NavigationList, undefined>
        : NavigationList
      : NavigationList
    : never;

type NavigationListForNestedInternal<
  Navigator,
  Parent = undefined,
  NavigatorList extends Record<string, any> =
    NavigationListForNavigator<Navigator>,
  Navigators = NestedNavigatorsOf<Navigator>,
  // This navigator's own routes, each composed with the accumulated parent.
  // It's threaded into the recursion as the parent for nested navigators so
  // each route is composed with its ancestors exactly once, instead of
  // re-wrapping the whole descendant list at every level (which is quadratic
  // in the nesting depth).
  ComposedList = ComposeNavigationList<NavigatorList, Parent>,
> = (Navigator extends {
  readonly config: {
    readonly screens?: infer Screens;
    readonly groups?: infer Groups;
  };
}
  ? ComposedList &
      NavigationListForScreens<ComposedList, Screens> &
      NavigationListForGroups<ComposedList, Groups>
  : ComposedList) &
  NavigationListForNestedNavigators<ComposedList, Navigators> &
  NavigationListForDynamicNestedParamLists<Navigator, ComposedList, Navigators>;

type NavigationListForDynamicNestedParamLists<
  Navigator,
  ParentList,
  Navigators,
> = Navigator extends { readonly config: unknown }
  ? {}
  : Navigator extends PrivateValueStore<[infer ParamList, any, any, any]>
    ? NavigationListForNestedParamLists<ParentList, ParamList, Navigators>
    : {};

// Map of route name to nested navigator type
// inferred from `NavigatorScreenParams<typeof Navigator>`
type NestedNavigatorsOf<Navigator> =
  Navigator extends PrivateValueStore<[any, any, any, infer Nesting]>
    ? Nesting extends Record<string, any>
      ? Nesting
      : {}
    : {};

// Like `NavigationListForScreens`, but reads nested navigators from the brand
// map instead of a static config.
type NavigationListForNestedNavigators<ParentList, Navigators> =
  UnionToIntersection<
    {
      [K in keyof Navigators]: K extends keyof ParentList
        ? NavigationListForNestedInternal<Navigators[K], ParentList[K]>
        : {};
    }[keyof Navigators]
  >;

// Fallback for dynamic nested routes declared through NavigatorScreenParams<ParamList>.
// Param-list branches expose generic navigation props, while nested navigator
// entries still recover their concrete navigator props.
type NavigationListForNestedParamLists<ParentList, ParamList, Navigators> =
  ParentList extends Record<string, any>
    ? ParamList extends ParamListBase
      ? UnionToIntersection<
          {
            [K in keyof ParamList]: K extends keyof Navigators
              ? {}
              : K extends keyof ParentList
                ? NavigatorScreenParams<{}> extends ParamList[K]
                  ? NotUndefined<ParamList[K]> extends NavigatorScreenParams<
                      infer T
                    >
                    ? NavigationListForScreenParams<
                        T,
                        ParamList,
                        K,
                        keyof ParentList,
                        ParentList[K]
                      >
                    : {}
                  : {}
                : {};
          }[keyof ParamList]
        >
      : {}
    : {};

// Compose every entry in a navigator's list with the accumulated parent.
// When there's no parent (root navigator), the list is returned as-is so the
// common shallow case doesn't pay for a redundant mapped type.
type ComposeNavigationList<NavigatorList extends Record<string, any>, Parent> =
  Parent extends NavigationProp<any, any, any, any, any, {}, any>
    ? {
        [K in keyof NavigatorList]: CompositeNavigationProp<
          NavigatorList[K],
          Parent
        >;
      }
    : NavigatorList;

type NavigationListForScreens<ParentList, Screens> = Screens extends {}
  ? UnionToIntersection<
      {
        // Only check screens with static config to avoid overly-complex types
        // Otherwise TypeScript fails to load the types due to complexity
        [K in keyof Screens]: Screens[K] extends { config: any }
          ? K extends keyof ParentList
            ? NavigationListForNestedInternal<Screens[K], ParentList[K]>
            : never
          : Screens[K] extends { screen: { config: any } }
            ? K extends keyof ParentList
              ? NavigationListForNestedInternal<
                  Screens[K]['screen'],
                  ParentList[K]
                >
              : never
            : never;
      }[keyof Screens]
    >
  : {};

type NavigationListForGroups<ParentList, Groups> = Groups extends {}
  ? UnionToIntersection<
      {
        [K in keyof Groups]: Groups[K] extends { screens: any }
          ? NavigationListForScreens<ParentList, Groups[K]['screens']>
          : never;
      }[keyof Groups]
    >
  : {};

// Default dispatchable actions for a container ref. When `ParamList` is the
// augmented `RootParamList`, derive the actions from the app's navigation tree.
// Otherwise (a ref with an explicit param list) fall back to common actions —
// callers can pass `Action` explicitly to dispatch router-specific or custom
// actions. Exported for internal reuse; not part of the public API.
export type DefaultContainerRefAction<ParamList extends {}> = [
  ParamList,
] extends [RootParamList]
  ? [RootParamList] extends [ParamList]
    ? RootNavigationAction<CommonNavigationAction<ParamList>>
    : CommonNavigationAction<ParamList>
  : CommonNavigationAction<ParamList>;

export type NavigationContainerRef<
  ParamList extends {},
  Action extends NavigationAction = DefaultContainerRefAction<ParamList>,
> = Omit<
  NavigationHelpers<ParamList, {}, Action>,
  keyof NavigationHelpersRoute<{}>
> &
  NavigationHelpersRoute<{}> &
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
    getCurrentRoute(): MaybeParamListRoute<ParamList> | undefined;
    /**
     * Get the currently focused route's options.
     */
    getCurrentOptions(): object | undefined;
    /**
     * Whether the navigation container is ready to handle actions.
     */
    isReady(): boolean;
    /**
     * Stub function for setOptions on navigation object for use with useNavigation.
     */
    setOptions(): never;
  };

export type NavigationContainerRefWithCurrent<
  ParamList extends {},
  Action extends NavigationAction = DefaultContainerRefAction<ParamList>,
> = NavigationContainerRef<ParamList, Action> & {
  current: NavigationContainerRef<ParamList, Action> | null;
};

export type NavigationListBase<in out ParamList extends ParamListBase> = {
  [RouteName in keyof ParamList]: unknown;
};

// Only use action helpers if all values are functions
type ActionHelpersOf<T> =
  T extends Record<string, (...args: any) => void> ? T : {};

export interface NavigatorTypeBagBase {
  ParamList: {};
  State: NavigationState;
  ScreenOptions: {};
  EventMap: {};
  ActionHelpers: {};
  Action: NavigationAction;
  NavigationList: {
    [RouteName in keyof this['ParamList']]: NavigationProp<
      this['ParamList'],
      RouteName,
      this['State'],
      this['ScreenOptions'],
      this['EventMap'],
      ActionHelpersOf<this['ActionHelpers']>,
      this['Action']
    >;
  };
  Navigator: React.ComponentType<any>;
}

/**
 * Adds a proper `ParamList` to a type bag interface
 * So it can be used as `this['ParamList']`
 */
export type NavigatorTypeBagFor<
  TypeBag extends NavigatorTypeBagBase,
  ParamList extends {},
> = TypeBag & { ParamList: ParamList };

export type NavigatorProps<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
  Navigator extends React.ComponentType<any>,
> = Omit<
  React.ComponentProps<Navigator>,
  keyof DefaultNavigatorOptions<any, any, any, any, any>
> &
  DefaultNavigatorOptions<
    ParamList,
    State,
    ScreenOptions,
    EventMap,
    Navigation
  >;

type TypedNavigatorStaticComponent<Bag extends NavigatorTypeBagBase> =
  React.ComponentType<
    Partial<
      Omit<
        NavigatorProps<
          Bag['ParamList'],
          Bag['State'],
          Bag['ScreenOptions'],
          Bag['EventMap'],
          Bag['NavigationList'][keyof Bag['ParamList']],
          Bag['Navigator']
        >,
        'children'
      >
    >
  >;

type TypedNavigatorStaticDecorated<Bag extends NavigatorTypeBagBase, Config> = {
  getComponent: () => React.ComponentType<{}>;
  config: Config;
} & PrivateValueStore<
  [Bag['ParamList'], Bag['NavigationList'], unknown, unknown]
>;

type TypedNavigatorStatic<
  in out Bag extends NavigatorTypeBagBase,
  in out Config,
> = {
  config: Config;
  with: (
    Component: React.ComponentType<{
      Navigator: TypedNavigatorStaticComponent<Bag>;
    }>
  ) => TypedNavigatorStaticDecorated<Bag, Config>;
  getComponent: () => TypedNavigatorStaticComponent<Bag>;
};

export type TypedNavigator<
  Bag extends NavigatorTypeBagBase,
  Config = unknown,
  Nesting = unknown,
> = (undefined extends Config
  ? TypedNavigatorInternal<
      Bag['ParamList'],
      Bag['State'],
      Bag['ScreenOptions'],
      Bag['EventMap'],
      Bag['NavigationList'],
      Bag['Navigator']
    >
  : TypedNavigatorStatic<Bag, Config>) &
  PrivateValueStore<
    [Bag['ParamList'], Bag['NavigationList'], unknown, Nesting]
  >;

type TypedNavigatorInternal<
  in out ParamList extends ParamListBase,
  in out State extends NavigationState,
  in out ScreenOptions extends {},
  in out EventMap extends EventMapBase,
  in out NavigationList extends NavigationListBase<ParamList>,
  in out Navigator extends React.ComponentType<any>,
> = {
  /**
   * Navigator component which manages the child screens.
   */
  Navigator: React.ComponentType<
    NavigatorProps<
      ParamList,
      State,
      ScreenOptions,
      EventMap,
      NavigationList[keyof ParamList],
      Navigator
    >
  >;
  /**
   * Component used for grouping multiple route configuration.
   */
  Group: React.ComponentType<
    RouteGroupConfig<ParamList, ScreenOptions, NavigationList[keyof ParamList]>
  >;
  /**
   * Component used for specifying route configuration.
   */
  Screen: <RouteName extends keyof ParamList>(
    _: RouteConfig<
      ParamList,
      RouteName,
      State,
      ScreenOptions,
      EventMap,
      NavigationList[RouteName]
    >
  ) => null;
};

declare const NavigatorScreenParamsSymbol: unique symbol;

type NavigatorScreenParamsBrand<T extends {}> = {
  // Preserve the original generic for inference without affecting assignability.
  // - The symbol key hides the property from normal object usage
  // - The actual type is intersected for inference
  // - The `any` makes the property effectively `any` for assignability
  readonly [NavigatorScreenParamsSymbol]?: any & { readonly type: T };
};

type NavigatorScreenParamsForParamList<ParamList extends {}> =
  | {
      screen?: never;
      params?: never;
      merge?: never;
      initial?: never;
      pop?: never;
      preload?: never;
      path?: string | undefined;
      state: PartialState<NavigationState> | NavigationState | undefined;
    }
  | {
      [RouteName in keyof ParamList]: undefined extends ParamList[RouteName]
        ? {
            screen: RouteName;
            params?: ParamList[RouteName] | undefined;
            merge?: boolean | undefined;
            initial?: boolean | undefined;
            path?: string | undefined;
            pop?: boolean | undefined;
            preload?: boolean | undefined;
            state?: never;
          }
        : {
            screen: RouteName;
            params: ParamList[RouteName];
            merge?: boolean | undefined;
            initial?: boolean | undefined;
            path?: string | undefined;
            pop?: boolean | undefined;
            preload?: boolean | undefined;
            state?: never;
          };
    }[keyof ParamList];

export type NavigatorScreenParams<ParamList extends {}> =
  NavigatorScreenParamsForParamList<ParamListForNavigator<ParamList>> &
    NavigatorScreenParamsBrand<ParamList>;

type ParseConfig<Params> = {
  [K in keyof Params]?:
    | ((value: string) => Params[K])
    | StandardSchemaV1<string | string[] | null | undefined, Params[K]>;
};

type StringifyConfig<Params> = {
  [K in keyof Params]?: (value: Params[K]) => string;
};

type PathConfigAlias<Params> = {
  /**
   * Path string to match against.
   * e.g. `/users/:id` will match `/users/1` and extract `id` param as `1`.
   */
  path: string;
  /**
   * Whether the path should be consider parent paths or use the exact path.
   * By default, paths are relating to the path config on the parent screen.
   * If `exact` is set to `true`, the parent path configuration is not used.
   */
  exact?: boolean | undefined;
  /**
   * An object mapping the param name to a parser function or a Standard Schema.
   *
   * @example
   * ```js
   * parse: {
   *   id: Number,
   *   date: (value) => new Date(value)
   * }
   * ```
   */
  parse?: ParseConfig<Params> | undefined;
  /**
   * Whether this path can resolve to multiple routes.
   * Both routes should specify `shared: true` for this to work.
   * By default, a path can only resolve to one route.
   *
   * This is useful when same screen used in multiple navigators,
   * e.g. tabs with stacks containing profile screen in each stack.
   *
   * The path defined first will be the canonical path.
   */
  shared?: boolean | undefined;
};

export type PathConfig<Params> = FlatType<
  Partial<Omit<PathConfigAlias<Params>, 'path'>> & {
    /**
     * Path string to match against.
     * e.g. `/users/:id` will match `/users/1` and extract `id` param as `1`.
     */
    path?: string | undefined;
    /**
     * An object mapping the param name to a function which converts the param value to a string.
     * By default, arrays and null are preserved for query params, and other values are converted using `String(value)`.
     * Keys are constrained to valid param names when Params type is provided.
     *
     * @example
     * ```js
     * stringify: {
     *   date: (value) => value.toISOString()
     * }
     * ```
     */
    stringify?: StringifyConfig<Params> | undefined;
    /**
     * Additional path alias that will be matched to the same screen.
     */
    alias?: (string | PathConfigAlias<Params>)[] | undefined;
  } & (NonNullable<Params> extends NavigatorScreenParams<infer ParamList>
      ? ParamListForNavigator<ParamList> extends infer ChildParamList extends {}
        ? {
            /**
             * Path configuration for child screens.
             */
            screens?: PathConfigMap<ChildParamList> | undefined;
            /**
             * Name of the initial route to use for the navigator when the path matches.
             */
            initialRouteName?:
              | Extract<keyof ChildParamList, string>
              | undefined;
          }
        : {}
      : {})
>;

export type PathConfigMap<ParamList extends {}> = {
  [RouteName in keyof ParamList]?:
    | string
    | PathConfig<ParamList[RouteName]>
    | undefined;
};
