/* @flow */

import React, { PureComponent } from 'react';

import addNavigationHelpers from './addNavigationHelpers';


import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationAction,
} from './TypeDefinition';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
};

/**
 * HOC which caches the child navigation items.
 */
export default function withCachedChildNavigation<T: Props>(Comp: ReactClass<T>): ReactClass<T> {
  return class extends PureComponent<void, T, void> {

    static displayName = `withCachedChildNavigation(${Comp.displayName || Comp.name})`;

    props: T;

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps: T) {
      this._updateNavigationProps(nextProps.navigation);
    }

    _childNavigationProps: {
      [key: string]: NavigationScreenProp<NavigationRoute, NavigationAction>,
    };

    _updateNavigationProps = (
      navigation: NavigationScreenProp<NavigationState, NavigationAction>
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
          ...navigation,
          state: route,
        });
      });
    }

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
