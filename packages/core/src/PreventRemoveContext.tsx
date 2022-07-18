import React from 'react';

/**
 * An object that have a route key as an object key and
 * a value whether to prevent that route.
 */
export type PreventedRoutes = Record<string, { shouldPrevent: boolean }>;

const PreventRemoveContext = React.createContext<{
  preventedRoutes: PreventedRoutes;
  setPreventRemove?: (
    id: string,
    routeKey: string,
    shouldPrevent: boolean
  ) => void;
}>({
  preventedRoutes: {},
  setPreventRemove: undefined,
});

export default PreventRemoveContext;