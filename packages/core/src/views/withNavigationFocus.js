import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import withNavigation from './withNavigation';

export default function withNavigationFocus(Component) {
  class ComponentWithNavigationFocus extends React.Component {
    static displayName = `withNavigationFocus(${Component.displayName ||
      Component.name})`;

    constructor(props) {
      super(props);

      this.state = {
        isFocused: props.navigation ? props.navigation.isFocused() : false,
      };
    }

    componentDidMount() {
      const { navigation } = this.props;
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
