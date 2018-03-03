import React from 'react';
import propTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import invariant from '../utils/invariant';

export default function withNavigationFocus(Component) {
  class ComponentWithNavigationFocus extends React.Component {
    static displayName = `withNavigationFocus(${Component.displayName ||
      Component.name})`;

    static contextTypes = {
      navigation: propTypes.object.isRequired,
    };

    constructor(props, context) {
      super();

      this.state = {
        isFocused: this.getNavigation(props, context).isFocused(),
      };
    }

    componentDidMount() {
      const navigation = this.getNavigation();
      this.subscriptions = [
        navigation.addListener('didFocus', () =>
          this.setState({ isFocused: true })
        ),
        navigation.addListener('willBlur', () =>
          this.setState({ isFocused: false })
        ),
      ];
    }

    componentWillUnmount() {
      this.subscriptions.forEach(sub => sub.remove());
    }

    getNavigation = (props = this.props, context = this.context) => {
      const navigation = props.navigation || context.navigation;
      invariant(
        !!navigation,
        'withNavigationFocus can only be used on a view hierarchy of a navigator. The wrapped component is unable to get access to navigation from props or context.'
      );
      return navigation;
    };

    render() {
      return (
        <Component
          {...this.props}
          isFocused={this.state.isFocused}
          ref={this.props.onRef}
        />
      );
    }
  }

  return hoistStatics(ComponentWithNavigationFocus, Component);
}
