import type { NavigationState } from '@react-navigation/routers';
import * as React from 'react';

import { isArrayEqual } from './isArrayEqual';
import {
  type GetIsReadyListener,
  type GetStateListener,
  NavigationBuilderContext,
  type SceneMountedListener,
} from './NavigationBuilderContext';
import { NavigationRouteContext } from './NavigationProvider';

type Options = {
  getState: () => NavigationState;
  getStateListeners: Record<string, GetStateListener | undefined>;
  getIsReadyListeners: Record<string, GetIsReadyListener | undefined>;
  sceneMountedListeners: Record<string, SceneMountedListener | undefined>;
};

export function useOnGetState({
  getState,
  getStateListeners,
  getIsReadyListeners,
  sceneMountedListeners,
}: Options) {
  const { addKeyedListener } = React.use(NavigationBuilderContext);
  const route = React.use(NavigationRouteContext);
  const key = route ? route.key : 'root';

  const getRehydratedState = React.useCallback(() => {
    const state = getState();

    // Avoid returning new route objects if we don't need to
    const routes = state.routes.map((route) => {
      const childState = getStateListeners[route.key]?.();

      if (route.state === childState) {
        return route;
      }

      return { ...route, state: childState };
    });

    if (isArrayEqual(state.routes, routes)) {
      return state;
    }

    return { ...state, routes };
  }, [getState, getStateListeners]);

  const getIsReady = React.useCallback((): boolean => {
    const state = getState();
    const route = state.routes[state.index];

    if (route == null) {
      return false;
    }

    // Recurse into the nested navigator for the focused route if any
    // Otherwise check if the screen for it has mounted
    // It may mount in a later commit when the subtree hasn't hydrated yet
    return (
      getIsReadyListeners[route.key]?.() ??
      sceneMountedListeners[route.key] != null
    );
  }, [getState, getIsReadyListeners, sceneMountedListeners]);

  // Use insertion effects to preserve the listeners under `<Activity mode="hidden">`
  // So `getRootState` will still return state of nested navigators
  React.useInsertionEffect(() => {
    return addKeyedListener?.('getState', key, getRehydratedState);
  }, [addKeyedListener, getRehydratedState, key]);

  React.useInsertionEffect(() => {
    return addKeyedListener?.('getIsReady', key, getIsReady);
  }, [addKeyedListener, getIsReady, key]);
}
