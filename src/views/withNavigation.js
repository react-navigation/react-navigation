/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
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
    navigation: PropTypes.object.isRequired,
  };

  return hoistStatics(componentWithNavigation, Component);
}
