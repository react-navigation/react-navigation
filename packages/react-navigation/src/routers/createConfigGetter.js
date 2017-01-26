/*
 * @flow
 */

import invariant from 'fbjs/lib/invariant';

import getScreenForRouteName from './getScreenForRouteName';
import addNavigationHelpers from '../addNavigationHelpers';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationAction,
  NavigationRouteConfigMap,
  NavigationScreenConfig,
} from '../TypeDefinition';


export default (routeConfigs: NavigationRouteConfigMap) =>
  (navigation: NavigationScreenProp<NavigationRoute, NavigationAction>, optionName: string, config?: Object) => {
    const route = navigation.state;
    invariant(
      route.routeName &&
      typeof route.routeName === 'string',
      'Cannot get config because the route does not have a routeName.'
    );

    const Component = getScreenForRouteName(routeConfigs, route.routeName);

    let outputConfig = config || null;

    if (Component.router) {
      const {state, dispatch} = navigation;
      invariant(
        state && state.routes && state.index != null,
        `Expect nav state to have routes and index, ${JSON.stringify(route)}`
      );
      const childNavigation = addNavigationHelpers({
        state: state.routes[state.index],
        dispatch,
      });
      outputConfig = Component.router.getScreenConfig(childNavigation, optionName);
    }

    const routeConfig = routeConfigs[route.routeName];

    if (
      Component &&
      Component.navigationOptions &&
      Component.navigationOptions[optionName] !== undefined
    ) {
      if (typeof Component.navigationOptions[optionName] === 'function') {
        outputConfig = Component.navigationOptions[optionName](navigation, outputConfig);
      } else {
        outputConfig = Component.navigationOptions[optionName];
      }
    }

    if (
      routeConfig &&
      routeConfig.navigationOptions &&
      routeConfig.navigationOptions[optionName] !== undefined
    ) {
      if (typeof routeConfig.navigationOptions[optionName] === 'function') {
        outputConfig = routeConfig.navigationOptions[optionName](navigation, outputConfig);
      } else {
        outputConfig = routeConfig.navigationOptions[optionName];
      }
    }

    return outputConfig;
  };
