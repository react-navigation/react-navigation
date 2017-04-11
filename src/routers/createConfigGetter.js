/*
 * @flow
 */

import invariant from 'fbjs/lib/invariant';

import getScreenForRouteName from './getScreenForRouteName';
import addNavigationHelpers from '../addNavigationHelpers';

import type {
  NavigationScreenProp,
  NavigationAction,
  NavigationRoute,
  NavigationRouteConfigMap,
  NavigationScreenConfig,
  NavigationScreenConfigProps,
} from '../TypeDefinition';

function applyConfig(
  configurer: ?NavigationScreenConfig<Object>,
  prevOptions: Object,
  configProps: NavigationScreenConfigProps,
): * {
  if (typeof configurer === 'function') {
    return {
      ...prevOptions,
      ...configurer({ ...configProps, prevOptions }),
    };
  }
  if (typeof configurer === 'object') {
    return {
      ...prevOptions,
      ...configurer,
    };
  }
  return prevOptions;
}

export default (
  routeConfigs: NavigationRouteConfigMap,
  navigatorScreenConfig?: NavigationScreenConfig<Object>,
) =>
  (
    navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
    screenProps: *,
  ) => {
    const { state, dispatch } = navigation;
    const route = state;
    // $FlowFixMe
    const { routes, index } = (route: NavigationStateRoute);

    invariant(
      route.routeName &&
      typeof route.routeName === 'string',
      'Cannot get config because the route does not have a routeName.',
    );

    const Component = getScreenForRouteName(routeConfigs, route.routeName);

    let outputConfig = {};

    if (Component.router) {
      invariant(
        route && routes && index != null,
        `Expect nav state to have routes and index, ${JSON.stringify(route)}`
      );
      const childRoute = routes[index];
      const childNavigation = addNavigationHelpers({
        state: childRoute,
        dispatch,
      });
      outputConfig = Component.router.getScreenOptions(childNavigation, screenProps);
    }

    const routeConfig = routeConfigs[route.routeName];

    const routeScreenConfig = routeConfig.navigationOptions;
    const componentScreenConfig = Component.navigationOptions;

    const configOptions = { navigation, screenProps: screenProps || {} };

    outputConfig = applyConfig(navigatorScreenConfig, outputConfig, configOptions);
    outputConfig = applyConfig(componentScreenConfig, outputConfig, configOptions);
    outputConfig = applyConfig(routeScreenConfig, outputConfig, configOptions);

    return outputConfig;
  };
