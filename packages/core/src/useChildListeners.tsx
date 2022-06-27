import * as React from 'react';

import type { ListenerMap } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add action listeners.
 */
export default function useChildListeners() {
  const { current: listeners } = React.useRef<{
    [K in keyof ListenerMap]: ListenerMap[K][];
  }>({
    action: [],
    focus: [],
  });

  const addListener = React.useCallback(
    <T extends keyof ListenerMap>(type: T, listener: ListenerMap[T]) => {
      listeners[type].push(listener);

      return () => {
        const index = listeners[type].indexOf(listener);

        listeners[type].splice(index, 1);
      };
    },
    [listeners]
  );

  return {
    listeners,
    addListener,
  };
}
