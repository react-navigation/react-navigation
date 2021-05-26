import { CommonActions } from '@react-navigation/routers';

import type { NavigationContainerRefWithCurrent } from './types';

export const NOT_INITIALIZED_ERROR =
  "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. See https://reactnavigation.org/docs/navigating-without-navigation-prop#handling-initialization for more details.";

export default function createNavigationContainerRef<
  ParamList extends {} = ReactNavigation.RootParamList
>(): NavigationContainerRefWithCurrent<ParamList> {
  const methods = [
    ...Object.keys(CommonActions),
    'addListener',
    'removeListener',
    'resetRoot',
    'dispatch',
    'canGoBack',
    'getRootState',
    'getState',
    'getParent',
    'getCurrentRoute',
    'getCurrentOptions',
  ] as const;

  const ref: NavigationContainerRefWithCurrent<ParamList> = {
    ...methods.reduce<any>((acc, name) => {
      acc[name] = (...args: any[]) => {
        if (ref.current == null) {
          console.error(NOT_INITIALIZED_ERROR);
        } else {
          // @ts-expect-error: this is ok
          return ref.current[name](...args);
        }
      };
      return acc;
    }, {}),
    isReady: () => {
      if (ref.current == null) {
        return false;
      }

      return ref.current.isReady();
    },
    current: null,
  };

  return ref;
}
