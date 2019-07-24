import * as React from 'react';
import {
  NavigationAction,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  NavigationState,
} from './types';

type Options = {
  state: NavigationState;
  navigation: NavigationHelpers<ParamListBase>;
  setOptions: (
    cb: (options: { [key: string]: object }) => { [key: string]: object }
  ) => void;
};

type NavigationCache = { [key: string]: NavigationProp<ParamListBase> };

export default function useNavigationCache({
  state,
  navigation,
  setOptions,
}: Options) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cache = React.useMemo(() => ({ current: {} as NavigationCache }), [
    navigation,
    setOptions,
  ]);

  cache.current = state.routes.reduce<NavigationCache>((acc, route) => {
    acc[route.key] =
      cache.current[route.key] ||
      ({
        ...navigation,
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
      } as NavigationProp<ParamListBase>);

    return acc;
  }, {});

  return cache.current;
}
