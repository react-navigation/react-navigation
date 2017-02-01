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

import NavigationActions from './NavigationActions'

export default (navigation: NavigationProp<NavigationRoute, NavigationAction>): NavigationScreenProp<NavigationRoute, NavigationAction> => ({
  ...navigation,
  goBack: (key): boolean => {
    return navigation.dispatch(NavigationActions.back({
      key: key === undefined ? navigation.state.key : key,
    }));
  },
  navigate: (routeName, params, action): boolean => {
    return navigation.dispatch(NavigationActions.navigate({
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
    return navigation.dispatch(NavigationActions.setParams({
      params,
      key: navigation.state.key
    }));
  }
});
