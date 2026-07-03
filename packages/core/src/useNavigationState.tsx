import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import { useClientLayoutEffect } from './useClientLayoutEffect';

type NavigationStateListener = {
  getState: () => NavigationState<ParamListBase>;
  subscribe: (callback: () => void) => () => void;
};

type Selector<ParamList extends ParamListBase, T> = (
  state: NavigationState<ParamList>
) => T;

/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export function useNavigationState<ParamList extends ParamListBase, T>(
  selector: Selector<ParamList, T>
): T {
  if (typeof selector !== 'function') {
    throw new Error(
      `A selector function must be provided (got ${typeof selector}).`
    );
  }

  const listener = React.useContext(NavigationStateListenerContext);

  if (listener == null) {
    throw new Error(
      "Couldn't get the navigation state. Is your component inside a navigator?"
    );
  }

  const { getState, subscribe } = listener;

  const [, forceUpdate] = React.useReducer((count: number) => count + 1, 0);

  // @ts-expect-error: this is unsafe, but we need to support it for now
  const selected = selector(getState());

  const selectionRef = React.useRef({ select: selector, selected });

  useClientLayoutEffect(() => {
    selectionRef.current = { select: selector, selected };
  });

  React.useEffect(() => {
    const checkForUpdates = () => {
      const selection = selectionRef.current;

      // @ts-expect-error: this is unsafe, but we need to support it for now
      if (!Object.is(selection.selected, selection.select(getState()))) {
        forceUpdate();
      }
    };

    const unsubscribe = subscribe(checkForUpdates);

    // The state may have changed between the render and the subscription
    checkForUpdates();

    return unsubscribe;
  }, [getState, subscribe]);

  return selected;
}

export function NavigationStateListenerProvider({
  state,
  getState,
  children,
}: {
  state: NavigationState<ParamListBase>;
  getState: () => NavigationState<ParamListBase>;
  children: React.ReactNode;
}) {
  const listeners = React.useRef<(() => void)[]>([]);

  const subscribe = useLatestCallback((callback: () => void) => {
    listeners.current.push(callback);

    return () => {
      listeners.current = listeners.current.filter((cb) => cb !== callback);
    };
  });

  // Notify subscribers once the new state has committed
  useClientLayoutEffect(() => {
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
