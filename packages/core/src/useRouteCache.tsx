import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { isRecordEqual } from './isRecordEqual';
import type { RouteProp } from './types';

/**
 * Utilities such as `getFocusedRouteNameFromRoute` need to access state.
 * So we need a way to suppress the warning for those use cases.
 * This is fine since they are internal utilities and this is not public API.
 */
export const CHILD_STATE = Symbol('CHILD_STATE');

/**
 * Hook to cache route props for each screen in the navigator.
 * This lets add warnings and modifications to the route object but keep references between renders.
 */
export function useRouteCache<State extends NavigationState>(
  routes: State['routes']
) {
  // Cache object which holds route objects for each screen
  const cache = React.useMemo(
    () => ({ current: new Map<string, RouteProp<ParamListBase>>() }),
    []
  );

  const next = routes.reduce((acc, route) => {
    const previous = cache.current.get(route.key);
    const { state, ...routeWithoutState } = route;

    let proxy;

    if (previous && isRecordEqual(previous, routeWithoutState)) {
      // If a cached route object already exists, reuse it
      proxy = previous;
    } else {
      proxy = routeWithoutState;
    }

    if (process.env.NODE_ENV !== 'production' && proxy !== previous) {
      // FIXME: since the state is updated with mutation, the route object cannot be frozen
      // As a workaround, loop through the object and make the properties readonly
      // Only needed once per proxy - skip if we're reusing a previously-frozen one
      for (const [key, value] of Object.entries(proxy)) {
        Object.defineProperty(proxy, key, {
          enumerable: true,
          configurable: true,
          writable: false,
          value,
        });
      }
    }

    // @ts-expect-error: this isn't in type definitions coz we want this private
    if (proxy[CHILD_STATE] !== state) {
      Object.defineProperty(proxy, CHILD_STATE, {
        enumerable: false,
        configurable: true,
        value: state,
      });
    }

    acc.set(route.key, proxy);

    return acc;
  }, new Map<string, RouteProp<ParamListBase>>());

  React.useInsertionEffect(() => {
    cache.current = next;
  });

  return Array.from(next.values());
}
