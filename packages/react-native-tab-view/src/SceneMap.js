/* @flow */

import * as React from 'react';
import type { SceneComponentProps } from './TypeDefinitions';

class SceneComponent extends React.PureComponent<*> {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}

export default function SceneMap<T: *>(scenes: {
  [key: string]: SceneComponentProps<T>,
}) {
  return ({ route, jumpTo }: *) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
    />
  );
}
