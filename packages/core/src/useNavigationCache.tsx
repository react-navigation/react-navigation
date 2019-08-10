import * as React from 'react';
import { NavigationEventEmitter } from './useEventEmitter';
import {
  NavigationAction,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  NavigationState,
} from './types';

type Options = {
  state: NavigationState;
  getState: () => NavigationState;
  navigation: NavigationHelpers<ParamListBase>;
  setOptions: (
    cb: (options: { [key: string]: object }) => { [key: string]: object }
  ) => void;
  emitter: NavigationEventEmitter;
};

type NavigationCache<
  State extends NavigationState,
  ScreenOptions extends object
> = {
  [key: string]: NavigationProp<ParamListBase, string, State, ScreenOptions>;
};

/**
 * Hook to cache navigation objects for each screen in the navigator.
 * It's important to cache them to make sure navigation objects don't change between renders.
 * This lets us apply optimizations like `React.memo` to minimize re-rendering screens.
 */
export default function useNavigationCache<
  State extends NavigationState,
  ScreenOptions extends object
>({ state, getState, navigation, setOptions, emitter }: Options) {
  // Cache object which holds navigation objects for each screen
  // We use `React.useMemo` instead of `React.useRef` coz we want to invalidate it when deps change
  // In reality, these deps will rarely change, if ever
  const cache = React.useMemo(
    () => ({ current: {} as NavigationCache<State, ScreenOptions> }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getState, navigation, setOptions, emitter]
  );

  cache.current = state.routes.reduce<NavigationCache<State, ScreenOptions>>(
    (acc, route, index) => {
      const previous = cache.current[route.key];
      const isFirst = route.key === state.routes[0].key;

      if (previous && previous.isFirstRouteInParent() === isFirst) {
        // If a cached navigation object already exists and has same `isFirstRouteInParent`, reuse it
        // This method could return different result if the index of the route changes somehow
        acc[route.key] = previous;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { emit, ...rest } = navigation;

        acc[route.key] = {
          ...rest,
          ...emitter.create(route.key),
          dispatch: (
            action:
              | NavigationAction
              | ((state: NavigationState) => NavigationState)
          ) =>
            navigation.dispatch(
              typeof action === 'object' && action != null
                ? { source: route.key, ...action }
                : action
            ),
          setOptions: (options: object) =>
            setOptions(o => ({
              ...o,
              [route.key]: { ...o[route.key], ...options },
            })),
          isFocused: () => {
            const state = getState();

            if (index !== state.index) {
              return false;
            }

            // If the current screen is focused, we also need to check if parent navigtor is focused
            // This makes sure that we return the focus state in the whole tree, not just this navigator
            return navigation ? navigation.isFocused() : true;
          },
          isFirstRouteInParent: () => isFirst,
        } as NavigationProp<ParamListBase, string, State, ScreenOptions>;
      }

      return acc;
    },
    {}
  );

  return cache.current;
}
