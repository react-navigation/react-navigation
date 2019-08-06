import * as React from 'react';
import { EventEmitter, EventConsumer, EventArg } from './types';

export type NavigationEventEmitter = EventEmitter<{ [key: string]: any }> & {
  create: (target: string) => EventConsumer<{ [key: string]: any }>;
};

type Listeners = Array<(data: any) => void>;

export default function useEventEmitter(): NavigationEventEmitter {
  const listeners = React.useRef<{
    [key: string]: { [key: string]: Listeners };
  }>({});

  const create = React.useCallback((target: string) => {
    const removeListener = (type: string, callback: (data: any) => void) => {
      const callbacks = listeners.current[type]
        ? listeners.current[type][target]
        : undefined;

      if (!callbacks) {
        return;
      }

      const index = callbacks.indexOf(callback);

      callbacks.splice(index, 1);
    };

    const addListener = (type: string, callback: (data: any) => void) => {
      listeners.current[type] = listeners.current[type] || {};
      listeners.current[type][target] = listeners.current[type][target] || [];
      listeners.current[type][target].push(callback);

      return () => removeListener(type, callback);
    };

    return {
      addListener,
      removeListener,
    };
  }, []);

  const emit = React.useCallback(
    ({ type, data, target }: { type: string; data?: any; target?: string }) => {
      const items = listeners.current[type] || {};

      // Copy the current list of callbacks in case they are mutated during execution
      const callbacks =
        target !== undefined
          ? items[target] && items[target].slice()
          : ([] as Listeners).concat(...Object.keys(items).map(t => items[t]));

      let defaultPrevented = false;

      const event: EventArg<any, any> = {
        get type() {
          return type;
        },
        get data() {
          return data;
        },
        get defaultPrevented() {
          return defaultPrevented;
        },
        preventDefault() {
          defaultPrevented = true;
        },
      };

      callbacks && callbacks.forEach(cb => cb(event));

      return event;
    },
    []
  );

  return React.useMemo(() => ({ create, emit }), [create, emit]);
}
