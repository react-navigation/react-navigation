import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import type { NavigationListForNested, RootNavigator } from './types';

type NavigationStateEvent = 'update' | 'commit';

type NavigationStateListener = {
  getState: () => NavigationState<ParamListBase>;
  getSnapshot: () => NavigationState<ParamListBase>;
  subscribe: (callback: (event: NavigationStateEvent) => void) => () => void;
};

type NavigationStateEntry = {
  listener: NavigationStateListener;
  state: NavigationState<ParamListBase>;
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

  const { getState, getSnapshot, subscribe } = listener;

  // The store can contain state from a transition that hasn't committed yet.
  // Reading it during render can show state that doesn't match the navigator in that render.
  // The reducer lets React process state in the same render lane as the navigator.
  const [entry, dispatch] = React.useReducer(
    (previous: NavigationStateEntry, event: NavigationStateEvent) => {
      // Navigation state can change between the dispatch and the reducer running.
      // Reading here ensures the processed event uses the state for that render.
      const state = event === 'update' ? getState() : getSnapshot();

      if (
        previous.listener === listener &&
        (previous.state === state ||
          (event === 'update' &&
            Object.is(select(previous.state), select(state))))
      ) {
        return previous;
      }

      return { listener, state };
    },
    undefined,
    () => ({ listener, state: getState() })
  );

  let state = entry.state;

  const committedRef = React.useRef<{
    entry: NavigationStateEntry | null;
    state: NavigationState<ParamListBase>;
    select: (state: NavigationState<ParamListBase>) => unknown;
  }>({ entry: null, state, select });

  React.useInsertionEffect(() => {
    committedRef.current = { entry, state, select };
  });

  const snapshot = getSnapshot();

  const behind =
    state !== snapshot &&
    // A different listener means the state belongs to another navigator.
    // This can happen when the passed route name changes.
    (entry.listener !== listener ||
      // An entry that advanced past the last commit is at least as new as the snapshot.
      // An entry that didn't advance while the committed state changed is older.
      entry === committedRef.current.entry);

  if (behind) {
    state = snapshot;
    dispatch('commit');
  }

  React.useLayoutEffect(() => {
    const check = (event: NavigationStateEvent) => {
      const { state, select } = committedRef.current;

      // An 'update' event follows the latest state in the lane the update was made in.
      // A 'commit' event syncs the reducer to the state committed by the navigator.
      const target = event === 'update' ? getState() : getSnapshot();

      if (state !== target && !Object.is(select(state), select(target))) {
        dispatch(event);
      }
    };

    const unsubscribe = subscribe(check);

    // The reducer may not match the committed state when the subscription starts.
    // This happens on mount during a transition or an update before subscribing.
    check('commit');

    return unsubscribe;
  }, [getState, getSnapshot, subscribe]);

  return select(state);
}

export function NavigationStateListenerProvider({
  isSynced,
  state,
  getState,
  subscribe,
  children,
}: {
  isSynced: boolean;
  state: NavigationState<ParamListBase>;
  getState: () => NavigationState<ParamListBase>;
  subscribe: (callback: () => void) => () => void;
  children: React.ReactNode;
}) {
  const [listeners] = React.useState(
    () => new Set<(event: NavigationStateEvent) => void>()
  );

  React.useLayoutEffect(() => {
    listeners.forEach((listener) => listener('commit'));
  }, [listeners, state]);

  const snapshotRef = React.useRef(state);

  React.useInsertionEffect(() => {
    snapshotRef.current = state;
  }, [state]);

  // Route config or nested params can produce new state during render.
  // If the scheduled update hasn't synced that state to the store yet,
  // We need to expose the rendered state so consumers match the navigator.
  // We keep this `undefined` for other scenarios, so the context isn't recreated.
  const nextState = isSynced ? undefined : state;

  const context = React.useMemo(
    () => ({
      getState,
      getSnapshot: () => nextState ?? snapshotRef.current,
      subscribe: (callback: (event: NavigationStateEvent) => void) => {
        const unsubscribe = subscribe(() => callback('update'));

        listeners.add(callback);

        return () => {
          listeners.delete(callback);
          unsubscribe();
        };
      },
    }),
    [getState, listeners, nextState, subscribe]
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

export const NavigationStateListenerContext = React.createContext<
  NavigationStateListener | undefined
>(undefined);

export const NamedNavigationStateListenerListContext = React.createContext<
  Record<string, NavigationStateListener> | undefined
>(undefined);
