/* @flow */

import * as React from 'react';

class SceneComponent extends React.PureComponent<*> {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}

export default function SceneMap<T: *>(scenes: {
  [key: string]: React.ComponentType<T>,
}) {
  return ({ route, jumpTo }: T) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
    />
  );
}
