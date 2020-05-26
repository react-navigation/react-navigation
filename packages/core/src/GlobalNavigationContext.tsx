import * as React from 'react';
import { Route } from '@react-navigation/routers';

const MISSING_CONTEXT_ERROR = "Couldn't find a global navigation context.";

const GlobalNavigationContext = React.createContext<{
  onOptionsChange: () => void;
  getCurrentRoute(): Route<string> | undefined;
  getCurrentOptions(): object | undefined;
  addListener: (listener: () => void) => () => void;
}>({
  get onOptionsChange(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get getCurrentRoute(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get getCurrentOptions(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get addListener(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default GlobalNavigationContext;
