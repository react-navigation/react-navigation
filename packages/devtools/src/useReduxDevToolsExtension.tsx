import * as React from 'react';
import type { NavigationContainerRef } from '@react-navigation/core';
import useDevToolsBase from './useDevToolsBase';

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

  const { resetRoot } = useDevToolsBase(ref, (...args) => {
    const devTools = devToolsRef.current;

    if (!devTools) {
      return;
    }

    switch (args[0]) {
      case 'init':
        devTools.init(args[1]);
        break;
      case 'action':
        devTools.send(args[1], args[2]);
        break;
    }
  });

  React.useEffect(
    () =>
      devToolsRef.current?.subscribe((message) => {
        if (message.type === 'DISPATCH' && message.state) {
          const state = JSON.parse(message.state);

          resetRoot(state);
        }
      }),
    [resetRoot]
  );
}
