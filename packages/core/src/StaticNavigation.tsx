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
        if?: () => boolean;
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
              screen: StaticNavigation<any, any>;
              layout?: LayoutComponent;
            }
          | { screen: React.ComponentType<any> }
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
  screens: StaticConfigScreens<ParamList, State, ScreenOptions, EventMap>;
};

export type StaticScreenProps<T extends Record<string, unknown> | undefined> = {
  route: {
    params: T;
  };
};

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

export function createComponentForStaticNavigation(
  tree: StaticNavigation<any, any>,
  displayName: string
) {
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

export function createPathConfigForStaticNavigation(
  screens: StaticConfigScreens<ParamListBase, NavigationState, {}, EventMapBase>
) {
  return fromEntries(
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
          screenConfig.screens = createPathConfigForStaticNavigation(
            item.config.screens
          );
        } else if (
          'screen' in item &&
          'config' in item.screen &&
          item.screen.config.screens
        ) {
          screenConfig.screens = createPathConfigForStaticNavigation(
            item.screen.config.screens
          );
        }

        return [key, screenConfig] as const;
      })
      .filter(([, screen]) => Object.keys(screen).length > 0)
  );
}
