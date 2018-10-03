import React from 'react';
import { polyfill } from 'react-lifecycles-compat';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    state = {
      descriptors: {},
      screenProps: this.props.screenProps,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
      const prevDescriptors = prevState.descriptors;
      const { navigation, screenProps } = nextProps;
      const { state } = navigation;
      const { routes } = state;
      if (typeof routes === 'undefined') {
        throw new TypeError(
          'No "routes" found in navigation state. Did you try to pass the navigation prop of a React component to a Navigator child? See https://reactnavigation.org/docs/en/custom-navigators.html#navigator-navigation-prop'
        );
      }

      const descriptors = {};

      routes.forEach(route => {
        if (
          prevDescriptors &&
          prevDescriptors[route.key] &&
          route === prevDescriptors[route.key].state &&
          screenProps === prevState.screenProps
        ) {
          descriptors[route.key] = prevDescriptors[route.key];
          return;
        }
        const getComponent = router.getComponentForRouteName.bind(
          null,
          route.routeName
        );
        const childNavigation = navigation.getChildNavigation(route.key);
        const options = router.getScreenOptions(childNavigation, screenProps);
        descriptors[route.key] = {
          key: route.key,
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
      });

      return { descriptors, screenProps };
    }

    render() {
      return (
        <NavigatorView
          {...this.props}
          screenProps={this.state.screenProps}
          navigation={this.props.navigation}
          navigationConfig={navigationConfig}
          descriptors={this.state.descriptors}
        />
      );
    }
  }

  return polyfill(Navigator);
}

export default createNavigator;
