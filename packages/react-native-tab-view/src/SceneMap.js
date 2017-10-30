/* @flow */

import React, { PureComponent } from 'react';

export default function SceneMap(scenes: { [key: string]: Function }) {
  class SceneComponent extends PureComponent<*> {
    render() {
      return React.createElement(scenes[this.props.route.key], this.props);
    }
  }

  return ({ route }: *) => <SceneComponent key={route.key} route={route} />;
}
