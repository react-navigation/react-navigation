import React from 'react';
import propTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

export default function withNavigationFocus(Component) {
  class ComponentWithNavigationFocus extends React.Component {
    static displayName = `withNavigationFocus(${Component.displayName ||
      Component.name})`;

    state = {
      isFocused: false,
    };

    componentDidMount() {
      if (this.props.navigation) {
        this.subs = [
          this.props.navigation.addListener('didFocus', () =>
            this.setState({ isFocused: true })
          ),
          this.props.navigation.addListener('willBlur', () =>
            this.setState({ isFocused: false })
          ),
        ];
      } else {
        console.warn(
          'withNavigationFocus wrapped component did not receive navigation from props, so isFocused prop will remain false'
        );
      }
    }

    componentWillUnmount() {
      this.subs && this.subs.forEach(sub => sub.remove());
    }

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
