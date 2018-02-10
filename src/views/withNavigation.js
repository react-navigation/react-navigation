import React from 'react';
import propTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

export default function withNavigation(Component) {
  class ComponentWithNavigation extends React.Component {
    static displayName = `withNavigation(${Component.displayName ||
      Component.name})`;

    static contextTypes = {
      navigation: propTypes.object.isRequired,
    };

    render() {
      const { navigation } = this.context;
      return (
        <Component
          {...this.props}
          navigation={navigation}
          ref={this.props.onRef}
        />
      );
    }
  }

  return hoistStatics(ComponentWithNavigation, Component);
}
