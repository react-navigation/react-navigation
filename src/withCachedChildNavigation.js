import React from 'react';
import addNavigationHelpers from './addNavigationHelpers';
import getChildEventSubscriber from './getChildEventSubscriber';

/**
 * HOC which caches the child navigation items.
 */
export default function withCachedChildNavigation(Comp) {
  const displayName = Comp.displayName || Comp.name;
  return class extends React.PureComponent {
    static displayName = `withCachedChildNavigation(${displayName})`;

    _childEventSubscribers = {};

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps) {
      this._updateNavigationProps(nextProps.navigation);
    }

    componentDidUpdate() {
      const activeKeys = this.props.navigation.state.routes.map(
        route => route.key
      );
      Object.keys(this._childEventSubscribers).forEach(key => {
        if (!activeKeys.includes(key)) {
          delete this._childEventSubscribers[key];
        }
      });
    }

    _isRouteFocused = route => {
      const { state } = this.props.navigation;
      const focusedRoute = state.routes[state.index];
      return route === focusedRoute;
    };

    _updateNavigationProps = navigation => {
      // Update props for each child route
      if (!this._childNavigationProps) {
        this._childNavigationProps = {};
      }
      navigation.state.routes.forEach(route => {
        const childNavigation = this._childNavigationProps[route.key];
        if (childNavigation && childNavigation.state === route) {
          return;
        }

        if (!this._childEventSubscribers[route.key]) {
          this._childEventSubscribers[route.key] = getChildEventSubscriber(
            navigation.addListener,
            route.key
          );
        }

        this._childNavigationProps[route.key] = addNavigationHelpers({
          dispatch: navigation.dispatch,
          state: route,
          isFocused: () => this._isRouteFocused(route),
          addListener: this._childEventSubscribers[route.key],
        });
      });
    };

    render() {
      return (
        <Comp
          {...this.props}
          childNavigationProps={this._childNavigationProps}
        />
      );
    }
  };
}
