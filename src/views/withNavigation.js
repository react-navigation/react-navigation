/* @flow */

import * as React from 'react';
import propTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

import type { NavigationScreenProp, NavigationState } from '../TypeDefinition';

type Context = {
  navigation: NavigationScreenProp<NavigationState>,
};

type InjectedProps = {
  navigation: NavigationScreenProp<NavigationState>,
};

export default function withNavigation<T: {}>(
  Component: React.ComponentType<T & InjectedProps>
) {
  const componentWithNavigation = (props: T, { navigation }: Context) => (
    <Component {...props} navigation={navigation} />
  );

  // $FlowFixMe StatelessFunctionalComponent missing displayName Flow < 0.54.0
  const displayName: string = Component.displayName || Component.name;
  componentWithNavigation.displayName = `withNavigation(${displayName})`;

  componentWithNavigation.contextTypes = {
    navigation: propTypes.object.isRequired,
  };

  return hoistStatics(componentWithNavigation, Component);
}
