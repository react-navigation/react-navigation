/* @flow */

import React from 'react';

import type {
  NavigationRouter,
  NavigationNavigator,
  NavigationNavigatorProps,
  NavigationRouteConfigMap,
} from '../TypeDefinition';

import type { NavigatorType } from './NavigatorTypes';

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator<C: *, S, A, NavigatorConfig, Options>(
  router: NavigationRouter<S, A, Options>,
  routeConfigs?: NavigationRouteConfigMap,
  navigatorConfig?: NavigatorConfig,
  navigatorType?: NavigatorType
) {
  return (
    NavigationView: ReactClass<C>
  ): NavigationNavigator<C, S, A, Options> => {
    class Navigator extends React.Component {
      props: NavigationNavigatorProps<Options, S>;

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
