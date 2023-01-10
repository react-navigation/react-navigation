import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import type {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigatorScreenParams,
  RouteConfig,
} from './types';

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
        > & { path?: string }) &
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

export type StaticNavigation<
  Navigator extends React.ComponentType<any>,
  Screen extends React.ComponentType<any>
> = {
  Navigator: Navigator;
  Screen: Screen;
  config: StaticConfig<any, any, any, any, any>;
};

const MemoizedScreen = React.memo(
  <T extends { component: React.ComponentType<any>; route: any }>({
    component,
    ...rest
  }: T) => {
    return React.createElement(component, rest);
  }
);

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
