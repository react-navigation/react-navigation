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

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps) {
      this._updateNavigationProps(nextProps.navigation);
    }

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
        this._childNavigationProps[route.key] = addNavigationHelpers({
          dispatch: navigation.dispatch,
          state: route,
          addListener: getChildEventSubscriber(
            navigation.addListener,
            route.key
          ),
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
