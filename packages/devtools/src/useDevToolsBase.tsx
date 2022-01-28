import type {
  NavigationAction,
  NavigationContainerRef,
  NavigationState,
} from '@react-navigation/core';
import deepEqual from 'deep-equal';
import * as React from 'react';

import parseErrorStack from './parseErrorStack';

type StackFrame = {
  lineNumber: number | null;
  column: number | null;
  file: string | null;
  methodName: string;
};

type StackFrameResult = StackFrame & {
  collapse: boolean;
};

type StackResult = {
  stack: StackFrameResult[];
};

type InitData = {
  type: 'init';
  state: NavigationState | undefined;
};

type ActionData = {
  type: 'action';
  action: NavigationAction;
  state: NavigationState | undefined;
  stack: string | undefined;
};

export default function useDevToolsBase(
  ref: React.RefObject<NavigationContainerRef<any>>,
  callback: (result: InitData | ActionData) => void
) {
  const lastStateRef = React.useRef<NavigationState | undefined>();
  const lastActionRef = React.useRef<
    { action: NavigationAction; stack: string | undefined } | undefined
  >();
  const callbackRef = React.useRef(callback);
  const lastResetRef = React.useRef<NavigationState | undefined>(undefined);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  const symbolicate = async (stack: string | undefined) => {
    if (stack == null) {
      return undefined;
    }

    const frames = parseErrorStack(stack)
      .slice(2)
      .filter((frame) => frame.file !== '[native code]');

    const urlMatch = frames[0]?.file?.match(/^https?:\/\/.+(:\d+)?\//);

    if (!urlMatch) {
      return stack;
    }

    try {
      const result: StackResult = await fetch(`${urlMatch[0]}symbolicate`, {
        method: 'POST',
        body: JSON.stringify({ stack: frames }),
      }).then((res) => res.json());

      return result.stack
        .filter((it) => !it.collapse)
        .map(
          ({ methodName, file, lineNumber, column }) =>
            `${methodName}@${file}:${lineNumber}:${column}`
        )
        .join('\n');
    } catch (err) {
      return stack;
    }
  };

  const pendingPromiseRef = React.useRef<Promise<void>>(Promise.resolve());

  const send = React.useCallback((data: ActionData) => {
    // We need to make sure that our callbacks executed in the same order
    // So we add check if the last promise is settled before sending the next one
    pendingPromiseRef.current = pendingPromiseRef.current
      .catch(() => {
        // Ignore any errors from the last promise
      })
      .then(async () => {
        if (data.stack) {
          let stack: string | undefined;

          try {
            stack = await symbolicate(data.stack);
          } catch (err) {
            // Ignore errors from symbolicate
          }

          callbackRef.current({ ...data, stack });
        } else {
          callbackRef.current(data);
        }
      });
  }, []);

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
              callbackRef.current({ type: 'init', state });
            }
          }, 100);
        });
      }

      const navigation = ref.current!;

      unsubscribeAction = navigation.addListener('__unsafe_action__', (e) => {
        const action = e.data.action;

        if (e.data.noop) {
          // Even if the state didn't change, it's useful to show the action
          send({
            type: 'action',
            action,
            state: lastStateRef.current,
            stack: e.data.stack,
          });
        } else {
          lastActionRef.current = e.data;
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
        const lastChange = lastActionRef.current;

        lastActionRef.current = undefined;
        lastStateRef.current = state;

        // If we don't have an action and the state didn't change, then it's probably extraneous
        if (lastChange === undefined && deepEqual(state, lastState)) {
          return;
        }

        send({
          type: 'action',
          action: lastChange ? lastChange.action : { type: '@@UNKNOWN' },
          state,
          stack: lastChange?.stack,
        });
      });
    };

    initialize();

    return () => {
      unsubscribeAction?.();
      unsubscribeState?.();
      clearTimeout(timer);
    };
  }, [ref, send]);

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
