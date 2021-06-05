import type {
  NavigationAction,
  NavigationContainerRef,
  NavigationState,
} from '@react-navigation/core';
import deepEqual from 'deep-equal';
import * as React from 'react';

export default function useDevToolsBase(
  ref: React.RefObject<NavigationContainerRef<any>>,
  callback: (
    ...args:
      | [type: 'init', state: NavigationState | undefined]
      | [
          type: 'action',
          action: NavigationAction,
          state: NavigationState | undefined
        ]
  ) => void
) {
  const lastStateRef = React.useRef<NavigationState | undefined>();
  const lastActionRef = React.useRef<NavigationAction | undefined>();
  const callbackRef = React.useRef(callback);
  const lastResetRef = React.useRef<NavigationState | undefined>(undefined);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  React.useEffect(() => {
    let timer: any;
    let unsubscribeAction: (() => void) | undefined;
    let unsubscribeState: (() => void) | undefined;

    const initialize = async () => {
      if (!ref.current) {
        // If the navigation object isn't ready yet, wait for it
        await new Promise<void>((resolve) => {
          timer = setInterval(() => {
            if (ref.current) {
              resolve();
              clearTimeout(timer);
              const state = ref.current.getRootState();

              lastStateRef.current = state;
              callbackRef.current('init', state);
            }
          }, 100);
        });
      }

      const navigation = ref.current!;

      unsubscribeAction = navigation.addListener('__unsafe_action__', (e) => {
        const action = e.data.action;

        if (e.data.noop) {
          // Even if the state didn't change, it's useful to show the action
          callbackRef.current('action', action, lastStateRef.current);
        } else {
          lastActionRef.current = action;
        }
      });

      unsubscribeState = navigation.addListener('state', (e) => {
        // Don't show the action in dev tools if the state is what we sent to reset earlier
        if (
          lastResetRef.current &&
          deepEqual(lastResetRef.current, e.data.state)
        ) {
          lastStateRef.current = undefined;
          return;
        }

        const state = navigation.getRootState();
        const lastState = lastStateRef.current;
        const action = lastActionRef.current;

        lastActionRef.current = undefined;
        lastStateRef.current = state;

        // If we don't have an action and the state didn't change, then it's probably extraneous
        if (action === undefined && deepEqual(state, lastState)) {
          return;
        }

        callbackRef.current('action', action ?? { type: '@@UNKNOWN' }, state);
      });
    };

    initialize();

    return () => {
      unsubscribeAction?.();
      unsubscribeState?.();
      clearTimeout(timer);
    };
  }, [ref]);

  const resetRoot = React.useCallback(
    (state: NavigationState) => {
      if (ref.current) {
        lastResetRef.current = state;
        ref.current.resetRoot(state);
      }
    },
    [ref]
  );

  return { resetRoot };
}
