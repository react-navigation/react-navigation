import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import { isValidElementType } from 'react-is';

import {
  combinePatternParts,
  getPatternParts,
  type PatternPart,
} from './getPatternParts';
import type {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationListBase,
  NavigatorScreenParams,
  NavigatorTypeBagBase,
  NavigatorTypeBagFor,
  PathConfig,
  PathConfigMap,
  RouteGroupConfig,
  ScreenListeners,
  Theme,
} from './types';
import { useRoute } from './useRoute';
import type {
  AnyToUnknown,
  FlatType,
  HasArguments,
  InferParamsFromLinking,
  KeysOf,
  StandardSchemaV1,
  UnionToIntersection,
  ValidPathPattern,
} from './utilities';

type ScreenComponentParams<T> = [T] extends [
  React.ComponentType<{ route: { params: infer Params } }>,
]
  ? Params
  : undefined;

type ParamsForScreenComponent<T> = [T] extends [(...args: any[]) => any]
  ? // Don't infer params from a parameterless function component
    // It'd infer `unknown` - but we want `undefined` if no params are accepted
    HasArguments<T> extends true
    ? ScreenComponentParams<T>
    : undefined
  : ScreenComponentParams<T>;

// If every nested route's params include `undefined`, the nested navigator
// itself can be omitted. Otherwise, require `NavigatorScreenParams`.
type ParamsForNestedNavigator<
  T extends { config: any },
  ParamList extends {} = StaticParamList<T>,
  Params = NavigatorScreenParams<ParamList>,
> = {
  // Map each route to `never` when params are optional, or name when params are required
  // If every route has optional params, the resulting union is `never`
  [RouteName in keyof ParamList]-?: undefined extends ParamList[RouteName]
    ? never
    : RouteName;
}[keyof ParamList] extends never
  ? Params | undefined
  : Params;

// If the screens were constructed from a `Record<K, V>`,
// the screen value (`T`) may be a union.
// A naked `T extends ...` conditional would distribute over every screen in the union,
// creating a large params union per route.
// Wrapping `T` in a tuple checks the union as a whole instead of distributing,
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type ParamsForScreen<T> = [T] extends [{ config: any }]
  ? ParamsForNestedNavigator<T>
  : [T] extends [React.ComponentType<any>]
    ? ParamsForScreenComponent<T>
    : undefined;

// Unlike `ParamsForScreen`, we want to distribute for `Record<string, Component | StaticNavigation>`
// This creates union like:
// `C extends C ? ParamsForScreen<C> : never) | (S extends S ? ParamsForScreen<S> : never)`
// `= ParamsForScreen<C> | ParamsForScreen<S>`
type ParamsForScreenEntry<T> = T extends T ? ParamsForScreen<T> : never;

// Only infer params from linking if it's a pattern (i.e., contains ':')
// or if parse is present for query params.
// This avoids inferring non-literals like 'string' without parse.
type ShouldInferFromLinking<Linking> = Linking extends {
  parse: Record<string, unknown>;
}
  ? true
  : Linking extends ValidPathPattern | { path: ValidPathPattern }
    ? true
    : false;

/**
 * Params type derived from both linking and screen.
 *
 * - Linking has no extractable params (no ':' in path, no `parse`): returns
 *   screen params alone.
 * - Linking has params + screen is a nested navigator: intersects path params
 *   with the navigator's screen params.
 * - Linking has params + screen is a component without route params: returns
 *   path params alone (avoids `LP & undefined = never`).
 * - Linking has params + screen has route params: intersects them.
 */
type ParamsForConfig<Linking, Screen, Params = ParamsForScreen<Screen>> =
  ShouldInferFromLinking<Linking> extends true
    ? [Screen] extends [{ config: any }]
      ? FlatType<InferParamsFromLinking<Linking>> & Params
      : undefined extends Params
        ? FlatType<InferParamsFromLinking<Linking>>
        : FlatType<InferParamsFromLinking<Linking> & Params>
    : Params;

type ParamListForScreens<Screens> = {
  [Key in KeysOf<Screens>]: Screens[Key] extends StaticScreenConfig<
    infer Linking,
    infer Screen,
    any,
    any,
    any,
    any,
    any
  >
    ? ParamsForConfig<Linking, Screen>
    : ParamsForScreenEntry<Screens[Key]>;
};

type ParamListForGroups<
  Groups extends
    | Readonly<{
        [key: string]: {
          screens: {};
        };
      }>
    | undefined,
> = Groups extends {
  [key: string]: {
    screens: infer Screens;
  };
}
  ? ParamListForScreens<UnionToIntersection<Screens>>
  : {};

type RouteTypeBase = {
  key: string;
  name: string;
  path?: string | undefined;
  history?: { type: 'params'; params: object }[] | undefined;
};

type RouteType<Params, P = AnyToUnknown<Params>> = Readonly<
  RouteTypeBase &
    (undefined extends Params
      ? {
          /**
           * Params for this route
           */
          params?: P;
        }
      : {
          /**
           * Params for this route
           */
          params: P;
        })
>;

type StaticScreenConfigLinkingAlias = {
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
  exact?: boolean;
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
  parse?: Record<
    string,
    | ((value: string) => unknown)
    | StandardSchemaV1<string | string[] | null | undefined, unknown>
  >;
  /**
   * An object mapping the param name to a function which converts the param value to a string.
   * By default, all params are converted to strings using `String(value)`.
   *
   * @example
   * ```js
   * stringify: {
   *   date: (value) => value.toISOString()
   * }
   * ```
   */
  stringify?: Record<string, (value: unknown) => string>;
  /**
   * Whether this path can resolve to multiple routes.
   * Both routes should specify `shared: true` for this to work.
   *
   * When automatic path generation is enabled,
   * screens using the same path pattern and the same screen component
   * or navigator will be automatically marked as shared.
   * Explicitly specifying the option overrides the automatic detection.
   *
   * This is useful when same screen used in multiple navigators,
   * e.g. tabs with stacks containing profile screen in each stack.
   *
   * The path defined first will be the canonical path.
   */
  shared?: boolean;
};

export type StaticScreenConfigLinking =
  | string
  | (StaticScreenConfigLinkingAlias & {
      /**
       * Additional path alias that will be matched to the same screen.
       */
      alias?: (string | StaticScreenConfigLinkingAlias)[];
      /**
       * Name of the initial route to use for the nested navigator when the path matches.
       */
      initialRouteName?: string | undefined;
      /**
       * Path configuration for child screens in the nested navigator.
       * Only supported when the screen renders a navigator with dynamic API.
       */
      screens?: PathConfigMap<ParamListBase> | undefined;
    })
  | null
  | undefined;

export type StaticScreenConfigScreen =
  | React.ComponentType<any>
  | StaticNavigation<any>;

export type StaticScreenConfig<
  Linking extends StaticScreenConfigLinking,
  Screen,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
  Params = ParamsForConfig<Linking, Screen>,
> = {
  /**
   * Static navigation config or Component to render for the screen.
   */
  screen: Screen;

  /**
   * Callback to determine whether the screen should be rendered or not.
   * This can be useful for conditional rendering of screens,
   *
   * e.g. - if you want to render a different screen for logged in users.
   *
   * You can use a custom hook to use custom logic to determine the return value.
   *
   * @example
   * ```js
   * if: useIsLoggedIn
   * ```
   */
  if?: () => boolean;

  /**
   * Navigator options for this screen.
   *
   * @example
   * ```js
   * options: {
   *  title: 'My Screen',
   * }
   * ```
   */
  options?:
    | ScreenOptions
    | ((props: {
        route: RouteType<Params>;
        navigation: Navigation;
        theme: Theme;
      }) => ScreenOptions);

  /**
   * Event listeners for this screen.
   *
   * @example
   * ```js
   * listeners: {
   *   blur: (event) => {
   *     ...
   *   },
   * }
   * ```
   */
  listeners?:
    | ScreenListeners<State, EventMap>
    | ((props: {
        route: RouteType<Params>;
        navigation: Navigation;
      }) => ScreenListeners<State, EventMap>);

  /**
   * Layout for this screen.
   *
   * @example
   * ```js
   * layout: ({ children, route, options, navigation, theme }) => {
   *   return (
   *     <MyWrapper>
   *       {children}
   *     </MyWrapper>
   *   );
   * }
   * ```
   *
   */
  layout?: (props: {
    route: RouteType<Params>;
    options: ScreenOptions;
    navigation: Navigation;
    theme: Theme;
    children: React.ReactElement;
  }) => React.ReactElement;

  /**
   * Initial params object for the route.
   *
   * @example
   * ```js
   * initialParams: {
   *   someParam: 'someValue'
   * }
   * ```
   */
  initialParams?: AnyToUnknown<Params extends object ? Partial<Params> : never>;

  /**
   * Function to return an unique ID for this screen.
   *
   * @example
   * ```js
   * getId: ({ params }) => params?.userId,
   * ```
   */
  getId?: (props: { params: AnyToUnknown<Params> }) => string | undefined;

  /**
   * Linking config for the screen.
   * This can be a string to specify the path, or an object with more options.
   *
   * @example
   * ```js
   * linking: {
   *   path: 'profile/:userId',
   *   parse: {
   *     userId: Number,
   *   },
   * },
   * ```
   */
  linking?: Linking;

  /**
   * Optional key for this screen.
   */
  navigationKey?: string;
};

export type StaticScreenFactory<in out Bag extends NavigatorTypeBagBase> = <
  const Linking extends StaticScreenConfigLinking,
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfig<
    Linking,
    Screen,
    Bag['State'],
    Bag['ScreenOptions'],
    Bag['EventMap'],
    Bag['NavigationList'][keyof Bag['ParamList']]
  >
) => StaticScreenConfig<
  Linking,
  Screen,
  Bag['State'],
  Bag['ScreenOptions'],
  Bag['EventMap'],
  Bag['NavigationList'][keyof Bag['ParamList']]
>;

/**
 * Helper to create a typed `createXScreen` for static configuration.
 */
export function createScreenFactory<
  TypeBag extends NavigatorTypeBagBase,
>(): StaticScreenFactory<NavigatorTypeBagFor<TypeBag, ParamListBase>> {
  return ((config: unknown) => config) as never;
}

type StaticConfigScreens<
  in out ParamList extends ParamListBase,
  in out State extends NavigationState,
  in out ScreenOptions extends {},
  in out EventMap extends EventMapBase,
  in out NavigationList extends NavigationListBase<ParamList>,
> = {
  [RouteName in keyof ParamList]:
    | StaticScreenConfigScreen
    | StaticScreenConfig<
        StaticScreenConfigLinking,
        StaticScreenConfigScreen,
        State,
        ScreenOptions,
        EventMap,
        NavigationList[RouteName],
        any
      >;
};

type StaticConfigGroup<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigationList extends NavigationListBase<ParamList>,
> = Omit<
  RouteGroupConfig<ParamList, ScreenOptions, NavigationList[keyof ParamList]>,
  'screens' | 'children'
> & {
  /**
   * Callback to determine whether the screens in the group should be rendered or not.
   * This can be useful for conditional rendering of group of screens.
   */
  if?: () => boolean;
  /**
   * Static navigation config or Component to render for the screen.
   */
  screens: StaticConfigScreens<
    ParamList,
    State,
    ScreenOptions,
    EventMap,
    NavigationList
  >;
};

export type StaticConfig<Bag extends NavigatorTypeBagBase> =
  StaticConfigInternal<
    Bag['ParamList'],
    Bag['State'],
    Bag['ScreenOptions'],
    Bag['EventMap'],
    Bag['NavigationList'],
    Bag['Navigator']
  >;

type StaticConfigInternal<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigationList extends NavigationListBase<ParamList>,
  Navigator extends React.ComponentType<any>,
  Screens = StaticConfigScreens<
    ParamList,
    State,
    ScreenOptions,
    EventMap,
    NavigationList
  >,
  Groups = {
    [key: string]: StaticConfigGroup<
      ParamList,
      State,
      ScreenOptions,
      EventMap,
      NavigationList
    >;
  },
> = Omit<
  Omit<
    React.ComponentProps<Navigator>,
    keyof DefaultNavigatorOptions<any, any, any, any, any>
  > &
    DefaultNavigatorOptions<
      ParamList,
      State,
      ScreenOptions,
      EventMap,
      NavigationList[keyof ParamList]
    >,
  'screens' | 'children'
> &
  (
    | {
        /**
         * Screens to render in the navigator and their configuration.
         */
        screens: Screens;
        /**
         * Groups of screens to render in the navigator and their configuration.
         */
        groups?: Groups;
      }
    | {
        /**
         * Screens to render in the navigator and their configuration.
         */
        screens?: Screens;
        /**
         * Groups of screens to render in the navigator and their configuration.
         */
        groups: Groups;
      }
  );

/**
 * Props for a screen component which is rendered by a static navigator.
 * Takes the route params as a generic argument.
 */
export type StaticScreenProps<
  in out T extends Record<string, unknown> | undefined,
> = {
  route: {
    params: T;
  };
};

/**
 * Infer the param list from the static navigation config.
 */
export type StaticParamList<
  T extends {
    readonly config: any;
  },
> = FlatType<
  ParamListForScreens<T['config']['screens']> &
    ParamListForGroups<T['config']['groups']>
>;

export type StaticNavigation<
  in out NavigatorTypeBag extends NavigatorTypeBagBase,
> = {
  config: StaticConfig<NavigatorTypeBag>;
  getComponent: () => React.ComponentType<{}>;
};

const MemoizedScreen = React.memo(
  <T extends React.ComponentType<any>>({ component }: { component: T }) => {
    const route = useRoute();
    const children = React.createElement(component, { route });

    return children;
  }
);

MemoizedScreen.displayName = 'Memo(Screen)';

const getItemsFromScreens = (
  Screen: React.ComponentType<any>,
  screens: StaticConfigScreens<any, any, any, any, any>
) => {
  return Object.entries(screens).map(([name, item]) => {
    let component: React.ComponentType<any> | undefined;
    let props: {} = {};
    let useIf: (() => boolean) | undefined;

    let isNavigator = false;

    if ('screen' in item) {
      const { screen, if: _if, ...rest } = item;

      useIf = _if;
      props = rest;

      if (isValidElementType(screen)) {
        component = screen;
      } else if ('config' in screen) {
        isNavigator = true;
        component = screen.getComponent();
      }
    } else if (isValidElementType(item)) {
      component = item;
    } else if ('config' in item) {
      isNavigator = true;
      component = item.getComponent();
    }

    if (component == null) {
      throw new Error(
        `Couldn't find a 'screen' property for the screen '${name}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`
      );
    }

    const element = isNavigator ? (
      React.createElement(component, {})
    ) : (
      <MemoizedScreen component={component} />
    );

    return () => {
      const shouldRender = useIf == null || useIf();

      if (!shouldRender) {
        return null;
      }

      return (
        <Screen key={name} name={name} {...props}>
          {() => element}
        </Screen>
      );
    };
  });
};

/**
 * Create a component that renders a navigator based on the static configuration.
 *
 * @param tree Static navigation config.
 * @param displayName Name of the component to be displayed in React DevTools.
 * @returns A component which renders the navigator.
 */
export function createComponentForStaticConfig<
  T extends {
    Navigator: React.ComponentType<any>;
    Group: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
    config: StaticConfig<NavigatorTypeBagBase>;
  },
>(
  tree: T,
  displayName: string
): React.ComponentType<Omit<React.ComponentProps<T['Navigator']>, 'children'>> {
  const { Navigator, Group, Screen, config } = tree;
  const { screens, groups, ...rest } = config;

  if (screens == null && groups == null) {
    throw new Error(
      "Couldn't find a 'screens' or 'groups' property. Make sure to define your screens under a 'screens' property in the configuration."
    );
  }

  const items: (() => React.JSX.Element | null)[] = [];

  // Loop through the config to find screens and groups
  // So we add the screens and groups in the same order as they are defined
  for (const key in config) {
    if (key === 'screens' && screens) {
      items.push(...getItemsFromScreens(Screen, screens));
    }

    if (key === 'groups' && groups) {
      items.push(
        ...Object.entries(groups).map(([key, { if: useIf, ...group }]) => {
          const groupItems = getItemsFromScreens(Screen, group.screens);

          return () => {
            // Call unconditionally since screen configs may contain `useIf` hooks
            const children = groupItems.map((item) => item());

            const shouldRender = useIf == null || useIf();

            if (!shouldRender) {
              return null;
            }

            return (
              <Group key={key} navigationKey={key} {...group}>
                {children}
              </Group>
            );
          };
        })
      );
    }
  }

  if (items.length === 0) {
    throw new Error(
      "Couldn't find any screens in the 'screens' or 'groups' property. Make sure to define at least one screen in the configuration."
    );
  }

  const NavigatorComponent = ({ children: _, ...props }: typeof rest) => {
    const children = items.map((item) => item());

    const screenOptions =
      typeof props.screenOptions === 'function' ||
      typeof rest.screenOptions === 'function'
        ? (options: unknown) => ({
            ...(typeof rest.screenOptions === 'function'
              ? rest.screenOptions(options)
              : rest.screenOptions),
            ...(typeof props.screenOptions === 'function'
              ? props.screenOptions(options)
              : props.screenOptions),
          })
        : { ...rest.screenOptions, ...props.screenOptions };

    const screenListeners =
      typeof props.screenListeners === 'function' ||
      typeof rest.screenListeners === 'function'
        ? (options: unknown) => ({
            ...(typeof rest.screenListeners === 'function'
              ? rest.screenListeners(options)
              : rest.screenListeners),
            ...(typeof props.screenListeners === 'function'
              ? props.screenListeners(options)
              : props.screenListeners),
          })
        : { ...rest.screenListeners, ...props.screenListeners };

    return (
      <Navigator
        {...rest}
        {...props}
        screenOptions={screenOptions}
        screenListeners={screenListeners}
      >
        {children}
      </Navigator>
    );
  };

  NavigatorComponent.displayName = displayName;

  return NavigatorComponent;
}

type TreeForPathConfig = {
  config: ConfigForPathConfig;
};

type ConfigForPathConfig = {
  initialRouteName?: string;
  screens?: Record<string, ScreenForPathConfig>;
  groups?: Record<string, { screens: Record<string, ScreenForPathConfig> }>;
};

type LinkingForPathConfig =
  | string
  | (Partial<StaticScreenConfigLinkingAlias> & {
      alias?: (string | StaticScreenConfigLinkingAlias)[];
      initialRouteName?: string | undefined;
      screens?: PathConfigMap<ParamListBase> | undefined;
    })
  | null
  | undefined;

type ScreenValueForPathConfig = React.ComponentType<{}> | TreeForPathConfig;

type ScreenForPathConfig =
  | ScreenValueForPathConfig
  | {
      screen: ScreenValueForPathConfig;
      linking?: LinkingForPathConfig;
    };

type PathConfigMapForStaticNavigation = Record<
  string,
  string | PathConfigForStaticNavigation | undefined
>;

type PathConfigForStaticNavigation = Omit<
  PathConfig<ParamListBase>,
  'screens'
> & {
  initialRouteName?: string | undefined;
  screens?: PathConfigMapForStaticNavigation | undefined;
};

// Mark screens that resolve to the same pattern and same component or navigator
const markSharedPathConfigs = (
  screens: PathConfigMapForStaticNavigation,
  sources: WeakMap<PathConfigForStaticNavigation, ScreenValueForPathConfig>,
  blocked: WeakSet<PathConfigForStaticNavigation>
) => {
  const candidates = new Map<string, PathConfigForStaticNavigation[]>();

  const collect = (
    screens: PathConfigMapForStaticNavigation,
    parentParts: PatternPart[],
    disabled: boolean
  ) => {
    for (const config of Object.values(screens)) {
      if (config == null || typeof config === 'string') {
        continue;
      }

      const parts =
        typeof config.path === 'string'
          ? combinePatternParts(
              parentParts,
              getPatternParts(config.path),
              config.exact
            )
          : parentParts;

      if (sources.has(config) && typeof config.path === 'string') {
        if (disabled) {
          blocked.add(config);
        }

        const pattern = parts.map((part) => part.segment).join('/');
        const entries = candidates.get(pattern) ?? [];

        entries.push(config);
        candidates.set(pattern, entries);
      }

      if (config.screens) {
        collect(config.screens, parts, disabled || config.shared === false);
      }
    }
  };

  collect(screens, [], false);

  for (const entries of candidates.values()) {
    for (const entry of entries) {
      const source = sources.get(entry);

      if (
        entry.shared === undefined &&
        !blocked.has(entry) &&
        entries.some(
          (candidate) =>
            candidate !== entry &&
            !blocked.has(candidate) &&
            sources.get(candidate) === source
        )
      ) {
        entry.shared = true;
      }
    }
  }
};

/**
 * Create a path config object from a static navigation config for deep linking.
 *
 * @param tree Static navigation config.
 * @param options Additional options from `linking.config`.
 * @param auto Whether to automatically generate paths for leaf screens.
 * @returns Path config object to use in linking config.
 *
 * @example
 * ```js
 * const config = {
 *   screens: {
 *     Home: {
 *       screens: createPathConfigForStaticNavigation(HomeTabs),
 *     },
 *   },
 * };
 * ```
 */
export function createPathConfigForStaticNavigation<ParamList extends {}>(
  tree: TreeForPathConfig,
  options?: {
    initialRouteName?: string | undefined;
  },
  auto?: boolean
): PathConfigMap<ParamList> | undefined {
  let initialScreenHasPath: boolean = false;
  let initialScreenConfig: PathConfig<{}> | undefined;
  let hasEmptyPath = false;

  const blocked = new WeakSet<PathConfigForStaticNavigation>();
  const sources = new WeakMap<
    PathConfigForStaticNavigation,
    ScreenValueForPathConfig
  >();

  const createPathConfigForTree = (
    t: TreeForPathConfig,
    o: { initialRouteName?: string | undefined } | undefined,
    // If a screen is a leaf node, but inside a screen with path,
    // It should not be used for initial detection
    skipInitialDetection: boolean,
    allowAutoEmptyPath: boolean
  ) => {
    const initialRouteName = o?.initialRouteName ?? t.config.initialRouteName;

    if (initialRouteName != null) {
      const routeNames = new Set(Object.keys(t.config.screens ?? {}));

      for (const group of Object.values(t.config.groups ?? {})) {
        Object.keys(group.screens).forEach((name) => routeNames.add(name));
      }

      if (!routeNames.has(initialRouteName)) {
        throw new Error(
          `Couldn't find a screen named '${initialRouteName}' to use as 'initialRouteName'.`
        );
      }
    }

    const createPathConfigForScreens = (
      screens: Record<string, ScreenForPathConfig>,
      initialRouteName: string | undefined
    ) => {
      return Object.fromEntries(
        Object.entries(screens)
          // Re-order to move the initial route to the front
          // This way we can detect the initial route correctly
          .sort(([a], [b]) => {
            if (a === initialRouteName) {
              return -1;
            }

            if (b === initialRouteName) {
              return 1;
            }

            return 0;
          })
          .map(([key, item]) => {
            const screenConfig: PathConfigForStaticNavigation = {};

            sources.set(
              screenConfig,
              typeof item === 'object' && 'screen' in item ? item.screen : item
            );

            const normalizePath = (path: string) =>
              path.replace(/^\/+|\/+$/g, '');

            if ('linking' in item && item.linking !== undefined) {
              if (typeof item.linking === 'string') {
                screenConfig.path = item.linking;
              } else if (
                item.linking != null &&
                typeof item.linking === 'object'
              ) {
                Object.assign(screenConfig, { ...item.linking });
              }
            }

            if (screenConfig.exact && screenConfig.path == null) {
              throw new Error(
                "A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`."
              );
            }

            if (typeof screenConfig.path === 'string') {
              screenConfig.path = normalizePath(screenConfig.path);
            }

            if (screenConfig.alias != null) {
              screenConfig.alias = screenConfig.alias.map((alias) => {
                if (typeof alias === 'string') {
                  return normalizePath(alias);
                }

                return {
                  ...alias,
                  path: normalizePath(alias.path),
                };
              });
            }

            let screens;

            const hasExplicitScreens =
              'screens' in screenConfig && screenConfig.screens != null;
            const hasDisabledLinking =
              'linking' in item && item.linking === null;
            const childOptions =
              'initialRouteName' in screenConfig &&
              typeof screenConfig.initialRouteName === 'string'
                ? { initialRouteName: screenConfig.initialRouteName }
                : undefined;

            if (
              hasExplicitScreens &&
              childOptions != null &&
              !Object.keys(screenConfig.screens ?? {}).includes(
                childOptions.initialRouteName
              )
            ) {
              throw new Error(
                `Couldn't find a screen named '${childOptions.initialRouteName}' to use as 'initialRouteName'.`
              );
            }

            const skipInitialDetectionInChild =
              skipInitialDetection ||
              (screenConfig.path != null && screenConfig.path !== '');
            const allowAutoEmptyPathInChild =
              allowAutoEmptyPath &&
              (initialRouteName == null || key === initialRouteName);

            if (
              !hasExplicitScreens &&
              !hasDisabledLinking &&
              'config' in item
            ) {
              screens = createPathConfigForTree(
                item,
                childOptions,
                skipInitialDetectionInChild,
                allowAutoEmptyPathInChild
              );
            } else if (
              !hasExplicitScreens &&
              !hasDisabledLinking &&
              'screen' in item &&
              'config' in item.screen &&
              (item.screen.config.screens || item.screen.config.groups)
            ) {
              screens = createPathConfigForTree(
                item.screen,
                childOptions,
                skipInitialDetectionInChild,
                allowAutoEmptyPathInChild
              );
            }

            if (screens) {
              screenConfig.screens = screens;
            }

            if (
              auto &&
              !('screens' in screenConfig && screenConfig.screens) &&
              // Skip generating path for screens that specify linking config as `null` explicitly
              !hasDisabledLinking
            ) {
              if (screenConfig.path != null) {
                if (!skipInitialDetection) {
                  if (screenConfig.path === '') {
                    // We encounter a leaf screen with empty path,
                    // Clear the initial screen config as it's not needed anymore
                    initialScreenConfig = undefined;
                    hasEmptyPath = true;

                    if (allowAutoEmptyPath && key === initialRouteName) {
                      initialScreenHasPath = true;
                    }
                  } else if (
                    allowAutoEmptyPath &&
                    key === initialRouteName &&
                    // Keep an already discovered fallback unless the initial route
                    // explicitly uses an empty path.
                    initialScreenConfig == null
                  ) {
                    initialScreenHasPath = true;
                  }
                }
              } else {
                if (
                  !skipInitialDetection &&
                  allowAutoEmptyPath &&
                  (initialRouteName == null || key === initialRouteName) &&
                  !hasEmptyPath &&
                  initialScreenConfig == null
                ) {
                  initialScreenConfig = screenConfig;
                }

                screenConfig.path = normalizePath(
                  key
                    .replace(/([A-Z]+)/g, '-$1')
                    .replace(/^-/, '')
                    .toLowerCase()
                );
              }
            }

            return [key, screenConfig] as const;
          })
          .filter(([, screen]) => Object.keys(screen).length > 0)
      );
    };

    const screens: PathConfigMapForStaticNavigation = {};

    // Loop through the config to find screens and groups
    // So we add the screens and groups in the same order as they are defined
    for (const key in t.config) {
      if (key === 'screens' && t.config.screens) {
        Object.assign(
          screens,
          createPathConfigForScreens(
            t.config.screens,
            o?.initialRouteName ?? t.config.initialRouteName
          )
        );
      }

      if (key === 'groups' && t.config.groups) {
        Object.entries(t.config.groups).forEach(([, group]) => {
          Object.assign(
            screens,
            createPathConfigForScreens(
              group.screens,
              o?.initialRouteName ?? t.config.initialRouteName
            )
          );
        });
      }
    }

    if (Object.keys(screens).length === 0) {
      return undefined;
    }

    return screens;
  };

  const screens = createPathConfigForTree(tree, options, false, true);

  if (auto && initialScreenConfig && !initialScreenHasPath) {
    initialScreenConfig.path = '';
  }

  if (!screens) {
    return undefined;
  }

  markSharedPathConfigs(screens, sources, blocked);

  return screens as PathConfigMap<ParamList>;
}
