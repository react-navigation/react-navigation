// TODO: properly export types from @react-navigation/core!
declare module '@react-navigation/core' {
  import * as React from 'react';

  export type SupportedThemes = 'light' | 'dark';
  export const ThemeContext: React.Context<SupportedThemes>;
  export const ThemeConsumer: ThemeContext.Consumer;

  export interface Theme {
    header: string;
    headerBorder: string;
    body: string;
    bodyBorder: string;
    bodyContent: string;
    bodyContentBorder: string;
    label: string;
  }

  export const ThemeColors: { [k in SupportedThemes]: Theme };

  export const SceneView: React.ComponentType<{
    screenProps: unknown;
    navigation: object;
    component: React.ComponentType<any>;
  }>;

  export function createNavigator(
    NavigationView: any,
    router: any,
    navigatorConfig: object
  ): React.ComponentType<any> & { router: any };

  export function withNavigation<Props extends { navigation: object }>(
    Comp: React.ComponentType<Props>
  ): React.ComponentType<Pick<Props, Exclude<keyof Props, 'navigation'>>>;

  export namespace NavigationActions {
    export const BACK: any;
    export const NAVIGATE: any;
    export const INIT: any;
    export const setParams: (options: any) => any;
    export const navigate: (options: any) => any;
    export const back: (options?: any) => any;
    export const init: (options?: any) => any;
  }

  export function StackRouter(routes: any, config?: any): any;
  export function SwitchRouter(routes: any, config?: any): any;
  export function TabRouter(routes: any, config?: any): any;
}
