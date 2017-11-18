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

// Props we want createNavigator to Inject
type RouterProp<S: NavigationState, O: {}> = {
  router: NavigationRouter<S, O>,
};

// Export this type so that navigators can use this to type their props
export type NavigatorProps<S: NavigationState, O: {}> = RouterProp<S, O> &
  NavigationNavigatorProps<O, S>;

// Type of the View passed into createNavigator
type NavigationViewType<
  Props: {},
  S: NavigationState,
  O: *
> = React.ComponentType<NavigationNavigatorProps<O, S> & Props>;

// NavigatorCreator type
type _NavigatorCreator<NavigationViewProps: {}, S: NavigationState, O: {}> = (
  NavigationView: React.ComponentType<RouterProp<S, O> & NavigationViewProps>
) => NavigationNavigator<S, O, NavigationViewProps>;

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator<
  S: NavigationState,
  O: {},
  NavigatorConfig: {},
  NavigationViewProps: NavigationNavigatorProps<O, S>
>(
  router: NavigationRouter<S, O>,
  routeConfigs?: NavigationRouteConfigMap,
  navigatorConfig?: NavigatorConfig,
  navigatorType?: NavigatorType
): _NavigatorCreator<NavigationViewProps, S, O> {
  return (
    NavigationView: React.ComponentType<RouterProp<S, O> & NavigationViewProps>
  ): NavigationNavigator<S, O, NavigationViewProps> => {
    class Navigator extends React.Component<NavigationViewProps> {
      static router = router;

      static routeConfigs = routeConfigs;
      static navigatorConfig = navigatorConfig;
      static navigatorType = navigatorType;
      static navigationOptions = null;

      render() {
        return <NavigationView {...this.props} router={router} />;
      }
    }

    return Navigator;
  };
}
