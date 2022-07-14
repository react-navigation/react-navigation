import React from 'react';

import PreventRemoveContext from './PreventRemoveContext';
import useNavigationState from './useNavigationState';

type Props = {
  children: React.ReactNode;
};

/**
 * Component used for managing which routes have to be prevented from removal in native-stack
 */
export default function PreventRemoveProvider({ children }: Props) {
  const [preventedRoutes, setPreventedRoutes] = React.useState(
    new Map<string, { shouldPrevent: boolean }>()
  );

  const state = useNavigationState((state) => state);

  // take `setPreventRemove` from parent context
  const { setPreventRemove: setParentPrevented } =
    React.useContext(PreventRemoveContext);

  const shouldPreventParent = React.useMemo(
    () =>
      [...preventedRoutes.values()].some(({ shouldPrevent }) => shouldPrevent),
    [preventedRoutes]
  );

  const setPreventRemove = React.useCallback(
    (routeKey: string, shouldPrevent: boolean): void => {
      setPreventedRoutes((prevPrevented) => {
        const nextPrevented = new Map(prevPrevented);

        if (shouldPrevent) {
          nextPrevented.set(routeKey, { shouldPrevent });
        } else {
          nextPrevented.delete(routeKey);
        }

        return nextPrevented;
      });

      if (setParentPrevented !== undefined) {
        // when setParentPrevented is defined that means the
        // focused route key is the route key of the parent
        const parentRouteKey = state?.routes[state?.index].key;
        setParentPrevented(parentRouteKey, shouldPreventParent);
      }
    },
    [setParentPrevented, state?.index, state?.routes, shouldPreventParent]
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
