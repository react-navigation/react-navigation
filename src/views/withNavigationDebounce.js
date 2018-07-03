import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import invariant from '../utils/invariant';
import withNavigation from './withNavigation';

export default function withNavigationFocus(Component, wait = 200) {
  class ComponentWithNavigationFocus extends React.Component {
    static displayName = `withNavigationDebounce(${Component.displayName ||
      Component.name})`;

    constructor(props) {
      super(props);

      this.state = {
        isFocused: props.navigation ? props.navigation.isFocused() : false,
      };
    }

    componentDidMount() {
      const { navigation } = this.props;
      invariant(
        !!navigation,
        'withNavigationDebounce can only be used on a view hierarchy of a navigator. The wrapped component is unable to get access to navigation from props or context.'
      );
    }

    lastCalled = Date.now();

    goBack = (...args) => {
      if (Date.now() - this.lastCalled <= wait) {
        return;
      }
      this.lastCalled = Date.now();
      this.props.navigation.goBack(...args);
    }

    pop = (...args) => {
      if (Date.now() - this.lastCalled <= wait) {
        return;
      }
      this.lastCalled = Date.now();
      this.props.navigation.goBack(...args);
    }

    navigate = (...args) => {
      if (Date.now() - this.lastCalled <= wait) {
        return;
      }
      this.lastCalled = Date.now();
      this.props.navigation.goBack(...args);
    }

    push = (...args) => {
      if (Date.now() - this.lastCalled <= wait) {
        return;
      }
      this.lastCalled = Date.now();
      this.props.navigation.goBack(...args);
    }

    render() {
      return (
        <Component
          {...this.props}
          ref={this.props.onRef}
          navigation={{
            ...this.props.navigation,
            goBack: this.goBack,
            navigate: this.navigate,
            push: this.push,
            pop: this.pop,
          }}
        />
      );
    }
  }

  return hoistStatics(withNavigation(ComponentWithNavigationFocus), Component);
}
