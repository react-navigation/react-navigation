import React from 'react';

import PreventRemoveContext from './PreventRemoveContext';
import useNavigationState from './useNavigationState';

export default function PreventRemoveProvider({ children }: any) {
  const [preventedRoutes, setPreventedRoutes] = React.useState<
    Record<string, { shouldPrevent: boolean }>
  >({});

  const state = useNavigationState((state) => state);

  // take `setPreventRemove` from parent context
  const { setPreventRemove: setParentPrevented } =
    React.useContext(PreventRemoveContext);

  const setPreventRemove = React.useCallback(
    (routeKey: string, shouldPrevent: boolean): void => {
      const nextPrevented = {
        ...preventedRoutes,
        [routeKey]: { shouldPrevent },
      };

      setPreventedRoutes(nextPrevented);

      // when setParentPrevented is defined in focusedRouteKey will have the focused parent screen
      if (setParentPrevented) {
        const focusedRouteKey = state?.routes[state?.index].key;
        setParentPrevented(
          focusedRouteKey,
          Object.values(nextPrevented).some(
            ({ shouldPrevent }) => shouldPrevent
          )
        );
      }
    },
    [preventedRoutes, setParentPrevented, state?.index, state?.routes]
  );

  return (
    <PreventRemoveContext.Provider
      value={{ setPreventRemove, preventedRoutes }}
    >
      {children}
    </PreventRemoveContext.Provider>
  );
}
