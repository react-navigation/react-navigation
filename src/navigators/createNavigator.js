/* @flow */

import * as React from 'react';

import type {
  NavigationRouter,
  NavigationNavigator,
  NavigationNavigatorProps,
  NavigationRouteConfigMap,
  NavigationState,
  NavigationScreenProp,
} from '../TypeDefinition';

import type { NavigatorType } from './NavigatorTypes';

type InjectedProps<S: NavigationState, O: *> = {
  router: NavigationRouter<S, O>,
};

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator<
  S: NavigationState,
  NavigatorConfig,
  O: *
>(
  router: NavigationRouter<S, O>,
  routeConfigs?: NavigationRouteConfigMap,
  navigatorConfig?: NavigatorConfig,
  navigatorType?: NavigatorType
) {
  return (
    NavigationView: React.ComponentType<
      InjectedProps<S, O> & NavigationNavigatorProps<O, S>
    >
  ): NavigationNavigator<S, O> => {
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
