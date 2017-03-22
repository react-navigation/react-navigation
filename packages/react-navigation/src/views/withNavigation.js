/* @flow */

import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

import type {
  NavigationState,
  NavigationRoute,
  NavigationAction,
} from '../TypeDefinition';

type Context = {
  navigation: InjectedProps<NavigationState, NavigationAction>,
};

type InjectedProps = {
  navigation: InjectedProps<NavigationState, NavigationAction>,
};


export default function withNavigation<T: *>(Component: ReactClass<T & InjectedProps>) {
  const componentWithNavigation = (props: T, { navigation }: Context) => (
    <Component {...props} navigation={navigation} />
  );

  componentWithNavigation.displayName = `withNavigation(${Component.displayName || Component.name})`;

  componentWithNavigation.contextTypes = {
    navigation: React.PropTypes.object.isRequired,
  };

  return hoistStatics(componentWithNavigation, Component);
}
