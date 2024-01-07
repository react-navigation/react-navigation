import * as React from 'react';

const createStore = <T,>(getInitialState: () => T) => {
  const listeners: (() => void)[] = [];

  let state: T = getInitialState();

  const getState = () => state;

  const setState = (newState: T) => {
    state = newState;
    listeners.forEach((listener) => listener());
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

  return {
    getState,
    setState,
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

  return [state, store.getState, store.setState] as const;
}
