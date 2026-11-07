import type {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';

import type { DoubleBackToExitOptions } from './types';

export function useDoubleBackToExit(
  _?:
    | React.RefObject<NavigationContainerRef<ParamListBase> | null>
    | { canGoBack: () => boolean }
    | null,
  __?: DoubleBackToExitOptions
) {
  return {
    reset: () => {},
  };
}
