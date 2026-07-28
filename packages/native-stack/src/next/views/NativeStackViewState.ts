import type {
  ParamListBase,
  Route,
  StackNavigationState,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
} from '../../types';

export type NativeStackViewState = {
  previous: {
    index: number;
    routes: Route<string>[];
    descriptors: NativeStackDescriptorMap;
  };
  renderedRoutes: Route<string>[];
  poppedByKey: Map<
    string,
    {
      descriptor: NativeStackDescriptor;
      previousDescriptor: NativeStackDescriptor | undefined;
      focusedReplacementKey: string | undefined;
    }
  >;
  nativelyDismissedRouteKeys: Set<string>;
};

export type NativeStackViewStateAction =
  | {
      type: 'SYNC_STATE';
      index: number;
      routes: Route<string>[];
      descriptors: NativeStackDescriptorMap;
    }
  | { type: 'SYNC_DESCRIPTORS'; descriptors: NativeStackDescriptorMap }
  | { type: 'REMOVE_POPPED_ROUTE'; key: string }
  | { type: 'ADD_NATIVELY_DISMISSED_ROUTES'; keys: string[] };

export function reducer(
  state: NativeStackViewState,
  action: NativeStackViewStateAction
): NativeStackViewState {
  switch (action.type) {
    case 'SYNC_STATE': {
      const routeIndexByKey = new Map(
        action.routes.map((route, index) => [route.key, index])
      );

      const poppedByKey = new Map(state.poppedByKey);

      // Routes might have been added back before their native dismissal finished
      // So we need to remove them from the popped list
      for (const key of routeIndexByKey.keys()) {
        poppedByKey.delete(key);
      }

      const previousActiveRoutes = state.previous.routes.slice(
        0,
        state.previous.index + 1
      );

      const focusedRoute = action.routes[action.index];

      const focusedReplacementKey =
        focusedRoute != null &&
        !previousActiveRoutes.some((route) => route.key === focusedRoute.key)
          ? focusedRoute.key
          : undefined;

      let previousRetainedActiveRouteIndex = -1;

      // Active routes need to keep their relative order
      // Detached routes can move when a preloaded route becomes active
      for (const [index, route] of previousActiveRoutes.entries()) {
        const retainedRouteIndex = routeIndexByKey.get(route.key);

        if (retainedRouteIndex != null) {
          if (retainedRouteIndex <= action.index) {
            if (retainedRouteIndex < previousRetainedActiveRouteIndex) {
              throw new Error(
                `Changing the order of active routes is not supported in native stack.`
              );
            }

            previousRetainedActiveRouteIndex = retainedRouteIndex;
          }

          continue;
        }

        // Track routes that were removed from the active routes and need to stay rendered
        const descriptor = state.previous.descriptors[route.key];

        if (
          descriptor == null ||
          // Skip routes that were already dismissed natively
          // We don't want to keep them rendered
          state.nativelyDismissedRouteKeys.has(route.key)
        ) {
          continue;
        }

        const previousRoute = previousActiveRoutes[index - 1];

        // Store a snapshot of the previous route's latest available descriptor
        // This is necessary to properly handle back button during the pop
        // e.g. back button title, `canGoBack` etc.
        const previousDescriptor =
          previousRoute == null
            ? undefined
            : (action.descriptors[previousRoute.key] ??
              // Fallback to old descriptor if previous route was also removed
              state.previous.descriptors[previousRoute.key]);

        poppedByKey.set(route.key, {
          descriptor,
          previousDescriptor,
          focusedReplacementKey,
        });
      }

      const renderedRoutes = [...action.routes];

      // Add popped routes back to the rendered routes list
      // They need to stay rendered till the pop animation is finished
      // We anchor them according to the next route that is still present after them.
      // So if a route is replaced, the new route stays below the route being popped.
      // Otherwise we append them at the end in their original order.
      for (const [index, route] of state.renderedRoutes.entries()) {
        if (!poppedByKey.has(route.key)) {
          continue;
        }

        const nextRoute = state.renderedRoutes
          .slice(index + 1)
          .find((route) => routeIndexByKey.has(route.key));

        if (nextRoute == null) {
          renderedRoutes.push(route);
        } else {
          const nextIndex = renderedRoutes.findIndex(
            (route) => route.key === nextRoute.key
          );

          renderedRoutes.splice(nextIndex, 0, route);
        }
      }

      // Native dismissal keys are only needed for the next state sync
      // So we don't need to keep the list anymore
      const nativelyDismissedRouteKeys =
        state.nativelyDismissedRouteKeys.size === 0
          ? state.nativelyDismissedRouteKeys
          : new Set<string>();

      return {
        previous: {
          index: action.index,
          routes: action.routes,
          descriptors: action.descriptors,
        },
        renderedRoutes,
        poppedByKey,
        nativelyDismissedRouteKeys,
      };
    }

    case 'SYNC_DESCRIPTORS':
      return {
        ...state,
        previous: {
          ...state.previous,
          descriptors: action.descriptors,
        },
      };

    case 'REMOVE_POPPED_ROUTE': {
      if (!state.poppedByKey.has(action.key)) {
        return state;
      }

      const poppedByKey = new Map(state.poppedByKey);

      poppedByKey.delete(action.key);

      return {
        ...state,
        renderedRoutes: state.renderedRoutes.filter(
          (route) => route.key !== action.key
        ),
        poppedByKey,
      };
    }

    case 'ADD_NATIVELY_DISMISSED_ROUTES': {
      if (
        action.keys.every((key) => state.nativelyDismissedRouteKeys.has(key))
      ) {
        return state;
      }

      return {
        ...state,
        nativelyDismissedRouteKeys: new Set([
          ...state.nativelyDismissedRouteKeys,
          ...action.keys,
        ]),
      };
    }
  }
}

export function useViewState({
  state,
  descriptors,
}: {
  state: StackNavigationState<ParamListBase>;
  descriptors: NativeStackDescriptorMap;
}) {
  const [view, dispatch] = React.useReducer(reducer, {
    previous: {
      index: state.index,
      routes: state.routes,
      descriptors,
    },
    renderedRoutes: state.routes,
    poppedByKey: new Map(),
    nativelyDismissedRouteKeys: new Set<string>(),
  });

  if (
    state.index !== view.previous.index ||
    state.routes !== view.previous.routes
  ) {
    dispatch({
      type: 'SYNC_STATE',
      index: state.index,
      routes: state.routes,
      descriptors,
    });
  } else if (descriptors !== view.previous.descriptors) {
    dispatch({
      type: 'SYNC_DESCRIPTORS',
      descriptors,
    });
  }

  return [view, dispatch] as const;
}
