/* @flow */

import * as React from 'react';

import type {
  NavigationRouter,
  NavigationNavigator,
  NavigationNavigatorProps,
  NavigationRouteConfigMap,
  NavigationAction,
  NavigationState,
  NavigationScreenProp,
} from '../TypeDefinition';

import type { NavigatorType } from './NavigatorTypes';

type InjectedProps<S: NavigationState, A: NavigationAction, O: *> = {
  router: NavigationRouter<S, A, O>,
};

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator<
  S: NavigationState,
  A: *,
  NavigatorConfig,
  O: *
>(
  router: NavigationRouter<S, A, O>,
  routeConfigs?: NavigationRouteConfigMap,
  navigatorConfig?: NavigatorConfig,
  navigatorType?: NavigatorType
) {
  return (
    NavigationView: React.ComponentType<
      InjectedProps<S, A, O> & NavigationNavigatorProps<O, S>
    >
  ): NavigationNavigator<S, A, O> => {
    class Navigator extends React.Component<NavigationNavigatorProps<O, S>> {
      static router = router;

      static routeConfigs = routeConfigs;
      static navigatorConfig = navigatorConfig;
      static navigatorType = navigatorType;

      render() {
        return <NavigationView {...this.props} router={router} />;
      }
    }

    return Navigator;
  };
}
