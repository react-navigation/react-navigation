import * as React from 'react';

const DrawerStatusContext =
  React.createContext<'open' | 'closed' | undefined>(undefined);

export default DrawerStatusContext;
