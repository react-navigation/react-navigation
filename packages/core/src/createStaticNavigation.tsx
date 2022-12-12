import type React from 'react';

import type { NavigatorScreenParams } from './types';

type StaticNavigation<
  Navigator extends React.ComponentType<any>,
  Screen extends React.ComponentType<any>
> = {
  Navigator: Navigator;
  Screen: Screen;
  config: StaticConfig<Navigator, Screen>;
};

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
