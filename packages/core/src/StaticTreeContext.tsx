import * as React from 'react';

import type { TreeForPathConfig } from './StaticNavigation';

export const StaticTreeContext = React.createContext<
  TreeForPathConfig | undefined
>(undefined);
