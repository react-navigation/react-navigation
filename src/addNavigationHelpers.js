/**
 *
 *
 * Helpers for navigation.
 */

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
    navigate: (routeName, params, action) =>
      navigation.dispatch(
        NavigationActions.navigate({ routeName, params, action })
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
  };
}
