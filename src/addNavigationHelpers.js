/* Helpers for navigation */

import NavigationActions from './NavigationActions';
import invariant from './utils/invariant';

export default function(navigation) {
  return {
    ...navigation,
    goBack: key => {
      let actualizedKey = key;
      if (key === undefined && navigation.state.key) {
        invariant(
          typeof navigation.state.key === 'string',
          'key should be a string'
        );
        actualizedKey = navigation.state.key;
      }
      return navigation.dispatch(
        NavigationActions.back({ key: actualizedKey })
      );
    },
    navigate: (navigateTo, params, action) => {
      if (typeof navigateTo === 'string') {
        return navigation.dispatch(
          NavigationActions.navigate({ routeName: navigateTo, params, action })
        );
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
      return navigation.dispatch(NavigationActions.navigate(navigateTo));
    },
    pop: (n, params) =>
      navigation.dispatch(
        NavigationActions.pop({ n, immediate: params && params.immediate })
      ),
    popToTop: params =>
      navigation.dispatch(
        NavigationActions.popToTop({ immediate: params && params.immediate })
      ),
    /**
     * For updating current route params. For example the nav bar title and
     * buttons are based on the route params.
     * This means `setParams` can be used to update nav bar for example.
     */
    setParams: params => {
      invariant(
        navigation.state.key && typeof navigation.state.key === 'string',
        'setParams cannot be called by root navigator'
      );
      const key = navigation.state.key;
      return navigation.dispatch(NavigationActions.setParams({ params, key }));
    },

    push: (routeName, params, action) =>
      navigation.dispatch(
        NavigationActions.push({ routeName, params, action })
      ),

    replace: (routeName, params, action) =>
      navigation.dispatch(
        NavigationActions.replace({
          routeName,
          params,
          action,
          key: navigation.state.key,
        })
      ),
  };
}
