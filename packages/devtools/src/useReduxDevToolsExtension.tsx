import * as React from 'react';
import type {
  NavigationContainerRef,
  NavigationState,
  NavigationAction,
} from '@react-navigation/core';
import deepEqual from 'deep-equal';

type DevToolsConnection = {
  init(value: any): void;
  send(action: any, value: any): void;
  subscribe(
    listener: (message: { type: string; [key: string]: any }) => void
  ): () => void;
};

type DevToolsExtension = {
  connect(options: { name: string }): DevToolsConnection;
  disconnect(): void;
};

declare const __REDUX_DEVTOOLS_EXTENSION__: DevToolsExtension | undefined;

export default function useReduxDevToolsExtension(
  ref: React.RefObject<NavigationContainerRef<any>>
) {
  const devToolsRef = React.useRef<DevToolsConnection>();

  if (
    devToolsRef.current === undefined &&
    typeof __REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
  ) {
    devToolsRef.current = __REDUX_DEVTOOLS_EXTENSION__.connect({
      name: '@react-navigation/devtools',
    });
  }

  const lastStateRef = React.useRef<NavigationState | undefined>();
  const lastActionRef = React.useRef<NavigationAction | undefined>();

  React.useEffect(
    () =>
      devToolsRef.current?.subscribe((message) => {
        if (message.type === 'DISPATCH' && message.state) {
          const state = JSON.parse(message.state);

          lastStateRef.current = state;
          ref.current?.resetRoot(state);
        }
      }),
    [ref]
  );

  React.useEffect(() => {
    const devTools = devToolsRef.current;
    const navigation = ref.current;

    if (!navigation || !devTools) {
      return;
    }

    if (lastStateRef.current === undefined) {
      const state = navigation.getRootState();

      devTools.init(state);
      lastStateRef.current = state;
    }

    const unsubscribeAction = navigation.addListener(
      '__unsafe_action__',
      (e) => {
        const action = e.data.action;

        if (e.data.noop) {
          // Even if the state didn't change, it's useful to show the action
          devTools.send(action, lastStateRef.current);
        } else {
          lastActionRef.current = action;
        }
      }
    );

    const unsubscribeState = navigation.addListener('state', (e) => {
      // Don't show the action in dev tools if the state is what we sent to reset earlier
      if (lastStateRef.current === e.data.state) {
        return;
      }

      const lastState = lastStateRef.current;
      const state = navigation.getRootState();
      const action = lastActionRef.current;

      lastActionRef.current = undefined;
      lastStateRef.current = state;

      // If we don't have an action and the state didn't change, then it's probably extraneous
      if (action === undefined && deepEqual(state, lastState)) {
        return;
      }

      devTools.send(action ?? '@@UNKNOWN', state);
    });

    return () => {
      unsubscribeAction();
      unsubscribeState();
    };
  });
}
