import * as React from 'react';
import { EventEmitter, EventConsumer, EventArg } from './types';

export type NavigationEventEmitter = EventEmitter<Record<string, any>> & {
  create: (target: string) => EventConsumer<Record<string, any>>;
};

type Listeners = ((data: any) => void)[];

/**
 * Hook to manage the event system used by the navigator to notify screens of various events.
 */
export default function useEventEmitter(): NavigationEventEmitter {
  const listeners = React.useRef<Record<string, Record<string, Listeners>>>({});

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
    ({
      type,
      data,
      target,
      canPreventDefault,
    }: {
      type: string;
      data?: any;
      target?: string;
      canPreventDefault?: boolean;
    }) => {
      const items = listeners.current[type] || {};

      // Copy the current list of callbacks in case they are mutated during execution
      const callbacks =
        target !== undefined
          ? items[target] && items[target].slice()
          : ([] as Listeners).concat(...Object.keys(items).map(t => items[t]));

      const event: EventArg<any, any, any> = {
        get type() {
          return type;
        },
      };

      if (data !== undefined) {
        Object.defineProperty(event, 'data', {
          get() {
            return data;
          },
        });
      }

      if (canPreventDefault) {
        let defaultPrevented = false;

        Object.defineProperties(event, {
          defaultPrevented: {
            get() {
              return defaultPrevented;
            },
          },
          preventDefault: {
            value() {
              defaultPrevented = true;
            },
          },
        });
      }

      callbacks?.forEach(cb => cb(event));

      return event as any;
    },
    []
  );

  return React.useMemo(() => ({ create, emit }), [create, emit]);
}
