import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import type {
  NavigationListForNested,
  NavigationProp,
  RootNavigator,
} from './types';
import { useNavigation } from './useNavigation';

type NavigationStateListener = {
  getState: () => NavigationState<ParamListBase>;
  subscribe: (callback: () => void) => () => void;
};

type NavigationStateForNested<
  Navigator,
  RouteName extends keyof NavigationListForNested<Navigator>,
> = NavigationListForNested<Navigator>[RouteName] extends {
  getState: () => infer State;
}
  ? // State can be `undefined` in generic navigation prop
    // But since we throw error if not in a screen,
    // We don't need to account for that here
    NonNullable<State>
  : never;

/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * If the route name of the current or one of the parents is specified,
 * the navigation state of the navigator for that route is used.
 *
 * A selector function must be provided to select the desired value from the navigation state.
 */
export function useNavigationState<
  const T,
  const Navigator = RootNavigator,
  const RouteName extends
    keyof NavigationListForNested<Navigator> = keyof NavigationListForNested<Navigator>,
>(
  routeName: RouteName,
  selector: (state: NavigationStateForNested<Navigator, RouteName>) => T
): T;
export function useNavigationState<T>(
  selector: (state: NavigationState<ParamListBase>) => T
): T;
export function useNavigationState(...args: unknown[]): unknown {
  let navigation: NavigationProp<ParamListBase> | undefined,
    stateListener: NavigationStateListener | undefined,
    selector;

  if (typeof args[0] === 'string') {
    // `useNavigation` uses `use` internally, so it's fine to call it conditionally
    // @ts-expect-error we can't specify the type here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigation = useNavigation(args[0]);
    selector = args[1];
  } else {
    selector = args[0];
  }

  if (navigation == null) {
    stateListener = React.use(NavigationStateListenerContext);

    if (stateListener == null) {
      throw new Error(
        "Couldn't get the navigation state. Is your component inside a navigator?"
      );
    }
  }

  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (navigation) {
        return navigation.addListener('state', callback);
      } else if (stateListener) {
        return stateListener.subscribe(callback);
      } else {
        throw new Error(
          "Couldn't subscribe to navigation state changes. This is not expected."
        );
      }
    },
    [navigation, stateListener]
  );

  const getSnapshot = navigation
    ? navigation.getState
    : stateListener?.getState;

  if (getSnapshot == null) {
    throw new Error("Couldn't get the navigation state. This is not expected.");
  }

  if (typeof selector !== 'function') {
    throw new Error(
      `A selector function must be provided (got ${typeof selector}).`
    );
  }

  const value = useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getSnapshot,
    // @ts-expect-error we can't infer the type here
    selector
  );

  return value;
}

export function NavigationStateListenerProvider({
  state,
  children,
}: {
  state: NavigationState<ParamListBase>;
  children: React.ReactNode;
}) {
  const listeners = React.useRef<(() => void)[]>([]);

  const getState = useLatestCallback(() => state);

  const subscribe = useLatestCallback((callback: () => void) => {
    listeners.current.push(callback);

    return () => {
      listeners.current = listeners.current.filter((cb) => cb !== callback);
    };
  });

  React.useEffect(() => {
    listeners.current.forEach((callback) => callback());
  }, [state]);

  const context = React.useMemo(
    () => ({
      getState,
      subscribe,
    }),
    [getState, subscribe]
  );

  return (
    <NavigationStateListenerContext.Provider value={context}>
      {children}
    </NavigationStateListenerContext.Provider>
  );
}

const NavigationStateListenerContext = React.createContext<
  NavigationStateListener | undefined
>(undefined);
