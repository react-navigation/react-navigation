import * as React from 'react';
import { NavigationState } from '@react-navigation/routers';
import NavigationBuilderContext from './NavigationBuilderContext';
import NavigationRouteContext from './NavigationRouteContext';

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
    return {
      ...state,
      routes: state.routes.map((route) => ({
        ...route,
        state: getStateForRoute(route.key),
      })),
    };
  }, [getState, getStateForRoute]);

  React.useEffect(() => {
    return addStateGetter?.(key, getRehydratedState);
  }, [addStateGetter, getRehydratedState, key]);
}
