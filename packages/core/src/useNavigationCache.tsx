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

export default function useNavigationCache<
  State extends NavigationState,
  ScreenOptions extends object
>({ state, getState, navigation, setOptions, emitter }: Options) {
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
