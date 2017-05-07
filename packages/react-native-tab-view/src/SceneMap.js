/* @flow */

import React, { PureComponent } from 'react';

export default function SceneMap(scenes: { [key: string]: Function }) {
  return ({ route }: *) => {
    class SceneComponent extends PureComponent {
      static displayName = `SceneMap(${route.key})`;

      render() {
        return React.createElement(scenes[route.key], this.props);
      }
    }
    return <SceneComponent key={route.key} route={route} />;
  };
}
