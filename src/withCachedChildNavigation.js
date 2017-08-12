/* @flow */

import React, { PureComponent } from 'react';

import addNavigationHelpers from './addNavigationHelpers';

import type { NavigationScreenProp, NavigationAction } from './TypeDefinition';

type InjectedProps<N> = {
  childNavigationProps: {
    [key: string]: N,
  },
};

/**
 * HOC which caches the child navigation items.
 */
export default function withCachedChildNavigation<T: *, N: *>(
  Comp: ReactClass<T & InjectedProps<N>>
): ReactClass<T> {
  return class extends PureComponent {
    static displayName = `withCachedChildNavigation(${Comp.displayName ||
      Comp.name})`;

    props: T;

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps: T) {
      this._updateNavigationProps(nextProps.navigation);
    }

    _childNavigationProps: {
      [key: string]: NavigationScreenProp<N, NavigationAction>,
    };

    _updateNavigationProps = (
      navigation: NavigationScreenProp<N, NavigationAction>
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
