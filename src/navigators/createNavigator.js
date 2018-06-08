import React from 'react';
import { polyfill } from 'react-lifecycles-compat';

import getChildEventSubscriber from '../getChildEventSubscriber';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    constructor(props) {
      super(props);

      this.state = {
        descriptors: {},
        childEventSubscribers: {},
        screenProps: props.screenProps,
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { navigation, screenProps } = nextProps;
      const { dispatch, state, addListener } = navigation;
      const { routes } = state;
      if (typeof routes === 'undefined') {
        throw new TypeError(
          'No "routes" found in navigation state. Did you try to pass the navigation prop of a React component to a Navigator child? See https://reactnavigation.org/docs/en/custom-navigators.html#navigator-navigation-prop'
        );
      }

      const descriptors = { ...prevState.descriptors };
      const childEventSubscribers = { ...prevState.childEventSubscribers };

      routes.forEach(route => {
        if (
          !descriptors[route.key] ||
          descriptors[route.key].state !== route ||
          screenProps !== prevState.screenProps
        ) {
          const getComponent = () =>
            router.getComponentForRouteName(route.routeName);

          if (!childEventSubscribers[route.key]) {
            childEventSubscribers[route.key] = getChildEventSubscriber(
              addListener,
              route.key
            );
          }

          const actionCreators = {
            ...navigation.actions,
            ...router.getActionCreators(route, state.key),
          };
          const actionHelpers = {};
          Object.keys(actionCreators).forEach(actionName => {
            actionHelpers[actionName] = (...args) => {
              const actionCreator = actionCreators[actionName];
              const action = actionCreator(...args);
              return dispatch(action);
            };
          });
          const childNavigation = {
            ...actionHelpers,
            actions: actionCreators,
            dispatch,
            state: route,
            addListener: childEventSubscribers[route.key].addListener,
            getParam: (paramName, defaultValue) => {
              const params = route.params;

              if (params && paramName in params) {
                return params[paramName];
              }

              return defaultValue;
            },
          };

          const options = router.getScreenOptions(childNavigation, screenProps);
          descriptors[route.key] = {
            key: route.key,
            getComponent,
            options,
            state: route,
            navigation: childNavigation,
          };
        }
      });

      return {
        descriptors,
        childEventSubscribers,
        screenProps,
      };
    }

    // Cleanup subscriptions for routes that no longer exist
    componentDidUpdate() {
      const activeKeys = this.props.navigation.state.routes.map(r => r.key);
      let childEventSubscribers = { ...this.state.childEventSubscribers };
      Object.keys(childEventSubscribers).forEach(key => {
        if (!activeKeys.includes(key)) {
          delete childEventSubscribers[key];
        }
      });
      if (
        childEventSubscribers.length !== this.state.childEventSubscribers.length
      ) {
        this.setState({ childEventSubscribers });
      }
    }

    _isRouteFocused = route => {
      const { state } = this.props.navigation;
      const focusedRoute = state.routes[state.index];
      return route === focusedRoute;
    };

    _dangerouslyGetParent = () => {
      return this.props.navigation;
    };

    render() {
      // Mutation in render 😩
      // The problem:
      // - We don't want to re-render each screen every time the parent navigator changes
      // - But we need to be able to access the parent navigator from callbacks
      // - These functions should only be used within callbacks, but they are passed in props,
      //   which is what makes this awkward. What's a good way to pass in stuff that we don't
      //   want people to depend on in render?
      let descriptors = { ...this.state.descriptors };
      Object.values(descriptors).forEach(descriptor => {
        descriptor.navigation.isFocused = () =>
          this._isRouteFocused(descriptor.state);
        descriptor.navigation.dangerouslyGetParent = this._dangerouslyGetParent;
      });

      return (
        <NavigatorView
          {...this.props}
          screenProps={this.props.screenProps}
          navigation={this.props.navigation}
          navigationConfig={navigationConfig}
          descriptors={descriptors}
        />
      );
    }
  }

  return polyfill(Navigator);
}

export default createNavigator;
