import React from 'react';
import propTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import invariant from '../utils/invariant';
import { NavigationConsumer } from './NavigationContext';

export default function withNavigation(Component) {
  class ComponentWithNavigation extends React.Component {
    static displayName = `withNavigation(${Component.displayName ||
      Component.name})`;

    render() {
      const navigationProp = this.props.navigation;
      return (
        <NavigationConsumer>
          {navigationContext => {
            const navigation = navigationProp || navigationContext;
            invariant(
              !!navigation,
              'withNavigation can only be used on a view hierarchy of a navigator. The wrapped component is unable to get access to navigation from props or context.'
            );
            return (
              <Component
                {...this.props}
                navigation={navigation}
                ref={this.props.onRef}
              />
            );
          }}
        </NavigationConsumer>
      );
    }
  }

  return hoistStatics(ComponentWithNavigation, Component);
}
