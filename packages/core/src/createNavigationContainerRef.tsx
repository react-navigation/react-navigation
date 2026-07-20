import type { NavigationAction } from '@react-navigation/routers';
import { CommonActions } from '@react-navigation/routers';

import type {
  DefaultContainerRefAction,
  NavigationContainerEventMap,
  NavigationContainerRef,
  NavigationContainerRefWithCurrent,
  RootParamList,
} from './types';

export const NOT_INITIALIZED_ERROR =
  "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. See https://reactnavigation.org/docs/navigating-without-navigation-prop#handling-initialization for more details.";

export function createNavigationContainerRef<
  ParamList extends {} = RootParamList,
  Action extends NavigationAction = DefaultContainerRefAction<ParamList>,
>(): NavigationContainerRefWithCurrent<ParamList, Action> {
  const methods = [
    ...Object.keys(CommonActions),
    'addListener',
    'removeListener',
    'resetRoot',
    'dispatch',
    'isFocused',
    'canGoBack',
    'getRootState',
    'getState',
    'getParent',
    'getCurrentRoute',
    'getCurrentOptions',
  ] as const;

  const listeners: Record<string, ((...args: any[]) => void)[]> = {};

  let current: NavigationContainerRef<ParamList, Action> | null = null;

  const removeListener = (
    event: string,
    callback: (...args: any[]) => void
  ) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter((cb) => cb !== callback);
    }

    current?.removeListener(
      event as keyof NavigationContainerEventMap,
      callback
    );
  };

  const ref: NavigationContainerRefWithCurrent<ParamList, Action> = {
    get current() {
      return current;
    },
    set current(value: NavigationContainerRef<ParamList, Action> | null) {
      current = value;

      if (value != null) {
        Object.entries(listeners).forEach(([event, callbacks]) => {
          callbacks.forEach((callback) => {
            value.addListener(
              event as keyof NavigationContainerEventMap,
              callback
            );
          });
        });
      }
    },
    isReady: () => {
      if (current == null) {
        return false;
      }

      return current.isReady();
    },
    ...methods.reduce<any>((acc, name) => {
      acc[name] = (...args: any[]) => {
        if (name === 'removeListener') {
          const [event, callback] = args;

          removeListener(event, callback);
        } else if (current == null) {
          switch (name) {
            case 'addListener': {
              const [event, callback] = args;

              listeners[event] = listeners[event] || [];
              listeners[event].push(callback);

              return () => removeListener(event, callback);
            }
            default:
              console.error(NOT_INITIALIZED_ERROR);
          }
        } else {
          // @ts-expect-error: this is ok
          return current[name](...args);
        }
      };
      return acc;
    }, {}),
  };

  return ref;
}
