/* @flow */

import * as React from 'react';

export default function SceneMap<T: *>(scenes: {
  [key: string]: React.ComponentType<{
    route: T,
    jumpTo: (key: string) => mixed,
  }>,
}) {
  class SceneComponent extends React.PureComponent<*> {
    render() {
      return React.createElement(scenes[this.props.route.key], this.props);
    }
  }

  return ({ route, jumpTo, jumpToIndex }: *) => (
    <SceneComponent
      key={route.key}
      route={route}
      jumpTo={jumpTo}
      jumpToIndex={jumpToIndex}
    />
  );
}
