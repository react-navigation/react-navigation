/**
 * @flow
 *
 * Helpers for navigation.
 */

import type {
  NavigationProp,
  NavigationParams,
  NavigationScreenProp,
  NavigationNavigateAction,
} from './TypeDefinition';

import NavigationActions from './NavigationActions';
import invariant from './utils/invariant';

export default function<S: {}>(
  navigation: NavigationProp<S>
): NavigationScreenProp<S> {
  return {
    ...navigation,
    goBack: (key?: ?string): boolean => {
      let actualizedKey: ?string = key;
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
    navigate: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction
    ): boolean =>
      navigation.dispatch(
        NavigationActions.navigate({ routeName, params, action })
      ),
    /**
     * For updating current route params. For example the nav bar title and
     * buttons are based on the route params.
     * This means `setParams` can be used to update nav bar for example.
     */
    setParams: (params: NavigationParams): boolean => {
      invariant(
        navigation.state.key && typeof navigation.state.key === 'string',
        'setParams cannot be called by root navigator'
      );
      const key = navigation.state.key;
      return navigation.dispatch(NavigationActions.setParams({ params, key }));
    },
  };
}
