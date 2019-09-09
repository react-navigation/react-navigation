declare module '@react-navigation/core' {
  import * as React from 'react';

  export type ThemeType = {
    header: string;
    headerBorder: string;
  };

  export const ThemeContext: React.Context<'light' | 'dark'>;

  export const ThemeColors: {
    light: ThemeType;
    dark: ThemeType;
  };

  export const StackActions: {
    completeTransition<T extends { key?: string } | undefined>(
      options?: T
    ): { type: string } & T;
    popToTop(options: { key: string }): { type: string };
  };

  export const SwitchActions: {
    jumpTo(payload: {
      routeName: string;
      key: string;
      params?: object;
    }): { type: string } & payload;
  };

  export const NavigationActions: {
    back(payload: { key: string; immediate?: boolean }): { type: string };
  };

  export const NavigationProvider: React.ComponentType<{
    value: object;
  }>;

  export const SceneView: React.ComponentType<{
    screenProps: unknown;
    navigation: object;
    component: React.ComponentType<any>;
  }>;

  export function createNavigator<Props extends {}>(
    view: React.ComponentType<Props>,
    router: any,
    config: object
  ): React.ComponentType<Props>;

  export function withNavigation<Props extends { navigation: object }>(
    Comp: React.ComponentType<Props>
  ): React.ComponentType<Pick<Props, Exclude<keyof Props, 'navigation'>>>;

  export function StackRouter(routes: object, config: object): unknown;

  export function TabRouter(routes: object, config: object): unknown;
}
