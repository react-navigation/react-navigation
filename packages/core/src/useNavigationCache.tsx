import {
  CommonActions,
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from '@react-navigation/routers';
import * as React from 'react';

import NavigationBuilderContext from './NavigationBuilderContext';
import type { NavigationHelpers, NavigationProp } from './types';
import type { NavigationEventEmitter } from './useEventEmitter';

type Options<
  State extends NavigationState,
  EventMap extends Record<string, any>
> = {
  state: State;
  getState: () => State;
  navigation: NavigationHelpers<ParamListBase> &
    Partial<NavigationProp<ParamListBase, string, any, any, any>>;
  setOptions: (
    cb: (options: Record<string, object>) => Record<string, object>
  ) => void;
  router: Router<State, NavigationAction>;
  emitter: NavigationEventEmitter<EventMap>;
};

type NavigationCache<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends Record<string, any>
> = Record<
  string,
  NavigationProp<ParamListBase, string, State, ScreenOptions, EventMap>
>;

/**
 * Hook to cache navigation objects for each screen in the navigator.
 * It's important to cache them to make sure navigation objects don't change between renders.
 * This lets us apply optimizations like `React.memo` to minimize re-rendering screens.
 */
export default function useNavigationCache<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends Record<string, any>
>({
  state,
  getState,
  navigation,
  setOptions,
  router,
  emitter,
}: Options<State, EventMap>) {
  const { stackRef } = React.useContext(NavigationBuilderContext);

  // Cache object which holds navigation objects for each screen
  // We use `React.useMemo` instead of `React.useRef` coz we want to invalidate it when deps change
  // In reality, these deps will rarely change, if ever
  const cache = React.useMemo(
    () => ({ current: {} as NavigationCache<State, ScreenOptions, EventMap> }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getState, navigation, setOptions, router, emitter]
  );

  const actions = {
    ...router.actionCreators,
    ...CommonActions,
  };

  cache.current = state.routes.reduce<
    NavigationCache<State, ScreenOptions, EventMap>
  >((acc, route) => {
    const previous = cache.current[route.key];

    type Thunk =
      | NavigationAction
      | ((state: State) => NavigationAction | null | undefined);

    if (previous) {
      // If a cached navigation object already exists, reuse it
      acc[route.key] = previous;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { emit, ...rest } = navigation;

      const dispatch = (thunk: Thunk) => {
        const action = typeof thunk === 'function' ? thunk(getState()) : thunk;

        if (action != null) {
          navigation.dispatch({ source: route.key, ...action });
        }
      };

      const withStack = (callback: () => void) => {
        let isStackSet = false;

        try {
          if (
            process.env.NODE_ENV !== 'production' &&
            stackRef &&
            !stackRef.current
          ) {
            // Capture the stack trace for devtools
            stackRef.current = new Error().stack;
            isStackSet = true;
          }

          callback();
        } finally {
          if (isStackSet && stackRef) {
            stackRef.current = undefined;
          }
        }
      };

      const helpers = Object.keys(actions).reduce<Record<string, () => void>>(
        (acc, name) => {
          acc[name] = (...args: any) =>
            withStack(() =>
              // @ts-expect-error: name is a valid key, but TypeScript is dumb
              dispatch(actions[name](...args))
            );

          return acc;
        },
        {}
      );

      acc[route.key] = {
        ...rest,
        ...helpers,
        // FIXME: too much work to fix the types for now
        ...(emitter.create(route.key) as any),
        dispatch: (thunk: Thunk) => withStack(() => dispatch(thunk)),
        setOptions: (options: object) =>
          setOptions((o) => ({
            ...o,
            [route.key]: { ...o[route.key], ...options },
          })),
        isFocused: () => {
          const state = getState();

          if (state.routes[state.index].key !== route.key) {
            return false;
          }

          // If the current screen is focused, we also need to check if parent navigator is focused
          // This makes sure that we return the focus state in the whole tree, not just this navigator
          return navigation ? navigation.isFocused() : true;
        },
      };
    }

    return acc;
  }, {});

  return cache.current;
}
