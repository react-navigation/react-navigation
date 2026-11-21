import * as React from 'react';

export const TabBarLayoutContext = React.createContext<
  { width: number; height: number } | undefined
>(undefined);
