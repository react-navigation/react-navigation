/* eslint-disable react/sort-comp */

import React from 'react';
import { NavigationActions, getNavigation, NavigationProvider } from '../index';

export default function createNavigationContainer(Component) {
  class NavigationContainer extends React.Component {
    static router = Component.router;
    static navigationOptions = null;

    constructor(props) {
      super(props);

      this._initialAction = NavigationActions.init();

      this.state = {
        nav: !props.loadNavigationState
          ? Component.router.getStateForAction(this._initialAction)
          : null,
      };
    }

    _actionEventSubscribers = new Set();

    _onNavigationStateChange(prevNav, nav, action) {
      if (typeof this.props.onNavigationStateChange === 'function') {
        this.props.onNavigationStateChange(prevNav, nav, action);
      }
    }

    componentDidUpdate() {
      // Clear cached _navState every tick
      if (this._navState === this.state.nav) {
        this._navState = null;
      }
    }

    async componentDidMount() {
      // Initialize state. This must be done *after* any async code
      // so we don't end up with a different value for this.state.nav
      // due to changes while async function was resolving
      let action = this._initialAction;
      // eslint-disable-next-line react/no-access-state-in-setstate
      let startupState = this.state.nav;
      if (!startupState) {
        startupState = Component.router.getStateForAction(action);
      }

      const dispatchActions = () =>
        this._actionEventSubscribers.forEach((subscriber) =>
          subscriber({
            type: 'action',
            action,
            state: this.state.nav,
            lastState: null,
          })
        );

      if (startupState === this.state.nav) {
        dispatchActions();
        return;
      }

      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ nav: startupState }, () => {
        dispatchActions();
      });
    }

    dispatch = (action) => {
      if (this.props.navigation) {
        return this.props.navigation.dispatch(action);
      }

      // navState will have the most up-to-date value, because setState sometimes behaves asyncronously
      this._navState = this._navState || this.state.nav;
      const lastNavState = this._navState;

      const reducedState = Component.router.getStateForAction(
        action,
        lastNavState
      );
      const navState = reducedState === null ? lastNavState : reducedState;

      const dispatchActionEvents = () => {
        this._actionEventSubscribers.forEach((subscriber) =>
          subscriber({
            type: 'action',
            action,
            state: navState,
            lastState: lastNavState,
          })
        );
      };

      if (reducedState === null) {
        // The router will return null when action has been handled and the state hasn't changed.
        // dispatch returns true when something has been handled.
        dispatchActionEvents();
        return true;
      }

      if (navState !== lastNavState) {
        // Cache updates to state.nav during the tick to ensure that subsequent calls will not discard this change
        this._navState = navState;
        this.setState({ nav: navState }, () => {
          this._onNavigationStateChange(lastNavState, navState, action);
          dispatchActionEvents();
        });
        return true;
      }

      dispatchActionEvents();
      return false;
    };

    render() {
      let navigation = this.props.navigation;

      const navState = this.state.nav;

      if (!navState) {
        return null;
      }

      if (!this._navigation || this._navigation.state !== navState) {
        this._navigation = getNavigation(
          Component.router,
          navState,
          this.dispatch,
          this._actionEventSubscribers,
          this._getScreenProps,
          () => this._navigation
        );
      }

      navigation = this._navigation;

      return (
        <NavigationProvider value={navigation}>
          <Component {...this.props} navigation={navigation} />
        </NavigationProvider>
      );
    }
  }

  return NavigationContainer;
}
