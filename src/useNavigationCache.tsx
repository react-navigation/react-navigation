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

type NavigationCache = { [key: string]: NavigationProp<ParamListBase> };

export default function useNavigationCache({
  state,
  getState,
  navigation,
  setOptions,
  emitter,
}: Options) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cache = React.useMemo(() => ({ current: {} as NavigationCache }), [
    getState,
    navigation,
    setOptions,
    emitter,
  ]);

  cache.current = state.routes.reduce<NavigationCache>((acc, route, index) => {
    if (cache.current[route.key]) {
      acc[route.key] = cache.current[route.key];
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
      } as NavigationProp<ParamListBase>;
    }

    return acc;
  }, {});

  return cache.current;
}
