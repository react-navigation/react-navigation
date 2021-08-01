import * as React from 'react';
import type {
  ParamListBase,
  NavigationState,
  Route,
} from '@react-navigation/routers';
import type { RouteProp } from './types';

type RouteCache = Map<Route<string>, RouteProp<ParamListBase, string>>;

/**
 * Utilites such as `getFocusedRouteNameFromRoute` need to access state.
 * So we need a way to suppress the warning for those use cases.
 * This is fine since they are internal utilities and this is not public API.
 */
export const SUPPRESS_STATE_ACCESS_WARNING = { value: false };

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
      const proxy = { ...route };

      Object.defineProperty(proxy, 'state', {
        get() {
          if (!SUPPRESS_STATE_ACCESS_WARNING.value) {
            console.warn(
              "Accessing the 'state' property of the 'route' object is not supported. If you want to get the focused route name, use the 'getFocusedRouteNameFromRoute' helper instead: https://reactnavigation.org/docs/5.x/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state"
            );
          }

          return route.state;
        },
      });

      acc.set(route, proxy);
    }

    return acc;
  }, new Map() as RouteCache);

  return Array.from(cache.current.values());
}
