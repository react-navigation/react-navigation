import * as React from 'react';
import type { NavigatorStateGetter } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add getters to be called for obtaining rehydrated state.
 */

export default function useStateGetters() {
  const stateGetters = React.useRef<
    Record<string, NavigatorStateGetter | undefined>
  >({});

  const getStateForRoute = React.useCallback(
    (routeKey: string) => {
      const getter = stateGetters.current[routeKey];
      return getter === undefined ? undefined : getter();
    },
    [stateGetters]
  );

  const addStateGetter = React.useCallback(
    (key: string, getter: NavigatorStateGetter) => {
      stateGetters.current[key] = getter;

      return () => {
        stateGetters.current[key] = undefined;
      };
    },
    []
  );

  return {
    getStateForRoute,
    addStateGetter,
  };
}
