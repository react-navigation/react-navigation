import * as React from 'react';
import { NavigatorStateGetter } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add getters to be called for obtaining rehydrated state.
 */

export default function useStateGetters() {
  const stateGetters = React.useRef<Record<string, NavigatorStateGetter>>({});

  const getStateForRoute = React.useCallback(
    (routeKey: string) =>
      stateGetters.current[routeKey] === undefined
        ? undefined
        : stateGetters.current[routeKey](),
    [stateGetters]
  );

  const addStateGetter = React.useCallback(
    (key: string, getter: NavigatorStateGetter) => {
      stateGetters.current[key] = getter;

      return () => {
        // @ts-ignore
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
