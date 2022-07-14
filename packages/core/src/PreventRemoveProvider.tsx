import React from 'react';

import PreventRemoveContext from './PreventRemoveContext';
import useNavigationState from './useNavigationState';

export default function PreventRemoveProvider({ children }: any) {
  const [preventedRoutes, setPreventedRoutes] = React.useState(
    new Map<string, { shouldPrevent: boolean }>()
  );

  const state = useNavigationState((state) => state);

  // take `setPreventRemove` from parent context
  const { setPreventRemove: setParentPrevented } =
    React.useContext(PreventRemoveContext);

  const setPreventRemove = React.useCallback(
    (routeKey: string, shouldPrevent: boolean): void => {
      const nextPrevented = new Map(preventedRoutes);
      if (shouldPrevent) {
        nextPrevented.set(routeKey, { shouldPrevent });
      } else {
        nextPrevented.delete(routeKey);
      }

      setPreventedRoutes(nextPrevented);

      // focusedRouteKey will be the focused parent screen when setParentPrevented is defined
      if (setParentPrevented) {
        const focusedRouteKey = state?.routes[state?.index].key;
        setParentPrevented(
          focusedRouteKey,
          [...nextPrevented.values()].some(({ shouldPrevent }) => shouldPrevent)
        );
      }
    },
    [preventedRoutes, setParentPrevented, state?.index, state?.routes]
  );

  return (
    <PreventRemoveContext.Provider
      value={{
        setPreventRemove,
        preventedRoutes: Object.fromEntries(preventedRoutes),
      }}
    >
      {children}
    </PreventRemoveContext.Provider>
  );
}
