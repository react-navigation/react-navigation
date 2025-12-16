import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import { deepFreeze } from './deepFreeze';
import { useLazyValue } from './useLazyValue';

const createStore = <T,>(getInitialState: () => T) => {
  const listeners = new Set<() => void>();

  let initialized = false;
  let state: T;

  const getState = () => {
    if (initialized) {
      return state;
    }

    initialized = true;
    state = deepFreeze(getInitialState());

    return state;
  };

  let isBatching = false;
  let didUpdate = false;

  const setState = (newState: T) => {
    state = deepFreeze(newState);
    didUpdate = true;

    if (!isBatching) {
      listeners.forEach((listener) => listener());
    }
  };

  const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  };

  const batchUpdates = (callback: () => void) => {
    isBatching = true;
    callback();
    isBatching = false;

    if (didUpdate) {
      didUpdate = false;
      listeners.forEach((listener) => listener());
    }
  };

  return {
    getState,
    setState,
    batchUpdates,
    subscribe,
  };
};

export function useSyncState<T>(getInitialState: () => T) {
  const store = useLazyValue(() => createStore(getInitialState));

  // Use a reducer with `store.getState` to always have the latest state
  const [state, rerender] = React.useReducer(
    (_) => store.getState(),
    undefined,
    () => store.getState()
  );

  // Instead of subscribing with `useSyncExternalStore`,
  // we add custom subscription logic in an effect.
  // This means React isn't forced to re-render immediately
  // and state updates work with `useTransition`.
  // The disadvantage is that it can potentially cause tearing.
  // However, since we subscribe to the store only once,
  // and pass this value down, it should not happen in practice.
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => rerender());

    // We need to rerender again after the effect runs
    // So we handle store changes after render and before the effect
    rerender();

    return unsubscribe;
  }, [store]);

  const pendingUpdatesRef = React.useRef<(() => void)[]>([]);

  const scheduleUpdate = useLatestCallback((callback: () => void) => {
    pendingUpdatesRef.current.push(callback);
  });

  const flushUpdates = useLatestCallback(() => {
    const pendingUpdates = pendingUpdatesRef.current;

    pendingUpdatesRef.current = [];

    if (pendingUpdates.length !== 0) {
      store.batchUpdates(() => {
        // Flush all the pending updates
        for (const update of pendingUpdates) {
          update();
        }
      });
    }
  });

  React.useEffect(flushUpdates);

  return {
    state,
    getState: store.getState,
    setState: store.setState,
    scheduleUpdate,
    flushUpdates,
  } as const;
}
