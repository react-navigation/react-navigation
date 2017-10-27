/*
 * @flow
 */

import invariant from '../utils/invariant';

import getScreenForRouteName from './getScreenForRouteName';
import addNavigationHelpers from '../addNavigationHelpers';
import validateScreenOptions from './validateScreenOptions';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationStateRoute,
  NavigationRouteConfigMap,
  NavigationScreenConfig,
  NavigationScreenConfigProps,
} from '../TypeDefinition';

function applyConfig<T: {}>(
  configurer: ?NavigationScreenConfig<T>,
  navigationOptions: any,
  configProps: NavigationScreenConfigProps
): * {
  if (typeof configurer === 'function') {
    return {
      ...navigationOptions,
      ...configurer({
        ...configProps,
        navigationOptions,
      }),
    };
  }
  if (typeof configurer === 'object') {
    return {
      ...navigationOptions,
      ...configurer,
    };
  }
  return navigationOptions;
}

export default (
  routeConfigs: NavigationRouteConfigMap,
  navigatorScreenConfig?: NavigationScreenConfig<*>
) => (navigation: NavigationScreenProp<NavigationRoute>, screenProps: *) => {
  const { state, dispatch } = navigation;
  const route = state;

  invariant(
    route.routeName && typeof route.routeName === 'string',
    'Cannot get config because the route does not have a routeName.'
  );

  const Component = getScreenForRouteName(routeConfigs, route.routeName);

  let outputConfig = {};

  const router = Component.router;
  if (router) {
    // $FlowFixMe
    const { routes, index } = (route: NavigationStateRoute);
    if (!route || !routes || index == null) {
      throw new Error(
        `Expect nav state to have routes and index, ${JSON.stringify(route)}`
      );
    }
    const childRoute = routes[index];
    const childNavigation = addNavigationHelpers({
      state: childRoute,
      dispatch,
    });
    outputConfig = router.getScreenOptions(childNavigation, screenProps);
  }

  const routeConfig = routeConfigs[route.routeName];

  const routeScreenConfig = routeConfig.navigationOptions;
  const componentScreenConfig = Component.navigationOptions;

  const configOptions = { navigation, screenProps: screenProps || {} };

  outputConfig = applyConfig(
    navigatorScreenConfig,
    outputConfig,
    configOptions
  );
  outputConfig = applyConfig(
    componentScreenConfig,
    outputConfig,
    configOptions
  );
  outputConfig = applyConfig(routeScreenConfig, outputConfig, configOptions);

  validateScreenOptions(outputConfig, route);

  return outputConfig;
};
