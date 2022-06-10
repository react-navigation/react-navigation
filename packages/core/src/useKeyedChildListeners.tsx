import * as React from 'react';

import type { KeyedListenerMap } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add action listener, focus listener,
 * beforeRemove listener, and getters to be called for obtaining rehydrated state.
 */
export default function useKeyedChildListeners() {
  const { current: keyedListeners } = React.useRef<{
    [K in keyof KeyedListenerMap]: Map<string, KeyedListenerMap[K] | undefined>;
  }>({
    action: new Map(),
    focus: new Map(),
    getState: new Map(),
    beforeRemove: new Map(),
  });

  const addKeyedListener = React.useCallback(
    <T extends keyof KeyedListenerMap>(
      type: T,
      key: string,
      listener: KeyedListenerMap[T]
    ) => {
      //@ts-expect-error listener should be correct type according to `type`
      keyedListeners[type].set(key, listener);

      return () => {
        keyedListeners[type].set(key, undefined);
      };
    },
    [keyedListeners]
  );

  return {
    keyedListeners,
    addKeyedListener,
  };
}
