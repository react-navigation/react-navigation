import { type NavigationState } from '@react-navigation/routers';
import * as React from 'react';

import { NavigationContainerRefContext } from './NavigationContainerRefContext';
import { NavigationContext } from './NavigationContext';
import type { NavigationProp } from './types';

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * @returns Navigation prop of the parent screen.
 */
export function useNavigation<
  T = Omit<NavigationProp<ReactNavigation.RootParamList>, 'getState'> & {
    getState(): NavigationState | undefined;
  },
>(): T {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationContext);

  if (navigation === undefined && root === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const nav = (navigation ?? root) as unknown as T;

  if (root && typeof (root as any).isReady === 'function') {
    const wrapped = { ...(nav as object) } as any;
    const methodsToWrap = ['navigate', 'dispatch', 'goBack', 'push', 'replace'];

    methodsToWrap.forEach((method) => {
      if (typeof (nav as any)[method] === 'function') {
        const original = (nav as any)[method] as (...args: any[]) => any;
        wrapped[method] = (...args: any[]) => {
          if ((root as any).isReady()) {
            original(...args);
          } else {
            const interval = setInterval(() => {
              if ((root as any).isReady()) {
                clearInterval(interval);
                original(...args);
              }
            }, 10);
          }
        };
      }
    });

    return wrapped as T;
  }

  return nav;
}
