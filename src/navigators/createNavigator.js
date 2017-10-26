/* @flow */

import * as React from 'react';

import type {
  NavigationRouter,
  NavigationNavigator,
  NavigationNavigatorProps,
  NavigationRouteConfigMap,
  NavigationAction,
  NavigationState,
} from '../TypeDefinition';

import type { NavigatorType } from './NavigatorTypes';

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator<
  C: {},
  S: NavigationState,
  A: NavigationAction,
  NavigatorConfig,
  Options: {}
>(
  router: NavigationRouter<S, A, Options>,
  routeConfigs?: NavigationRouteConfigMap,
  navigatorConfig?: NavigatorConfig,
  navigatorType?: NavigatorType
) {
  return (
    NavigationView: React.ComponentType<C>
  ): NavigationNavigator<C, S, A, Options> => {
    class Navigator extends React.Component<
      NavigationNavigatorProps<Options, S>
    > {
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
