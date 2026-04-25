import * as React from 'react';

import type { StaticNavigation } from './StaticNavigation';

export type StaticNavigationContextValue = {
  /**
   * The static navigation config tree for the nearest static navigator.
   */
  tree: StaticNavigation<any, any, any>;
  /**
   * Shared abort controller for the in-flight loader.
   */
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  /**
   * `true` only on the outermost static navigator. Used to gate
   * firing the initial loader.
   */
  isOutermost: boolean;
};

export const StaticNavigationContext = React.createContext<
  StaticNavigationContextValue | undefined
>(undefined);
