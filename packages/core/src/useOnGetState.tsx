import * as React from 'react';
import { NavigationState } from '@react-navigation/routers';
import NavigationBuilderContext from './NavigationBuilderContext';
import NavigationRouteContext from './NavigationRouteContext';
import isArrayEqual from './isArrayEqual';

export default function useOnGetState({
  getStateForRoute,
  getState,
}: {
  getStateForRoute: (routeName: string) => NavigationState | undefined;
  getState: () => NavigationState;
}) {
  const { addStateGetter } = React.useContext(NavigationBuilderContext);
  const route = React.useContext(NavigationRouteContext);
  const key = route ? route.key : 'root';

  const getRehydratedState = React.useCallback(() => {
    const state = getState();

    // Avoid returning new route objects if we don't need to
    const routes = state.routes.map((route) => {
      const childState = getStateForRoute(route.key);

      if (route.state === childState) {
        return route;
      }

      return { ...route, state: childState };
    });

    if (isArrayEqual(state.routes, routes)) {
      return state;
    }

    return { ...state, routes };
  }, [getState, getStateForRoute]);

  React.useEffect(() => {
    return addStateGetter?.(key, getRehydratedState);
  }, [addStateGetter, getRehydratedState, key]);
}
