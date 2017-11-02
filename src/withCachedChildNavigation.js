/* @flow */

import * as React from 'react';

import addNavigationHelpers from './addNavigationHelpers';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
} from './TypeDefinition';

type InputProps = {
  +navigation: NavigationScreenProp<NavigationState>,
};
type OutputProps = {
  childNavigationProps: {
    +[key: string]: NavigationScreenProp<NavigationRoute>,
  },
};

/**
 * HOC which caches the child navigation items.
 */
export default function withCachedChildNavigation<T: InputProps>(
  Comp: React.ComponentType<OutputProps & T>
): React.ComponentType<T> {
  // $FlowFixMe StatelessFunctionalComponent missing displayName Flow < 0.54.0
  const displayName: string = Comp.displayName || Comp.name;
  return class extends React.PureComponent<T> {
    static displayName = `withCachedChildNavigation(${displayName})`;

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps: T) {
      this._updateNavigationProps(nextProps.navigation);
    }

    _childNavigationProps: {
      [key: string]: NavigationScreenProp<NavigationRoute>,
    };

    _updateNavigationProps = (
      navigation: NavigationScreenProp<NavigationState>
    ) => {
      // Update props for each child route
      if (!this._childNavigationProps) {
        this._childNavigationProps = {};
      }
      navigation.state.routes.forEach((route: *) => {
        const childNavigation = this._childNavigationProps[route.key];
        if (childNavigation && childNavigation.state === route) {
          return;
        }
        this._childNavigationProps[route.key] = addNavigationHelpers({
          dispatch: navigation.dispatch,
          state: route,
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
