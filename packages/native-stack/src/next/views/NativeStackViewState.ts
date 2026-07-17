import type { Route } from '@react-navigation/native';

export type NativeStackViewState<Descriptor> = {
  previous: {
    index: number;
    routes: Route<string>[];
    descriptors: Record<string, Descriptor>;
  };
  renderedRoutes: Route<string>[];
  popped: {
    route: Route<string>;
    descriptor: Descriptor | undefined;
    // Key of the route that was rendered below this route when it was popped,
    // used to keep its position in the route group tree stable while it
    // animates out.
    anchorKey: string | undefined;
  }[];
  nativelyDismissedRouteKeys: string[];
};

export type NativeStackViewStateAction<Descriptor> =
  | {
      type: 'SYNC_STATE';
      index: number;
      routes: Route<string>[];
      descriptors: Record<string, Descriptor>;
    }
  | { type: 'REMOVE_POPPED_ROUTE'; key: string }
  | { type: 'ADD_NATIVELY_DISMISSED_ROUTES'; keys: string[] };

export function createNativeStackViewState<Descriptor>({
  index,
  routes,
  descriptors,
}: {
  index: number;
  routes: Route<string>[];
  descriptors: Record<string, Descriptor>;
}): NativeStackViewState<Descriptor> {
  return {
    previous: { index, routes, descriptors },
    renderedRoutes: routes,
    popped: [],
    nativelyDismissedRouteKeys: [],
  };
}

export function nativeStackViewReducer<Descriptor>(
  state: NativeStackViewState<Descriptor>,
  action: NativeStackViewStateAction<Descriptor>
): NativeStackViewState<Descriptor> {
  switch (action.type) {
    case 'SYNC_STATE': {
      const routeKeys = new Set(action.routes.map((route) => route.key));
      const nativelyDismissedRouteKeys = new Set(
        state.nativelyDismissedRouteKeys
      );
      const poppedByKey = new Map(
        state.popped.map((popped) => [popped.route.key, popped])
      );

      for (const key of routeKeys) {
        // A route may be added again before its native pop finishes.
        poppedByKey.delete(key);
      }

      if (action.routes !== state.previous.routes) {
        const previousActiveRoutes = state.previous.routes.slice(
          0,
          state.previous.index + 1
        );
        const renderedIndexByKey = new Map(
          state.renderedRoutes.map((route, index) => [route.key, index])
        );

        for (const route of previousActiveRoutes) {
          if (
            routeKeys.has(route.key) ||
            poppedByKey.has(route.key) ||
            nativelyDismissedRouteKeys.has(route.key)
          ) {
            continue;
          }

          const renderedIndex = renderedIndexByKey.get(route.key);

          poppedByKey.set(route.key, {
            route,
            descriptor:
              action.descriptors[route.key] ??
              state.previous.descriptors[route.key],
            anchorKey:
              renderedIndex == null
                ? undefined
                : state.renderedRoutes[renderedIndex - 1]?.key,
          });
        }
      }

      const renderedRoutes = reconcileRenderedRoutes(
        state.renderedRoutes,
        action.routes,
        new Set(poppedByKey.keys())
      );
      const popped = renderedRoutes.flatMap((route) => {
        const entry = poppedByKey.get(route.key);

        return entry == null ? [] : [entry];
      });
      const nextNativelyDismissedRouteKeys =
        state.nativelyDismissedRouteKeys.filter((key) => routeKeys.has(key));

      return {
        previous: {
          index: action.index,
          routes: action.routes,
          descriptors: action.descriptors,
        },
        renderedRoutes,
        popped,
        nativelyDismissedRouteKeys: nextNativelyDismissedRouteKeys,
      };
    }

    case 'REMOVE_POPPED_ROUTE': {
      const popped = state.popped.filter(
        (popped) => popped.route.key !== action.key
      );

      return popped.length === state.popped.length
        ? state
        : {
            ...state,
            renderedRoutes: state.renderedRoutes.filter(
              (route) => route.key !== action.key
            ),
            popped,
          };
    }

    case 'ADD_NATIVELY_DISMISSED_ROUTES': {
      const dismissedRouteKeys = new Set(state.nativelyDismissedRouteKeys);
      const keys = action.keys.filter((key) => !dismissedRouteKeys.has(key));

      return keys.length === 0
        ? state
        : {
            ...state,
            nativelyDismissedRouteKeys: [
              ...state.nativelyDismissedRouteKeys,
              ...keys,
            ],
          };
    }
  }
}

function reconcileRenderedRoutes(
  previousRenderedRoutes: Route<string>[],
  routes: Route<string>[],
  poppedRouteKeys: Set<string>
) {
  // Current navigation state defines the new order. Popped routes are inserted
  // back at their previous boundaries so consecutive pops keep their native
  // stack order, while new routes stay underneath the routes animating out.
  const routesByKey = new Map(routes.map((route) => [route.key, route]));
  const poppedRoutesBeforeKey = new Map<string | undefined, Route<string>[]>();
  let nextRouteKey: string | undefined;

  for (let index = previousRenderedRoutes.length - 1; index >= 0; index--) {
    const route = previousRenderedRoutes[index];

    if (route == null) {
      continue;
    }

    if (routesByKey.has(route.key)) {
      nextRouteKey = route.key;
    } else if (poppedRouteKeys.has(route.key)) {
      const poppedRoutes = poppedRoutesBeforeKey.get(nextRouteKey) ?? [];

      poppedRoutes.unshift(route);
      poppedRoutesBeforeKey.set(nextRouteKey, poppedRoutes);
    }
  }

  return routes
    .flatMap((route) => [
      ...(poppedRoutesBeforeKey.get(route.key) ?? []),
      route,
    ])
    .concat(poppedRoutesBeforeKey.get(undefined) ?? []);
}
