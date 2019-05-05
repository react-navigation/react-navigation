declare module '@react-navigation/core' {
  import * as React from 'react';

  export const StackActions: {
    completeTransition<T extends { key?: string } | undefined>(
      options?: T
    ): { type: string } & T;
  };

  export const NavigationActions: {
    back(action: { key: string; immediate?: boolean });
  };

  export const NavigationProvider: React.ComponentType<{
    value: object;
  }>;

  export const SceneView: React.ComponentType<{
    screenProps: unknown;
    navigation: object;
    component: React.ComponentType<any>;
  }>;

  export function createNavigator(
    StackView: React.ComponentType<any>,
    router: any,
    stackConfig: object
  ): React.ComponentType;

  export function withNavigation<Props extends { navigation: object }>(
    Comp: React.ComponentType<Props>
  ): React.ComponentType<Pick<Props, Exclude<keyof Props, 'navigation'>>>;

  export function StackRouter(routeConfigMap: object, stackConfig: object);
}
