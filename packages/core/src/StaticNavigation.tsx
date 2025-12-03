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
  RouteGroupConfig,
  ScreenListeners,
  Theme,
} from './types';
import { useRoute } from './useRoute';
import type {
  FlatType,
  KeysOf,
  UnionToIntersection,
  UnknownToUndefined,
} from './utilities';

type ParamsForScreenComponent<T> = T extends {
  screen: React.ComponentType<{ route: { params: infer P } }>;
}
  ? P
  : T extends React.ComponentType<{ route: { params: infer P } }>
    ? P
    : undefined;

type ParamsForScreen<T> = T extends { screen: StaticNavigation<any, any, any> }
  ? NavigatorScreenParams<StaticParamList<T['screen']>> | undefined
  : T extends StaticNavigation<any, any, any>
    ? NavigatorScreenParams<StaticParamList<T>> | undefined
    : UnknownToUndefined<ParamsForScreenComponent<T>>;

type ParamListForScreens<Screens> = {
  [Key in KeysOf<Screens>]: ParamsForScreen<Screens[Key]>;
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

type RouteType<Params> = Readonly<
  FlatType<
    {
      key: string;
      name: string;
      path?: string;
    } & (undefined extends Params ? { params?: Params } : { params: Params })
  >
>;

export type StaticScreenConfig<
  Screen,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
  Params = Screen extends React.ComponentType<{}>
    ? undefined
    : Screen extends React.ComponentType<{ route: { params: infer P } }>
      ? P
      : Screen extends StaticNavigation<any, any, any>
        ? NavigatorScreenParams<StaticParamList<Screen>>
        : undefined,
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
  initialParams?: Params extends object ? Partial<Params> : never;

  /**
   * Function to return an unique ID for this screen.
   *
   * @example
   * ```js
   * getId: ({ params }) => params?.userId,
   * ```
   */
  getId?: (props: { params: Params }) => string | undefined;

  /**
   * Linking config for the screen.
   * This can be a string to specify the path, or an object with more options.
   *
   * @example
   * ```js
   * linking: {
   *   path: 'profile/:userId',
   * },
   * ```
   */
  linking?: PathConfig<Params> | string;

  /**
   * Optional key for this screen.
   */
  navigationKey?: string;
};

type StaticConfigScreens<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigationList extends NavigationListBase<ParamList>,
> = {
  [RouteName in keyof ParamList]:
    | React.ComponentType<any>
    | StaticNavigation<any, any, any>
    | StaticScreenConfig<
        StaticNavigation<any, any, any> | React.ComponentType<any>,
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
   * Linking config for the screens in the group.
   * This can be a string to specify the path, or an object following properties:
   * - `path`
   * - `stringify`
   * - `parse`
   *
   * The path specified will be prepended to the paths of the screens in the group.
   * The `parse` and `stringify` properties will be merged.
   *
   * @example
   * ```js
   * linking: {
   *   path: 'users/:id',
   *   parse: {
   *     id: (id) => parseInt(id, 10),
   *   }
   * },
   * ```
   */
  linking?: LinkingForGroup;
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
> = Omit<
  Omit<
    React.ComponentProps<Navigator>,
    keyof DefaultNavigatorOptions<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase,
      NavigationList[keyof ParamList]
    >
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

export type StaticNavigation<NavigatorProps, GroupProps, ScreenProps> = {
  Navigator: React.ComponentType<NavigatorProps>;
  Group: React.ComponentType<GroupProps>;
  Screen: React.ComponentType<ScreenProps>;
  config: StaticConfig<NavigatorTypeBagBase>;
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
        component = createComponentForStaticNavigation(
          screen,
          `${name}Navigator`
        );
      }
    } else if (isValidElementType(item)) {
      component = item;
    } else if ('config' in item) {
      isNavigator = true;
      component = createComponentForStaticNavigation(item, `${name}Navigator`);
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
export function createComponentForStaticNavigation(
  tree: StaticNavigation<any, any, any>,
  displayName: string
): React.ComponentType<{}> {
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

  const NavigatorComponent = () => {
    const children = items.map((item) => item());

    return <Navigator {...rest}>{children}</Navigator>;
  };

  NavigatorComponent.displayName = displayName;

  return NavigatorComponent;
}

type LinkingForGroup =
  | Pick<PathConfig<any>, 'path' | 'stringify' | 'parse'>
  | string;

type TreeForPathConfig = {
  config: {
    initialRouteName?: string;
    screens?: StaticConfigScreens<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase,
      Record<string, unknown>
    >;
    groups?: {
      [key: string]: {
        linking?: LinkingForGroup;
        screens: StaticConfigScreens<
          ParamListBase,
          NavigationState,
          {},
          EventMapBase,
          Record<string, unknown>
        >;
      };
    };
  };
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
  let initialScreenConfig: PathConfig<{}> | undefined;

  const createPathConfigForTree = (
    t: TreeForPathConfig,
    o: { initialRouteName?: string } | undefined,
    // If a screen is a leaf node, but inside a screen with path,
    // It should not be used for initial detection
    skipInitialDetection: boolean
  ) => {
    const createPathConfigForScreens = (
      screens: StaticConfigScreens<
        ParamListBase,
        NavigationState,
        {},
        EventMapBase,
        Record<string, unknown>
      >,
      groupLinking: LinkingForGroup | undefined,
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
            const screenConfig: PathConfig<{}> = {};
            const groupPath =
              typeof groupLinking === 'string'
                ? groupLinking
                : groupLinking?.path;

            const normalizePath = (path: string) => {
              return `${groupPath ?? ''}/${path}`
                .replace(/^\//, '') // Remove extra leading slash
                .replace(/\/$/, ''); // Remove extra trailing slash
            };

            if ('linking' in item) {
              if (typeof item.linking === 'string') {
                screenConfig.path = item.linking;
              } else {
                Object.assign(screenConfig, item.linking);
              }
            }

            if (typeof groupLinking !== 'string') {
              if (groupLinking?.parse != null) {
                screenConfig.parse = {
                  ...groupLinking.parse,
                  ...screenConfig.parse,
                };
              }

              if (groupLinking?.stringify != null) {
                screenConfig.stringify = {
                  ...groupLinking.stringify,
                  ...screenConfig.stringify,
                };
              }
            }

            if (typeof screenConfig.path === 'string') {
              screenConfig.path = normalizePath(screenConfig.path);
            }

            let screens;

            const skipInitialDetectionInChild =
              skipInitialDetection ||
              (screenConfig.path != null && screenConfig.path !== '');

            if ('config' in item) {
              screens = createPathConfigForTree(
                item,
                undefined,
                skipInitialDetectionInChild
              );
            } else if (
              'screen' in item &&
              'config' in item.screen &&
              (item.screen.config.screens || item.screen.config.groups)
            ) {
              screens = createPathConfigForTree(
                item.screen,
                undefined,
                skipInitialDetectionInChild
              );
            }

            if (screens) {
              // @ts-expect-error - we can't type this properly
              screenConfig.screens = screens;
            }

            if (
              auto &&
              !('screens' in screenConfig && screenConfig.screens) &&
              // Skip generating path for screens that specify linking config as `undefined` or `null` explicitly
              !('linking' in item && item.linking == null)
            ) {
              if (screenConfig.path != null) {
                if (!skipInitialDetection) {
                  if (key === initialRouteName && screenConfig.path != null) {
                    initialScreenHasPath = true;
                  } else if (screenConfig.path === '') {
                    // We encounter a leaf screen with empty path,
                    // Clear the initial screen config as it's not needed anymore
                    initialScreenConfig = undefined;
                  }
                }
              } else {
                if (
                  !groupPath &&
                  !skipInitialDetection &&
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
            undefined,
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
              group.linking,
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

  const screens = createPathConfigForTree(tree, options, false);

  if (auto && initialScreenConfig && !initialScreenHasPath) {
    initialScreenConfig.path = '';
  }

  return screens;
}
