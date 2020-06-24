import * as React from 'react';
import type { NavigationAction } from '@react-navigation/routers';

const UnhandledActionContext = React.createContext<
  ((action: NavigationAction) => void) | undefined
>(undefined);

export default UnhandledActionContext;
