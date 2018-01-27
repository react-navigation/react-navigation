import React from 'react';
import propTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

export default function withNavigation(Component) {
  const componentWithNavigation = (props, { navigation }) => (
    <Component {...props} navigation={navigation} />
  );

  const displayName = Component.displayName || Component.name;
  componentWithNavigation.displayName = `withNavigation(${displayName})`;

  componentWithNavigation.contextTypes = {
    navigation: propTypes.object.isRequired,
  };

  return hoistStatics(componentWithNavigation, Component);
}
