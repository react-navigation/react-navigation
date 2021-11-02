import * as React from 'react';

import type { KeyedListenerMap } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add getters to be called for obtaining rehydrated state.
 */
export default function useKeyedChildListeners() {
  const { current: keyedListeners } = React.useRef<
    {
      [K in keyof KeyedListenerMap]: Record<
        string,
        KeyedListenerMap[K] | undefined
      >;
    }
  >({
    getState: {},
    beforeRemove: {},
  });

  const addKeyedListener = React.useCallback(
    <T extends keyof KeyedListenerMap>(
      type: T,
      key: string,
      listener: KeyedListenerMap[T]
    ) => {
      keyedListeners[type][key] = listener;

      return () => {
        keyedListeners[type][key] = undefined;
      };
    },
    [keyedListeners]
  );

  return {
    keyedListeners,
    addKeyedListener,
  };
}
