import * as React from 'react';

const MISSING_CONTEXT_ERROR = "Couldn't find a global navigation context.";

const GlobalNavigationContext = React.createContext<{
  onOptionsChange: () => void;
}>({
  get onOptionsChange(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default GlobalNavigationContext;
