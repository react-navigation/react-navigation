import React from 'react';

import getChildEventSubscriber from '../getChildEventSubscriber';
import addNavigationHelpers from '../addNavigationHelpers';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    childEventSubscribers = {};

    // Cleanup subscriptions for routes that no longer exist
    componentDidUpdate() {
      const activeKeys = this.props.navigation.state.routes.map(r => r.key);
      Object.keys(this.childEventSubscribers).forEach(key => {
        if (!activeKeys.includes(key)) {
          this.childEventSubscribers[key].removeAll();
          delete this.childEventSubscribers[key];
        }
      });
    }

    // Remove all subscriptions
    componentWillUnmount() {
      Object.values(this.childEventSubscribers).map(s => s.removeAll());
    }

    _isRouteFocused = route => () => {
      const { state } = this.props.navigation;
      const focusedRoute = state.routes[state.index];
      return route === focusedRoute;
    };

    _dangerouslyGetParent = () => {
      return this.props.navigation;
    };

    render() {
      const { navigation, screenProps } = this.props;
      const { dispatch, state, addListener } = navigation;
      const { routes } = state;

      const descriptors = {};
      routes.forEach(route => {
        const getComponent = () =>
          router.getComponentForRouteName(route.routeName);

        if (!this.childEventSubscribers[route.key]) {
          this.childEventSubscribers[route.key] = getChildEventSubscriber(
            addListener,
            route.key
          );
        }

        const childNavigation = addNavigationHelpers({
          dispatch,
          state: route,
          dangerouslyGetParent: this._dangerouslyGetParent,
          addListener: this.childEventSubscribers[route.key].addListener,
          isFocused: () => this._isRouteFocused(route),
        });

        const options = router.getScreenOptions(childNavigation, screenProps);
        descriptors[route.key] = {
          key: route.key,
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
      });

      return (
        <NavigatorView
          screenProps={screenProps}
          navigation={navigation}
          navigationConfig={navigationConfig}
          descriptors={descriptors}
        />
      );
    }
  }
  return Navigator;
}

export default createNavigator;
