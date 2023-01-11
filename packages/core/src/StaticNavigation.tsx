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

type FlatType<T> = T extends object ? { [K in keyof T]: T[K] } : T;

type ComponentForOption<T> = T extends { component: React.ComponentType<any> }
  ? T['component']
  : T extends React.ComponentType<any>
  ? T
  : never;

type UnknownToUndefined<T> = unknown extends T ? undefined : T;

type ParamsForScreen<T> = T extends { navigator: StaticNavigation<any, any> }
  ? NavigatorScreenParams<StaticParamList<T['navigator']>> | undefined
  : T extends StaticNavigation<any, any>
  ? NavigatorScreenParams<StaticParamList<T>> | undefined
  : UnknownToUndefined<
      React.ComponentProps<ComponentForOption<T>>['route']['params']
    >;

type ParamListForScreens<
  Screens extends StaticConfig<any, any, any, any, any>['screens']
> = {
  [Key in keyof Screens]: ParamsForScreen<Screens[Key]>;
};

export type StaticConfig<
  ParamList extends ParamListBase,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  Navigator extends React.ComponentType<any>
> = Omit<
  Omit<
    React.ComponentProps<Navigator>,
    keyof DefaultNavigatorOptions<any, any, any, any>
  > &
    DefaultNavigatorOptions<ParamList, State, ScreenOptions, EventMap>,
  'screens' | 'children'
> & {
  screens: {
    [key: string]:
      | React.ComponentType<any>
      | StaticNavigation<any, any>
      | ((Omit<
          RouteConfig<
            ParamList,
            keyof ParamList,
            State,
            ScreenOptions,
            EventMap
          >,
          'name' | 'component' | 'getComponent' | 'children'
        > & {
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
            | { component: React.ComponentType<any> }
            | { navigator: StaticNavigation<any, any> }
          ));
  };
};

export type StaticScreenProps<T extends Record<string, unknown> | undefined> = {
  route: {
    params: T;
  };
};

export type StaticParamList<
  T extends { readonly config: StaticConfig<any, any, any, any, any> }
> = ParamListForScreens<T['config']['screens']>;

export type StaticNavigation<NavigatorProps, ScreenProps> = {
  Navigator: React.ComponentType<NavigatorProps>;
  Screen: React.ComponentType<ScreenProps>;
  config: StaticConfig<any, any, any, any, any>;
};

export function createComponentForStaticNavigation(
  tree: StaticNavigation<any, any>
) {
  const { Navigator, Screen, config } = tree;
  const { screens, ...rest } = config;

  const children = Object.entries(screens).map(([name, screen]) => {
    let component: React.ComponentType<any> | undefined;
    let props: {} = {};

    if ('component' in screen) {
      const { component: screenComponent, ...rest } = screen;

      component = screenComponent;
      props = rest;
    } else if ('navigator' in screen) {
      const { navigator, ...rest } = screen;

      component = createComponentForStaticNavigation(navigator);
      props = rest;
    } else if (typeof screen === 'function') {
      component = screen;
    } else if ('config' in screen) {
      component = createComponentForStaticNavigation(screen);
    }

    if (component == null) {
      throw new Error(
        `Couldn't find a 'component' or 'navigator' property for the screen '${name}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`
      );
    }

    const MemoizedScreen = React.memo(
      <T extends { component: React.ComponentType<any>; route: any }>({
        component,
        ...rest
      }: T) => {
        return React.createElement(component, rest);
      }
    );

    MemoizedScreen.displayName = `Screen(${name})`;

    return (
      <Screen key={name} name={name} {...props}>
        {({ route }: any) => (
          <MemoizedScreen component={component!} route={route} />
        )}
      </Screen>
    );
  });

  return function NavigatorComponent() {
    return <Navigator {...rest}>{children}</Navigator>;
  };
}

export function createPathConfigForStaticNavigation(
  screens: StaticConfig<any, any, any, any, any>['screens']
) {
  return fromEntries(
    Object.entries(screens)
      .map(([key, screen]) => {
        const screenConfig: PathConfig<ParamListBase> = {};

        if ('linking' in screen) {
          if (typeof screen.linking === 'string') {
            screenConfig.path = screen.linking;
          } else {
            Object.assign(screenConfig, screen.linking);
          }
        }

        if ('config' in screen) {
          screenConfig.screens = createPathConfigForStaticNavigation(
            screen.config.screens
          );
        } else if ('navigator' in screen && screen.navigator.config.screens) {
          screenConfig.screens = createPathConfigForStaticNavigation(
            screen.navigator.config.screens
          );
        }

        return [key, screenConfig] as const;
      })
      .filter(([, screen]) => Object.keys(screen).length > 0)
  );
}
