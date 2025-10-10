import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import {
  NavigationRouteContext,
  NavigationRouteParentContext,
} from './NavigationRouteContext';
import type { ParamsForRoute, RouteProp } from './types';

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
export function useRoute<T extends RouteProp<ParamListBase>>(): T {
  const route = React.useContext(NavigationRouteContext);

  if (route === undefined) {
    throw new Error(
      "Couldn't find a route object. Is your component inside a screen in a navigator?"
    );
  }

  return route as T;
}

export function useParentRoute<
  ParamList extends ParamListBase,
  T extends string,
>(name: T): ParamsForRoute<ParamList, T> {
  const routeWrapper = React.useContext(NavigationRouteParentContext);

  if (routeWrapper === undefined) {
    throw new Error(
      "Couldn't find a route object. Is your component inside a screen in a navigator?"
    );
  }

  const route = React.useSyncExternalStore(
    routeWrapper.getSubscribe(name),
    () => {
      const r = routeWrapper.getRoute(name);
      if (!r) {
        throw new Error(`Route '${name}' not found in the navigator`);
      }
      return r;
    },
    () => {
      const r = routeWrapper.getRoute(name);
      if (!r) {
        throw new Error(`Route '${name}' not found in the navigator`);
      }
      return r;
    }
  );

  return route as ParamsForRoute<ParamList, T>;
}
