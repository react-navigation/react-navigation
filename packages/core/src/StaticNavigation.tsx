import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import fromEntries from './fromEntries';
import type {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigatorScreenParams,
  PathConfig,
  RouteConfig,
} from './types';
import useRoute from './useRoute';

/**
 * Flatten a type recursively to remove all type alias names.
 */
type FlatType<T> = T extends object ? { [K in keyof T]: T[K] } : T;

type ComponentForOption<T> = T extends { screen: React.ComponentType<any> }
  ? T['screen']
  : T extends React.ComponentType<any>
  ? T
  : never;

type UnknownToUndefined<T> = unknown extends T ? undefined : T;

type ParamsForScreen<T> = T extends { screen: StaticNavigation<any, any> }
  ? NavigatorScreenParams<StaticParamList<T['screen']>> | undefined
  : T extends StaticNavigation<any, any>
  ? NavigatorScreenParams<StaticParamList<T>> | undefined
  : UnknownToUndefined<
      React.ComponentProps<ComponentForOption<T>>['route']['params']
    >;

type ParamListForScreens<
  Screens extends StaticConfigScreens<
    ParamListBase,
    NavigationState,
    {},
    EventMapBase
  >
> = {
  [Key in keyof Screens]: ParamsForScreen<Screens[Key]>;
};

type LayoutComponent = React.ComponentType<{ children: React.ReactNode }>;

type StaticConfigScreens<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = {
  [key: string]:
    | React.ComponentType<any>
    | StaticNavigation<any, any>
    | ((Omit<
        RouteConfig<ParamList, keyof ParamList, State, ScreenOptions, EventMap>,
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
        linking?:
          | FlatType<
              Pick<
                PathConfig<ParamListBase>,
                'path' | 'exact' | 'parse' | 'stringify'
              >
            >
          | string;
      }) &
        (
          | {
              /**
               * Static navigation config for the screen.
               */
              screen: StaticNavigation<any, any>;
              /**
               * Wrapper component to render the navigator in.
               */
              layout?: LayoutComponent;
            }
          | {
              /**
               * Component to render for the screen.
               */
              screen: React.ComponentType<any>;
            }
        ));
};

export type StaticConfig<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigator extends React.ComponentType<{}>
> = Omit<
  Omit<
    React.ComponentProps<Navigator>,
    keyof DefaultNavigatorOptions<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase
    >
  > &
    DefaultNavigatorOptions<ParamList, State, ScreenOptions, EventMap>,
  'screens' | 'children'
> & {
  /**
   * Screens to render in the navigator and their configuration.
   */
  screens: StaticConfigScreens<ParamList, State, ScreenOptions, EventMap>;
};

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
      readonly screens: StaticConfigScreens<
        ParamListBase,
        NavigationState,
        {},
        EventMapBase
      >;
    };
  }
> = ParamListForScreens<T['config']['screens']>;

export type StaticNavigation<NavigatorProps, ScreenProps> = {
  Navigator: React.ComponentType<NavigatorProps>;
  Screen: React.ComponentType<ScreenProps>;
  config: StaticConfig<
    ParamListBase,
    NavigationState,
    {},
    EventMapBase,
    React.ComponentType<any>
  >;
};

const MemoizedScreen = React.memo(
  <T extends React.ComponentType<any>>({ component }: { component: T }) => {
    const route = useRoute();
    const children = React.createElement(component, { route });

    return children;
  }
);

/**
 * Create a component that renders a navigator based on the static configuration.
 *
 * @param tree Static navigation config.
 * @param displayName Name of the component to be displayed in React DevTools.
 * @returns A component which renders the navigator.
 */
export function createComponentForStaticNavigation(
  tree: StaticNavigation<any, any>,
  displayName: string
): React.ComponentType<{}> {
  const { Navigator, Screen, config } = tree;
  const { screens, ...rest } = config;

  const items = Object.entries(screens).map(([name, item]) => {
    let component: React.ComponentType<any> | undefined;
    let layout: LayoutComponent | undefined;
    let props: {} = {};
    let useIf: (() => boolean) | undefined;

    let isNavigator = false;

    if ('screen' in item) {
      const { screen, if: _if, ...rest } = item;

      useIf = _if;
      props = rest;

      if (typeof screen === 'function') {
        component = screen;
      } else if ('config' in screen) {
        isNavigator = true;
        layout = 'layout' in item ? item.layout : undefined;
        component = createComponentForStaticNavigation(
          screen,
          `${name}Navigator`
        );
      }
    } else if (typeof item === 'function') {
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

    let element = isNavigator ? (
      React.createElement(component, {})
    ) : (
      <MemoizedScreen component={component} />
    );

    if (layout) {
      element = React.createElement(layout, { children: element });
    }

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
    screens: StaticConfigScreens<
      ParamListBase,
      NavigationState,
      {},
      EventMapBase
    >;
  };
}) {
  return fromEntries(
    Object.entries(tree.config.screens)
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
          item.screen.config.screens
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
