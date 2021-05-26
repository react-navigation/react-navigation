import type {
  NavigationState,
  ParamListBase,
  Route,
} from '@react-navigation/routers';
import * as React from 'react';

import type { RouteProp } from './types';

type RouteCache = Map<Route<string>, RouteProp<ParamListBase>>;

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
export default function useRouteCache<State extends NavigationState>(
  routes: State['routes']
) {
  // Cache object which holds route objects for each screen
  const cache = React.useMemo(() => ({ current: new Map() as RouteCache }), []);

  if (process.env.NODE_ENV === 'production') {
    // We don't want the overhead of creating extra maps every render in prod
    return routes;
  }

  cache.current = routes.reduce((acc, route) => {
    const previous = cache.current.get(route);

    if (previous) {
      // If a cached route object already exists, reuse it
      acc.set(route, previous);
    } else {
      const { state, ...proxy } = route;

      Object.defineProperty(proxy, CHILD_STATE, {
        enumerable: false,
        value: state,
      });

      acc.set(route, proxy);
    }

    return acc;
  }, new Map() as RouteCache);

  return Array.from(cache.current.values());
}
