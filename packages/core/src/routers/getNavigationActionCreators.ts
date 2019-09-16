import * as NavigationActions from '../NavigationActions';
import invariant from '../utils/invariant';

interface NavigationParams {
  [key: string]: any;
}

// TODO: Type `route`
const getNavigationActionCreators = (route: any) => {
  return {
    goBack: (key?: string | null) => {
      let actualizedKey = key;
      if (key === undefined && route.key) {
        invariant(typeof route.key === 'string', 'key should be a string');
        actualizedKey = route.key;
      }
      return NavigationActions.back({ key: actualizedKey });
    },
    navigate: (
      navigateTo: string | NavigationActions.NavigationNavigateActionPayload,
      params?: NavigationParams,
      action?: NavigationActions.NavigationNavigateAction
    ) => {
      if (typeof navigateTo === 'string') {
        return NavigationActions.navigate({
          routeName: navigateTo,
          params,
          action,
        });
      }
      invariant(
        typeof navigateTo === 'object',
        'Must navigateTo an object or a string'
      );
      invariant(
        params == null,
        'Params must not be provided to .navigate() when specifying an object'
      );
      invariant(
        action == null,
        'Child action must not be provided to .navigate() when specifying an object'
      );
      return NavigationActions.navigate(navigateTo);
    },
    setParams: (params?: NavigationParams) => {
      invariant(
        route.key && typeof route.key === 'string',
        'setParams cannot be called by root navigator'
      );
      return NavigationActions.setParams({ params, key: route.key });
    },
  };
};

export default getNavigationActionCreators;
