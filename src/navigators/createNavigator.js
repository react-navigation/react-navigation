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
const createNavigator = (
  router: NavigationRouter<*, *, *>,
  routeConfigs: NavigationRouteConfigMap,
  navigatorConfig: any,
  navigatorType: NavigatorType
) => (View: NavigationNavigator<*, *, *, *>) => {
  class Navigator extends React.Component {
    props: NavigationNavigatorProps<*>;

    static router = router;

    static routeConfigs = routeConfigs;
    static navigatorConfig = navigatorConfig;
    static navigatorType = navigatorType;

    render() {
      return <View {...this.props} router={router} />;
    }
  }

  return Navigator;
};

export default createNavigator;
