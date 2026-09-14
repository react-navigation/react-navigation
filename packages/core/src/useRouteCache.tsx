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

type CachedRoute = RouteProp<ParamListBase> & {
  [CHILD_STATE]?: NavigationState;
};

/**
 * Hook to cache route props for each screen in the navigator.
 * This lets add warnings and modifications to the route object but keep references between renders.
 */
export function useRouteCache<State extends NavigationState>(
  routes: State['routes']
) {
  // Cache object which holds route objects for each screen
  const cache = React.useMemo(
    () => ({ current: new Map<string, CachedRoute>() }),
    []
  );

  const next = React.useMemo(() => {
    return routes.reduce((acc, route) => {
      const previous = cache.current.get(route.key);

      const { state: _, ...routeWithoutState } = route;

      let proxy: CachedRoute;

      if (previous && isRecordEqual(previous, routeWithoutState)) {
        // If a cached route object already exists, reuse it
        proxy = previous;
      } else {
        proxy = routeWithoutState;

        if (process.env.NODE_ENV !== 'production') {
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
      }

      acc.set(route.key, proxy);

      return acc;
    }, new Map<string, CachedRoute>());
  }, [cache, routes]);

  React.useInsertionEffect(() => {
    cache.current = next;
  });

  // Update child state on every render, including when the memo is reused.
  // This restores the previous child state when a pending render is canceled.
  return Array.from(next.values(), (proxy, index) => {
    const state = routes[index]?.state;

    // FIXME: We mutate the child state without replacing the cached route object,
    // so nested navigation doesn't re-render the parent screen.
    // This is not concurrent render safe, pending renders mutate this shared child state.
    // Then `getFocusedRouteNameFromRoute` can expose it before the render commits.
    if (proxy[CHILD_STATE] !== state) {
      Object.defineProperty(proxy, CHILD_STATE, {
        enumerable: false,
        configurable: true,
        value: state,
      });
    }

    return proxy;
  });
}
