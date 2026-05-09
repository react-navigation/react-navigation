import * as React from 'react';

import type { EventArg, EventConsumer, EventEmitter } from './types';

export type NavigationEventEmitter<T extends Record<string, any>> =
  EventEmitter<T> & {
    create: (target: string) => EventConsumer<T>;
  };

type Listeners = Set<(e: any) => void>;

/**
 * Hook to manage the event system used by the navigator to notify screens of various events.
 */
export function useEventEmitter<T extends Record<string, any>>(
  listen?: (e: any) => void
): NavigationEventEmitter<T> {
  const listenRef = React.useRef(listen);

  React.useEffect(() => {
    listenRef.current = listen;
  });

  const listeners = React.useRef<Record<string, Record<string, Listeners>>>(
    Object.create(null)
  );

  const create = React.useCallback((target: string) => {
    const removeListener = (type: string, callback: (data: any) => void) => {
      const callbacks = listeners.current[type]?.[target];

      callbacks?.delete(callback);
    };

    const addListener = (type: string, callback: (data: any) => void) => {
      listeners.current[type] ??= {};
      listeners.current[type][target] ??= new Set();

      listeners.current[type][target].add(callback);

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
      const items = listeners.current[type];

      // Copy the current list of callbacks in case they are mutated during execution
      let callbacks: Set<(e: any) => void> | undefined;

      if (items) {
        if (target !== undefined) {
          const targetSet = items[target];

          if (targetSet && targetSet.size) {
            callbacks = new Set(targetSet);
          }
        } else {
          for (const key in items) {
            const set = items[key];

            if (set && set.size) {
              callbacks ??= new Set();

              for (const cb of set) {
                callbacks.add(cb);
              }
            }
          }
        }
      }

      const descriptors: PropertyDescriptorMap = {
        type: { enumerable: true, value: type },
      };

      if (target !== undefined) {
        descriptors.target = { enumerable: true, value: target };
      }

      if (data !== undefined) {
        descriptors.data = { enumerable: true, value: data };
      }

      let defaultPrevented = false;

      if (canPreventDefault) {
        descriptors.defaultPrevented = {
          enumerable: true,
          get() {
            return defaultPrevented;
          },
        };
        descriptors.preventDefault = {
          enumerable: true,
          value() {
            defaultPrevented = true;
          },
        };
      }

      const event: EventArg<any, any, any> = Object.defineProperties(
        {} as EventArg<any, any, any>,
        descriptors
      );

      listenRef.current?.(event);

      callbacks?.forEach((cb) => cb(event));

      return event as any;
    },
    []
  );

  return React.useMemo(() => ({ create, emit }), [create, emit]);
}
