import * as React from 'react';

import type { NavigatorScreenParams } from './types';

type ComponentForOption<T> = T extends { component: React.ComponentType<any> }
  ? T['component']
  : T extends React.ComponentType<any>
  ? T
  : never;

type UnknownToUndefined<T> = unknown extends T ? undefined : T;

type ParamsForScreen<T> = T extends StaticNavigation<any, any>
  ? NavigatorScreenParams<StaticParamList<T>> | undefined
  : UnknownToUndefined<
      React.ComponentProps<ComponentForOption<T>>['route']['params']
    >;

type ParamListForScreens<Screens extends StaticConfig<any, any>['screens']> = {
  [Key in keyof Screens]: ParamsForScreen<Screens[Key]>;
};

type ScreenConfig<T extends React.ComponentType<any>> = Omit<
  React.ComponentProps<T>,
  'name' | 'component' | 'children'
> & {
  component: React.ComponentType<any>;
  path?: string;
};

export type StaticConfig<
  Navigator extends React.ComponentType<any>,
  Screen extends React.ComponentType<any>
> = Omit<React.ComponentProps<Navigator>, 'screens' | 'children'> & {
  screens: {
    [key: string]:
      | React.ComponentType<any>
      | ScreenConfig<Screen>
      // TODO: make this a property rather than direct child
      | StaticNavigation<any, any>;
  };
};

export type StaticScreenProps<T extends Record<string, unknown> | undefined> = {
  route: {
    params: T;
  };
};

export type StaticParamList<
  T extends { readonly config: StaticConfig<any, any> }
> = ParamListForScreens<T['config']['screens']>;

export type StaticNavigation<
  Navigator extends React.ComponentType<any>,
  Screen extends React.ComponentType<any>
> = {
  Navigator: Navigator;
  Screen: Screen;
  config: StaticConfig<Navigator, Screen>;
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
    let component: React.ComponentType<any>;
    let props: {};

    if (typeof screen === 'function') {
      component = screen;
      props = {};
    } else if ('component' in screen) {
      const { component: screenComponent, ...rest } = screen;

      component = screenComponent;
      props = rest;
    } else {
      component = createComponentForStaticNavigation(screen);
      props = {};
    }

    return (
      <Screen key={name} name={name} {...props}>
        {({ route }: any) => (
          <MemoizedScreen component={component} route={route} />
        )}
      </Screen>
    );
  });

  return function NavigatorComponent() {
    return <Navigator {...rest}>{children}</Navigator>;
  };
}
