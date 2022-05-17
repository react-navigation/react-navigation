import * as React from 'react';

import type {
  KeyedListenerMap,
  MapValueType,
} from './NavigationBuilderContext';

type KeyedChildListeners = {
  [ListenerType in keyof KeyedListenerMap]: Map<
    string | undefined,
    MapValueType<KeyedListenerMap[ListenerType]> | undefined
  >;
};

/**
 * Hook which lets child navigators add getters to be called for obtaining rehydrated state.
 */
export default function useKeyedChildListeners() {
  const { current: keyedListeners } = React.useRef<KeyedChildListeners>({
    getState: new Map(),
    beforeRemove: new Map(),
    action: new Map(),
    focus: new Map(),
  });

  const addKeyedListener = React.useCallback(
    <ListenerType extends keyof KeyedChildListeners>(
      type: ListenerType,
      key: string | undefined,
      listener: MapValueType<KeyedListenerMap[ListenerType]> | undefined
    ) => {
      const keyToSet = key !== undefined ? key : 'undefined';
      keyedListeners[type].set(keyToSet, listener as any);

      return () => {
        keyedListeners[type].set(keyToSet, undefined);
      };
    },
    [keyedListeners]
  );

  return {
    keyedListeners,
    addKeyedListener,
  };
}
