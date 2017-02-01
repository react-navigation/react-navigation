/* @flow */

import React from 'react';

import { ContextWithNavigation } from '../TypeDefinition';

export default function (Component: ReactClass<T>) {
  const withNavigation = (props: T, { navigation }: ContextWithNavigation) => (
    <Component {...props} navigation={navigation} />
  );

  withNavigation.contextTypes = {
    navigation: React.PropTypes.object.isRequired,
  };

  return withNavigation;
}
