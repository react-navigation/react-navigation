/* @flow */

import React, { PureComponent } from 'react';

export default function SceneMap(scenes: { [key: string]: Function }) {
  class SceneComponent extends PureComponent<void, *, void> {
    render() {
      /* eslint-disable react/prop-types */
      return React.createElement(scenes[this.props.route.key], this.props);
    }
  }

  return ({ route }: *) => <SceneComponent key={route.key} route={route} />;
}
