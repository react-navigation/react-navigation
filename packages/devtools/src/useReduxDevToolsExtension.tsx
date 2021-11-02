import type { NavigationContainerRef } from '@react-navigation/core';
import * as React from 'react';

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

  const { resetRoot } = useDevToolsBase(ref, (result) => {
    const devTools = devToolsRef.current;

    if (!devTools) {
      return;
    }

    switch (result.type) {
      case 'init':
        devTools.init(result.state);
        break;
      case 'action':
        devTools.send(result.action, result.state);
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
