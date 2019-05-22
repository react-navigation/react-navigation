import * as React from 'react';

class SceneComponent<
  T extends { component: React.ComponentType<any> }
> extends React.PureComponent<T> {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}

export default function SceneMap<T extends any>(scenes: {
  [key: string]: React.ComponentType<T>;
}) {
  return ({ route, jumpTo, position }: T) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
      position={position}
    />
  );
}
