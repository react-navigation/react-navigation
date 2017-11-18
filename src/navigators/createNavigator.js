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

// NavigatorCreator type
type _NavigatorCreator<Props: {}, S, O> = (
  NavigationView: React.ComponentType<InjectedProps<S, O> & Props>
) => NavigationNavigator<S, O>;

// Type of the View passed into createNavigator
type NavigationViewType<Props: {}, S, O> = React.ComponentType<
  InjectedProps<S, O> & Props
>;

// Props we want createNavigator to Inject
type InjectedProps<S, O> = {
  router: NavigationRouter<S, O>,
};

// Export this type so that navigators can use this to type their props
export type NavigatorProps<S: NavigationState, O: {}> = InjectedProps<S, O> &
  NavigationNavigatorProps<O, S>;

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator<
  NavigationViewProps: {},
  S: NavigationState,
  O: {},
  NavigatorConfig: {}
>(
  router: NavigationRouter<S, O>,
  routeConfigs?: NavigationRouteConfigMap,
  navigatorConfig?: NavigatorConfig,
  navigatorType?: NavigatorType
): _NavigatorCreator<NavigationViewProps, S, O> {
  return (NavigationView: NavigationViewType<NavigationViewProps, S, O>) => {
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

    return ((Navigator: any): NavigationNavigator<S, O>);
  };
}
