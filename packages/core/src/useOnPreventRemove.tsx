import type {
  NavigationAction,
  NavigationState,
  PartialState,
  RouterConfigOptions,
} from '@react-navigation/routers';
import * as React from 'react';

import {
  type ChildBeforeRemoveListener,
  NavigationBuilderContext,
} from './NavigationBuilderContext';
import { NavigationRouteContext } from './NavigationProvider';
import type { EventMapCore } from './types';
import type { NavigationEventEmitter } from './useEventEmitter';

type Options = {
  getState: () => NavigationState;
  emitter: NavigationEventEmitter<EventMapCore<any>>;
  beforeRemoveListeners: Record<string, ChildBeforeRemoveListener | undefined>;
  routerConfigOptionsRef: React.RefObject<RouterConfigOptions>;
};

const VISITED_ROUTE_KEYS = Symbol('VISITED_ROUTE_KEYS');

/**
 * Returns the next state's routes for diffing against the current routes by key; no next state
 * means the route itself was removed. A stale state isn't rehydrated yet — dropping unknown names
 * mirrors rehydration's effect on keys, and keyless routes can never match a current route anyway.
 */
export const getRoutesToCompare = (
  nextState: NavigationState | PartialState<NavigationState> | undefined,
  routeNames: string[]
) => {
  if (nextState == null) {
    return [];
  }

  if (nextState.stale === false) {
    return nextState.routes;
  }

  return nextState.routes.filter((route) => routeNames.includes(route.name));
};

export const shouldPreventRemove = (
  emitter: NavigationEventEmitter<EventMapCore<any>>,
  beforeRemoveListeners: Record<string, ChildBeforeRemoveListener | undefined>,
  currentRoutes: {
    key: string;
    state?: NavigationState | PartialState<NavigationState>;
  }[],
  nextRoutes: {
    key?: string | undefined;
    state?: NavigationState | PartialState<NavigationState>;
  }[],
  action: NavigationAction
) => {
  const nextRoutesByKey = new Map(
    nextRoutes.map((route) => [route.key, route])
  );

  const visitedRouteKeys: Set<string> =
    // @ts-expect-error: add this property to mark that we've already emitted this action
    action[VISITED_ROUTE_KEYS] ?? new Set<string>();

  const beforeRemoveAction = {
    ...action,
    [VISITED_ROUTE_KEYS]: visitedRouteKeys,
  };

  // Call these in reverse order so last screens handle the event first
  for (const route of [...currentRoutes].reverse()) {
    const nextRoute = nextRoutesByKey.get(route.key);

    if (nextRoute === undefined) {
      if (visitedRouteKeys.has(route.key)) {
        // Skip if we've already emitted this action for this screen
        continue;
      }

      // The route is removed
      // First, we need to check if any child screens want to prevent it
      const isPrevented =
        beforeRemoveListeners[route.key]?.(beforeRemoveAction);

      if (isPrevented) {
        return true;
      }

      visitedRouteKeys.add(route.key);

      const event = emitter.emit({
        type: 'beforeRemove',
        target: route.key,
        data: { action: beforeRemoveAction },
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return true;
      }
    } else if (nextRoute.state !== route.state) {
      // The route is kept but its nested state changed, so propagate the check into the nested navigator
      const isPrevented = beforeRemoveListeners[route.key]?.(
        beforeRemoveAction,
        nextRoute.state
      );

      if (isPrevented) {
        return true;
      }
    }
  }

  return false;
};

export function useOnPreventRemove({
  getState,
  emitter,
  beforeRemoveListeners,
  routerConfigOptionsRef,
}: Options) {
  const { addKeyedListener } = React.use(NavigationBuilderContext);
  const route = React.use(NavigationRouteContext);
  const routeKey = route?.key;

  React.useInsertionEffect(() => {
    if (routeKey) {
      return addKeyedListener?.(
        'beforeRemove',
        routeKey,
        (action, nextState) => {
          const state = getState();

          return shouldPreventRemove(
            emitter,
            beforeRemoveListeners,
            state.routes,
            getRoutesToCompare(
              nextState,
              routerConfigOptionsRef.current.routeNames
            ),
            action
          );
        }
      );
    }
  }, [
    addKeyedListener,
    beforeRemoveListeners,
    emitter,
    getState,
    routeKey,
    routerConfigOptionsRef,
  ]);
}
