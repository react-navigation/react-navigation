import * as React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import withNavigation from './withNavigation';

export default function withNavigationFocus(Component) {
  class ComponentWithNavigationFocus extends React.Component {
    static displayName = `withNavigationFocus(${
      Component.displayName || Component.name
    })`;

    state = {
      isFocused: this.props.navigation.isFocused(),
    };

    componentDidMount() {
      const { navigation } = this.props;

      this.subscriptions = [
        navigation.addListener('willFocus', () =>
          this.setState({ isFocused: true })
        ),
        navigation.addListener('willBlur', () =>
          this.setState({ isFocused: false })
        ),
      ];
    }

    componentWillUnmount() {
      this.subscriptions?.forEach((sub) => sub.remove());
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

  return hoistStatics(
    withNavigation(ComponentWithNavigationFocus, { forwardRef: false }),
    Component
  );
}
