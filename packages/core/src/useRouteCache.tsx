import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { isRecordEqual } from './isRecordEqual';
import type { RouteProp } from './types';

type RouteCache = Map<string, RouteProp<ParamListBase>>;

/**
 * Utilites such as `getFocusedRouteNameFromRoute` need to access state.
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
  const cache = React.useMemo(() => ({ current: new Map() as RouteCache }), []);

  if (process.env.NODE_ENV === 'production') {
    // We don't want the overhead of creating extra maps every render in prod
    return routes;
  }

  cache.current = routes.reduce((acc, route) => {
    const previous = cache.current.get(route.key);
    const { state, ...routeWithoutState } = route;

    let proxy;

    if (previous && isRecordEqual(previous, routeWithoutState)) {
      // If a cached route object already exists, reuse it
      proxy = previous;
    } else {
      proxy = routeWithoutState;
    }

    Object.defineProperty(proxy, CHILD_STATE, {
      enumerable: false,
      configurable: true,
      value: state,
    });

    acc.set(route.key, proxy);

    return acc;
  }, new Map() as RouteCache);

  return Array.from(cache.current.values());
}
