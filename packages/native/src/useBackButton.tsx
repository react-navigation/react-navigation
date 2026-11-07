import type {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';

import type { DoubleBackToExitOptions } from './types';

export function useBackButton(
  _: React.RefObject<NavigationContainerRef<ParamListBase> | null>,
  __?: boolean | DoubleBackToExitOptions
) {
  // No-op
  // BackHandler is not available on web
}
