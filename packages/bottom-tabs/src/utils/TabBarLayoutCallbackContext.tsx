import * as React from 'react';

export const TabBarLayoutCallbackContext = React.createContext<
  ((layout: { width: number; height: number }) => void) | undefined
>(undefined);
