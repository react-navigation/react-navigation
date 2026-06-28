import * as React from 'react';

import type { TreeForPathConfig } from './StaticNavigation';

export type StaticNavigationContextValue = {
  /**
   * The static navigation config tree for the nearest static navigator.
   */
  tree: TreeForPathConfig;
};

export const StaticNavigationContext = React.createContext<
  StaticNavigationContextValue | undefined
>(undefined);
