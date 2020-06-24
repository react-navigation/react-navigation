import * as React from 'react';

const UNINTIALIZED_STATE = {};

/**
 * This is definitely not compatible with concurrent mode, but we don't have a solution for sync state yet.
 */
export default function useSyncState<T>(initialState?: (() => T) | T) {
  const stateRef = React.useRef<T>(UNINTIALIZED_STATE as any);
  const isSchedulingRef = React.useRef(false);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (stateRef.current === UNINTIALIZED_STATE) {
    stateRef.current =
      // @ts-expect-error: initialState is a function, but TypeScript doesn't think so
      typeof initialState === 'function' ? initialState() : initialState;
  }

  const [trackingState, setTrackingState] = React.useState(stateRef.current);

  const getState = React.useCallback(() => stateRef.current, []);

  const setState = React.useCallback((state: T) => {
    if (state === stateRef.current || !isMountedRef.current) {
      return;
    }

    stateRef.current = state;

    if (!isSchedulingRef.current) {
      setTrackingState(state);
    }
  }, []);

  const scheduleUpdate = React.useCallback((callback: () => void) => {
    isSchedulingRef.current = true;

    try {
      callback();
    } finally {
      isSchedulingRef.current = false;
    }
  }, []);

  const flushUpdates = React.useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    // Make sure that the tracking state is up-to-date.
    // We call it unconditionally, but React should skip the update if state is unchanged.
    setTrackingState(stateRef.current);
  }, []);

  // If we're rendering and the tracking state is out of date, update it immediately
  // This will make sure that our updates are applied as early as possible.
  if (trackingState !== stateRef.current) {
    setTrackingState(stateRef.current);
  }

  const state = stateRef.current;

  return [state, getState, setState, scheduleUpdate, flushUpdates] as const;
}
