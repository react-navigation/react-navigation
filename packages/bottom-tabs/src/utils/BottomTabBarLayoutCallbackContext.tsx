import * as React from 'react';

export const BottomTabBarLayoutCallbackContext = React.createContext<
  ((layout: { width: number; height: number }) => void) | undefined
>(undefined);
