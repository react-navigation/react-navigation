/* @flow */

import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

import { ContextWithNavigation } from '../TypeDefinition';

export default function withNavigation(Component: ReactClass<T>) {
  const componentWithNavigation = (props: T, { navigation }: ContextWithNavigation) => (
    <Component {...props} navigation={navigation} />
  );

  componentWithNavigation.displayName = `withNavigation(${Component.displayName || Component.name})`;

  componentWithNavigation.contextTypes = {
    navigation: React.PropTypes.object.isRequired,
  };

  return hoistStatics(componentWithNavigation, Component);
}
