import type {
  NavigationAction,
  NavigationState,
  PartialState,
  Router,
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
  router: Router<NavigationState, NavigationAction>;
  routerConfigOptions: RouterConfigOptions;
};

const VISITED_ROUTE_KEYS = Symbol('VISITED_ROUTE_KEYS');

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
  router,
  routerConfigOptions,
}: Options) {
  const { addKeyedListener } = React.use(NavigationBuilderContext);
  const route = React.use(NavigationRouteContext);
  const routeKey = route?.key;

  const routerConfigOptionsRef =
    React.useRef<RouterConfigOptions>(routerConfigOptions);

  React.useEffect(() => {
    routerConfigOptionsRef.current = routerConfigOptions;
  });

  React.useInsertionEffect(() => {
    if (routeKey) {
      return addKeyedListener?.(
        'beforeRemove',
        routeKey,
        (action, nextState) => {
          const state = getState();

          // A partial next state has keyless routes; rehydrate it so keys match before diffing.
          // No next state means the route itself was removed, so all of its routes count as removed.
          let nextRoutes:
            | typeof state.routes
            | PartialState<NavigationState>['routes'] = [];

          if (nextState != null) {
            nextRoutes = nextState.routes.some((route) => route.key == null)
              ? router.getRehydratedState(
                  nextState,
                  routerConfigOptionsRef.current
                ).routes
              : nextState.routes;
          }

          return shouldPreventRemove(
            emitter,
            beforeRemoveListeners,
            state.routes,
            nextRoutes,
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
    router,
    routeKey,
  ]);
}
