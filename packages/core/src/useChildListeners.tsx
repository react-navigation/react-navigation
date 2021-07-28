import * as React from 'react';

import type { ListenerMap } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add action listeners.
 */
export default function useChildListeners() {
  const { current: listeners } = React.useRef<
    {
      [K in keyof ListenerMap]: Record<string, ListenerMap[K]>;
    }
  >({
    action: {},
    focus: {},
  });

  const addListener = React.useCallback(
    <T extends keyof ListenerMap>(
      type: T,
      key: string,
      listener: ListenerMap[T]
    ) => {
      listeners[type][key] = listener;

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete listeners[type][key];
      };
    },
    [listeners]
  );

  return {
    listeners,
    addListener,
  };
}
