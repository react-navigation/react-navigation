/**
 * @flow
 *
 * Helpers for navigation.
 */

import type {
  NavigationAction,
  NavigationScreenProp,
  NavigationProp,
  NavigationRoute,
} from './TypeDefinition';

import actions from './actions'

export default (navigation: NavigationProp<NavigationRoute, NavigationAction>): NavigationScreenProp<NavigationRoute, NavigationAction> => ({
  ...navigation,
  goBack: (key): boolean => {
    return navigation.dispatch(actions.back({
      key: key === undefined ? navigation.state.key : key,
    }));
  },
  navigate: (routeName, params, action): boolean => {
    return navigation.dispatch(actions.navigate({
      routeName,
      params,
      action,
    }));
  },
  /**
   * For updating current route params. For example the nav bar title and
   * buttons are based on the route params.
   * This means `setParams` can be used to update nav bar for example.
   */
  setParams: (params): boolean => {
    return navigation.dispatch(actions.setParams({
      params,
      key: navigation.state.key
    }));
  }
});
