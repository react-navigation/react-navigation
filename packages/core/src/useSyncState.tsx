import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import { deepFreeze } from './deepFreeze';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

const createStore = <T,>(getInitialState: () => T) => {
  const listeners: (() => void)[] = [];

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
    listeners.push(callback);

    return () => {
      const index = listeners.indexOf(callback);

      if (index > -1) {
        listeners.splice(index, 1);
      }
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
  const store = React.useRef(createStore(getInitialState)).current;

  const state = React.useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState
  );

  React.useDebugValue(state);

  const pendingUpdatesRef = React.useRef<(() => void)[]>([]);

  const scheduleUpdate = useLatestCallback((callback: () => void) => {
    pendingUpdatesRef.current.push(callback);
  });

  useIsomorphicLayoutEffect(() => {
    // Flush all the pending updates
    const pendingUpdates = pendingUpdatesRef.current;

    pendingUpdatesRef.current = [];

    if (pendingUpdates.length !== 0) {
      store.batchUpdates(() => {
        // Flush all the pending updates
        // These updates should be scheduled in useEffect
        // Run them in reverse order so that the deepest updates are run last
        // This is opposite to useEffect where the deepest effects are run first
        for (let i = pendingUpdates.length - 1; i >= 0; i--) {
          const update = pendingUpdates[i];

          update();
        }
      });
    }
  });

  return [state, store.getState, store.setState, scheduleUpdate] as const;
}
