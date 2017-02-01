/**
 * @flow
 */

import React, { Component } from 'react';
import {
  NativeModules,
} from 'react-native';
import {
  NavigationActions,
  addNavigationHelpers,
} from 'react-navigation';

const {
  HybridNavigationManager,
} = NativeModules;

const HybridContainer = (ReactScreens) => {
  class HybridAppScreen extends Component {
    constructor(props) {
      super(props);
      const { name, params, rootTag } = props;
      let ScreenView = ReactScreens[name];
      let screenKey = name;
      let navState = null;
      const action = NavigationActions.navigate({ routeName: name, params };
      if (!ScreenView) {
        // Deep linking magic here. Try each screen to see if the state changes
        // in response to this action. The first screen who returns
        // a new state for the action is used
        Object.keys(ReactScreens).forEach(screenId => {
          if (!ScreenView) {
            const V = ReactScreens[screenId];
            if (!V || !V.router || !V.router.getStateForAction) {
              return;
            }
            const baseState = V.router.getStateForAction(NavigationActions.init());
            const linkedState = V.router.getStateForAction(action, baseState);
            if (baseState !== linkedState) {
              ScreenView = V;
              navState = linkedState;
              screenKey = screenId;
            }
          }
        });
      }
      if (!ScreenView) {
        screenKey = 'NotFoundComponent';
        ScreenView = ReactScreens.NotFoundComponent;
      }
      if (!navState) {
        const router = ScreenView.router;
        navState = router && router.getStateForAction(action);
      }
      let title = null;
      const defaultNavState = { routeName: name, key: `screen-${rootTag}`, params };
      if (navState) {
        const { routes, index } = navState;
        const router = ScreenView.router;
        const routeConfig = router && router.getScreenConfig({
          state: routes[index], dispatch: () => {}
        }, index, true);
        title = routeConfig && routeConfig.title;
      }
      this.state = {
        navState: navState || defaultNavState,
        screenKey,
      };
      HybridNavigationManager.setTitle(rootTag, title || name);
    }

    dispatch = (action) => {
      const { name, rootTag } = this.props;
      const ScreenView = ReactScreens[this.state.screenKey] || ReactScreens.NotFoundComponent;
      const router = ScreenView.router;
      const navState = router && router.getStateForAction(action, this.state.navState);
      if (navState && navState !== this.state.navState) {
        this.setState({ navState });
        return true;
      }
      if (action.type === NavigationActions.NAVIGATE) {
        HybridNavigationManager.navigate(action.routeName, action.params || {});
      }
      return true;
    }

    render() {
      const Component = ReactScreens[this.state.screenKey] || ReactScreens.NotFoundComponent;
      const navigation = addNavigationHelpers({
        state: this.state.navState,
        dispatch: this.dispatch,
      });
      return (
        <Component navigation={navigation} />
      );
    }
    componentWillUpdate(props, state) {
      const { name, rootTag } = props;
      const ScreenView = ReactScreens[name];
      if (!ScreenView) {
        console.log('Experiencing an error! Fix me!')
      }
      let title = null;
      if (state.navState) {
        const { routes, index } = state.navState;
        const router = ScreenView.router;
        const routeConfig = router && router.getScreenConfig({
          state: routes[index], dispatch: () => {}
        }, index, true);
        title = (routeConfig && routeConfig.title) || route.routeName;
      }
      HybridNavigationManager.setTitle(rootTag, title || name);
    }
  }
  return HybridAppScreen;
};

export default HybridContainer;
