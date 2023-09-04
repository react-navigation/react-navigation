import * as React from 'react';

import type { SceneRendererProps } from './types';

type SceneProps = {
  route: any;
} & Omit<SceneRendererProps, 'layout'>;

const SceneComponent = React.memo(
  <T extends { component: React.ComponentType<any> } & SceneProps>({
    component,
    ...rest
  }: T) => {
    return React.createElement(component, rest);
  }
);

export function SceneMap<T extends any>(scenes: {
  [key: string]: React.ComponentType<T>;
}) {
  return ({ route, jumpTo, position }: SceneProps) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
      position={position}
    />
  );
}
