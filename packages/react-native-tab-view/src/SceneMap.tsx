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

SceneComponent.displayName = 'SceneComponent';

export function SceneMap<T>(scenes: { [key: string]: React.ComponentType<T> }) {
  return ({ route, jumpTo, position }: SceneProps) => {
    const component = scenes[route.key];

    if (component == null) {
      throw new Error(`Couldn't find a scene for route '${route.key}'.`);
    }

    return (
      <SceneComponent
        key={route.key}
        component={component}
        route={route}
        jumpTo={jumpTo}
        position={position}
      />
    );
  };
}
