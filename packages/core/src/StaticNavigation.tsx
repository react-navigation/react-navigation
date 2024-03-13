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
  RouteConfigComponent,
  RouteConfigProps,
  RouteGroupConfig,
} from './types';
import { useRoute } from './useRoute';

/**
 * Flatten a type to remove all type alias names, unions etc.
 * This will show a plain object when hovering over the type.
 */
type FlatType<T> = { [K in keyof T]: T[K] } & {};

/**
 * keyof T doesn't work for union types. We can use distributive conditional types instead.
 * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
 */
type KeysOf<T> = T extends {} ? keyof T : never;

/**
 * We get a union type when using keyof, but we want an intersection instead.
 * https://stackoverflow.com/a/50375286/1665026
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type UnknownToUndefined<T> = unknown extends T ? undefined : T;

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
          screens: StaticConfigScreens<
            ParamListBase,
            NavigationState,
            {},
            EventMapBase,
            any
          >;
        };
      }>
    | undefined,
> = Groups extends {
  [key: string]: {
    screens: StaticConfigScreens<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase,
      any
    >;
  };
}
  ? ParamListForScreens<UnionToIntersection<Groups[keyof Groups]['screens']>>
  : {};

type StaticRouteConfig<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigation,
> = RouteConfigProps<
  // FIXME: the param list is inferred from the screen component
  // So we can't use the type here
  // Fallback to ParamListBase for now
  ParamListBase,
  string,
  State,
  ScreenOptions,
  EventMap,
  Navigation
> &
  RouteConfigComponent<ParamList, RouteName>;

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
        linking?: PathConfig<ParamList> | string;
        /**
         * Static navigation config or Component to render for the screen.
         */
        screen: StaticNavigation<any, any, any> | React.ComponentType<any>;
      });
};

type GroupConfig<
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
          [key: string]: GroupConfig<
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
          [key: string]: GroupConfig<
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
    readonly config: {
      readonly screens?: Record<string, any>;
      readonly groups?: {
        [key: string]: {
          screens: Record<string, any>;
        };
      };
    };
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

  const items = screens ? getItemsFromScreens(Screen, screens) : [];

  if (groups) {
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
            <Group navigationKey={key} {...group} key={key}>
              {children}
            </Group>
          );
        };
      })
    );
  }

  const NavigatorComponent = () => {
    const children = items.map((item) => item());

    return <Navigator {...rest}>{children}</Navigator>;
  };

  NavigatorComponent.displayName = displayName;

  return NavigatorComponent;
}

/**
 * Create a path config object from a static navigation config for deep linking.
 *
 * @param tree Static navigation config.
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
export function createPathConfigForStaticNavigation(tree: {
  config: {
    screens?: StaticConfigScreens<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase,
      Record<string, unknown>
    >;
    groups?: {
      [key: string]: {
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
}) {
  function createPathConfigForScreens(
    screens: StaticConfigScreens<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase,
      Record<string, unknown>
    >
  ) {
    return Object.fromEntries(
      Object.entries(screens)
        .map(([key, item]) => {
          const screenConfig: PathConfig<ParamListBase> = {};

          if ('linking' in item) {
            if (typeof item.linking === 'string') {
              screenConfig.path = item.linking;
            } else {
              Object.assign(screenConfig, item.linking);
            }
          }

          if ('config' in item) {
            screenConfig.screens = createPathConfigForStaticNavigation(item);
          } else if (
            'screen' in item &&
            'config' in item.screen &&
            (item.screen.config.screens || item.screen.config.groups)
          ) {
            screenConfig.screens = createPathConfigForStaticNavigation(
              item.screen
            );
          }

          return [key, screenConfig] as const;
        })
        .filter(([, screen]) => Object.keys(screen).length > 0)
    );
  }

  const config = tree.config.screens
    ? createPathConfigForScreens(tree.config.screens)
    : {};

  if (tree.config.groups) {
    Object.entries(tree.config.groups).forEach(([, group]) => {
      Object.assign(config, createPathConfigForScreens(group.screens));
    });
  }

  return config;
}
