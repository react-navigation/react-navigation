import React from 'react';

const PreventRemoveContext = React.createContext<{
  preventedRoutes: Record<string, { shouldPrevent: boolean }>;
  setPreventRemove?: (routeKey: string, value: boolean) => void;
}>({
  preventedRoutes: {},
  setPreventRemove: undefined,
});

export default PreventRemoveContext;
