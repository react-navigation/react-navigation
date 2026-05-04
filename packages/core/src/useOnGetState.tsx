import type { NavigationState } from '@react-navigation/routers';
import * as React from 'react';

import { isArrayEqual } from './isArrayEqual';
import {
  type GetStateListener,
  NavigationBuilderContext,
} from './NavigationBuilderContext';
import { NavigationRouteContext } from './NavigationProvider';

type Options<State extends NavigationState> = {
  getState: () => State;
  getRoutesFromState: (state: State) => State['routes'];
  getStateForRouteUpdate?: (
    state: State,
    route: State['routes'][number]
  ) => State | null;
  getStateListeners: Record<string, GetStateListener | undefined>;
};

export function useOnGetState<State extends NavigationState>({
  getState,
  getRoutesFromState,
  getStateForRouteUpdate,
  getStateListeners,
}: Options<State>) {
  const { addKeyedListener } = React.use(NavigationBuilderContext);
  const route = React.use(NavigationRouteContext);
  const key = route ? route.key : 'root';

  const getRehydratedState = React.useCallback(() => {
    const state = getState();

    if (getStateForRouteUpdate) {
      let nextState = state;

      for (const route of getRoutesFromState(state)) {
        const childState = getStateListeners[route.key]?.();

        if (route.state === childState) {
          continue;
        }

        const updatedState = getStateForRouteUpdate(nextState, {
          ...route,
          state: childState,
        });

        if (updatedState !== null) {
          nextState = updatedState;
        }
      }

      return nextState;
    }

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
  }, [getRoutesFromState, getState, getStateForRouteUpdate, getStateListeners]);

  React.useEffect(() => {
    return addKeyedListener?.('getState', key, getRehydratedState);
  }, [addKeyedListener, getRehydratedState, key]);
}
