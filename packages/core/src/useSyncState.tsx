import * as React from 'react';

const UNINTIALIZED_STATE = {};

export default function useSyncState<T>(initialState?: (() => T) | T) {
  const stateRef = React.useRef<T>(UNINTIALIZED_STATE as any);

  if (stateRef.current === UNINTIALIZED_STATE) {
    stateRef.current =
      // @ts-ignore
      typeof initialState === 'function' ? initialState() : initialState;
  }

  const [state, setTrackingState] = React.useState(stateRef.current);

  const getState = React.useCallback(() => stateRef.current, []);

  const setState = React.useCallback((state: T) => {
    if (state === stateRef.current) {
      return;
    }

    stateRef.current = state;
    setTrackingState(state);
  }, []);

  return [state, getState, setState] as const;
}
