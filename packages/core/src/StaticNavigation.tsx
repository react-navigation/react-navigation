import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import { isValidElementType } from 'react-is';

import type {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationListBase,
  NavigatorScreenParams,
  NavigatorTypeBagBase,
  PathConfig,
  PathConfigMap,
  RouteConfigComponent,
  RouteConfigProps,
  RouteGroupConfig,
  StaticParamList,
} from './types';
import { useRoute } from './useRoute';

export type { StaticParamList } from './types';

type StaticRouteConfig<
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

type StaticScreenConfigBrand = {
  readonly __reactNavigationStaticScreenConfig: true;
};

type UnknownToUndefined<T> = unknown extends T ? undefined : T;

type ParamsForStaticScreenComponent<T> =
  T extends React.ComponentType<{ route: { params: infer P } }>
    ? UnknownToUndefined<P>
    : undefined;

type ParamsForStaticScreen<T> =
  T extends StaticNavigation<any, any, any>
    ? NavigatorScreenParams<StaticParamList<T>> | undefined
    : ParamsForStaticScreenComponent<T>;

type ParamListForStaticScreenConfig<Params> = {
  Screen: Params extends object | undefined ? Params : never;
};

type StaticScreenConfigLinking =
  | PathConfig<ParamListBase>
  | string
  | null
  | undefined;

type StaticScreenConfigScreen =
  | React.ComponentType<any>
  | StaticNavigation<any, any, any>;

type StaticScreenConfig<
  Screen extends StaticScreenConfigScreen,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
  Params = ParamsForStaticScreen<Screen>,
> = Omit<
  StaticRouteConfig<
    ParamListForStaticScreenConfig<Params>,
    'Screen',
    State,
    ScreenOptions,
    EventMap,
    Navigation
  >,
  'name' | 'component' | 'getComponent' | 'children'
> & {
  /**
   * Callback to determine whether the screen should be rendered or not.
   * This can be useful for conditional rendering of screens,
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
   * Linking config for the screen.
   * This can be a string to specify the path, or an object with more options.
   *
   * @example
   * ```js
   * linking: {
   *   path: 'profile/:id',
   *   exact: true,
   * },
   * ```
   */
  linking?: StaticScreenConfigLinking;
  /**
   * Static navigation config or Component to render for the screen.
   */
  screen: Screen;
};

export type StaticConfigScreens<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigationList extends NavigationListBase<ParamList>,
> = {
  [RouteName in keyof ParamList]:
    | React.ComponentType<any>
    | StaticNavigation<any, any, any>
    | (Omit<
        StaticRouteConfig<
          ParamList,
          RouteName,
          State,
          ScreenOptions,
          EventMap,
          NavigationList[RouteName]
        >,
        'name' | 'component' | 'getComponent' | 'children'
      > & {
        /**
         * Callback to determine whether the screen should be rendered or not.
         * This can be useful for conditional rendering of screens,
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
         * Linking config for the screen.
         * This can be a string to specify the path, or an object with more options.
         *
         * @example
         * ```js
         * linking: {
         *   path: 'profile/:id',
         *   exact: true,
         * },
         * ```
         */
        linking?: PathConfig<ParamListBase> | string | null;
        /**
         * Static navigation config or Component to render for the screen.
         */
        screen: StaticNavigation<any, any, any> | React.ComponentType<any>;
      })
    | StaticScreenConfigBranded;
};

type StaticScreenConfigBranded = StaticScreenConfigBrand & {
  screen: StaticScreenConfigScreen;
  if?: () => boolean;
};

export type StaticConfigGroup<
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
    Bag['NavigatorID'],
    Bag['State'],
    Bag['ScreenOptions'],
    Bag['EventMap'],
    Bag['NavigationList'],
    Bag['Navigator']
  >;

type StaticConfigInternal<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigationList extends NavigationListBase<ParamList>,
  Navigator extends React.ComponentType<any>,
> = Omit<
  Omit<
    React.ComponentProps<Navigator>,
    keyof DefaultNavigatorOptions<
      ParamListBase,
      string | undefined,
      NavigationState,
      {},
      EventMapBase,
      NavigationList[keyof ParamList]
    >
  > &
    DefaultNavigatorOptions<
      ParamList,
      NavigatorID,
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
        screens: StaticConfigScreens<
          ParamList,
          State,
          ScreenOptions,
          EventMap,
          NavigationList
        >;
        /**
         * Groups of screens to render in the navigator and their configuration.
         */
        groups?: {
          [key: string]: StaticConfigGroup<
            ParamList,
            State,
            ScreenOptions,
            EventMap,
            NavigationList
          >;
        };
      }
    | {
        /**
         * Screens to render in the navigator and their configuration.
         */
        screens?: StaticConfigScreens<
          ParamList,
          State,
          ScreenOptions,
          EventMap,
          NavigationList
        >;
        /**
         * Groups of screens to render in the navigator and their configuration.
         */
        groups: {
          [key: string]: StaticConfigGroup<
            ParamList,
            State,
            ScreenOptions,
            EventMap,
            NavigationList
          >;
        };
      }
  );

/**
 * Props for a screen component which is rendered by a static navigator.
 * Takes the route params as a generic argument.
 */
export type StaticScreenProps<T extends Record<string, unknown> | undefined> = {
  route: {
    params: T;
  };
};

type StaticNavigationBase = {
  config: StaticConfig<NavigatorTypeBagBase>;
  getComponent: () => React.ComponentType<{}>;
};

export type StaticNavigation<NavigatorProps, GroupProps, ScreenProps> =
  StaticNavigationBase & {
    Navigator: React.ComponentType<NavigatorProps>;
    Group: React.ComponentType<GroupProps>;
    Screen: React.ComponentType<ScreenProps>;
  };

export type StaticScreenFactory<Bag extends NavigatorTypeBagBase> = <
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfig<
    Screen,
    Bag['State'],
    Bag['ScreenOptions'],
    Bag['EventMap'],
    Bag['NavigationList'][keyof Bag['ParamList']]
  >
) => StaticScreenConfig<
  Screen,
  Bag['State'],
  Bag['ScreenOptions'],
  Bag['EventMap'],
  Bag['NavigationList'][keyof Bag['ParamList']]
> &
  StaticScreenConfigBrand;

/**
 * Helper to create a typed `createXScreen` for static configuration.
 */
export function createScreenFactory<
  TypeBag extends NavigatorTypeBagBase,
>(): StaticScreenFactory<TypeBag> {
  return ((config: unknown) => config) as never;
}

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
export function createComponentForStaticNavigation<
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

  type NavigatorProps = Omit<React.ComponentProps<T['Navigator']>, 'children'>;

  const NavigatorComponent = (props: NavigatorProps) => {
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

/**
 * Create a component that renders a navigator based on the static configuration.
 *
 * @deprecated Use `tree.getComponent()` instead.
 */
export function createComponentForStaticNavigationDeprecated(
  tree: StaticNavigation<any, any, any>
): React.ComponentType<{}> {
  console.warn(
    '`createComponentForStaticNavigation` is deprecated. Use `tree.getComponent()` instead.'
  );

  return tree.getComponent();
}

type TreeForPathConfig = {
  config: ConfigForPathConfig;
};

type ConfigForPathConfig = {
  initialRouteName?: string;
  screens?: Record<string, ScreenForPathConfig>;
  groups?: {
    [key: string]: {
      screens: Record<string, ScreenForPathConfig>;
    };
  };
};

type LinkingForPathConfig =
  | PathConfig<ParamListBase>
  | string
  | null
  | undefined;

type ScreenForPathConfig =
  | React.ComponentType<any>
  | TreeForPathConfig
  | {
      screen: React.ComponentType<any> | TreeForPathConfig;
      linking?: LinkingForPathConfig;
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
export function createPathConfigForStaticNavigation(
  tree: TreeForPathConfig,
  options?: {
    initialRouteName?: string;
  },
  auto?: boolean
): PathConfigMap<ParamListBase> | undefined {
  let initialScreenHasPath: boolean = false;
  let initialScreenConfig: PathConfig<ParamListBase> | undefined;
  let hasEmptyPath = false;

  const createPathConfigForTree = (
    t: TreeForPathConfig,
    o: { initialRouteName?: string } | undefined,
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
            const screenConfig: PathConfig<ParamListBase> = {};

            const normalizePath = (path: string) =>
              path.replace(/^\/+|\/+$/g, '');

            if ('linking' in item && item.linking !== undefined) {
              if (typeof item.linking === 'string') {
                screenConfig.path = item.linking;
              } else if (
                item.linking != null &&
                typeof item.linking === 'object'
              ) {
                Object.assign(screenConfig, item.linking);
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

    const screens = {};

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

  return screens;
}
