import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import type { NavigationListForNested, RootNavigator } from './types';

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
  ? State
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
  const RouteName extends keyof NavigationListForNested<Navigator> =
    keyof NavigationListForNested<Navigator>,
>(
  routeName: RouteName,
  selector: (state: NavigationStateForNested<Navigator, RouteName>) => T
): T;
export function useNavigationState<T>(
  selector: (state: NavigationState<ParamListBase>) => T
): T;
export function useNavigationState(...args: unknown[]): unknown {
  const selector = typeof args[0] === 'string' ? args[1] : args[0];

  if (typeof selector !== 'function') {
    throw new Error(
      `A selector function must be provided (got ${typeof selector}).`
    );
  }

  // @ts-expect-error: the public overloads guarantee the selector's type, but
  // the `unknown[]` implementation signature can't express it
  const select: (state: NavigationState<ParamListBase>) => unknown = selector;

  let listener: NavigationStateListener | undefined;

  if (typeof args[0] === 'string') {
    const name = args[0];
    const listeners = React.use(NamedNavigationStateListenerListContext);

    listener = listeners?.[name];

    if (listener == null) {
      throw new Error(
        `Couldn't find a navigator for the route '${name}' in any of the parent screens. Is your component inside the correct screen?`
      );
    }
  } else {
    listener = React.use(NavigationStateListenerContext);

    if (listener == null) {
      throw new Error(
        "Couldn't get the navigation state. Is your component inside a navigator?"
      );
    }
  }

  const { getState, subscribe } = listener;

  const [, forceUpdate] = React.useReducer((count: number) => count + 1, 0);

  const selected = select(getState());

  const selectionRef = React.useRef({ select, selected });

  React.useLayoutEffect(() => {
    selectionRef.current = { select, selected };
  });

  React.useEffect(() => {
    const checkForUpdates = () => {
      const selection = selectionRef.current;

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
  React.useLayoutEffect(() => {
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

export function NamedNavigationStateListenerProvider({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const listener = React.use(NavigationStateListenerContext);

  if (listener == null) {
    throw new Error(
      "Couldn't find a navigation state listener. This is likely because the navigator doesn't render its content under 'NavigationContent'."
    );
  }

  const parents = React.use(NamedNavigationStateListenerListContext);

  const listeners = React.useMemo(
    () => ({
      ...parents,
      [name]: listener,
    }),
    [listener, name, parents]
  );

  return (
    <NamedNavigationStateListenerListContext.Provider value={listeners}>
      {children}
    </NamedNavigationStateListenerListContext.Provider>
  );
}

const NavigationStateListenerContext = React.createContext<
  NavigationStateListener | undefined
>(undefined);

export const NamedNavigationStateListenerListContext = React.createContext<
  Record<string, NavigationStateListener> | undefined
>(undefined);
