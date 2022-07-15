import React from 'react';
import useLatestCallback from 'use-latest-callback';

import NavigationRouteContext from './NavigationRouteContext';
import PreventRemoveContext from './PreventRemoveContext';

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

  const route = React.useContext(NavigationRouteContext);

  // take `setPreventRemove` from parent context
  const { setPreventRemove: setParentPrevented } =
    React.useContext(PreventRemoveContext);

  const setPreventRemove = useLatestCallback(
    (routeKey: string, shouldPrevent: boolean): void => {
      const nextPrevented = new Map(preventedRoutes);

      if (shouldPrevent) {
        nextPrevented.set(routeKey, { shouldPrevent });
      } else {
        nextPrevented.delete(routeKey);
      }

      setPreventedRoutes(nextPrevented);

      if (route !== undefined && setParentPrevented !== undefined) {
        // when route is defined (and setParentPrevented) it means we're in a nested stack
        // route.key then will host route key of parent
        setParentPrevented(
          route.key,
          [...nextPrevented.values()].some(({ shouldPrevent }) => shouldPrevent)
        );
      }
    }
  );

  const value = React.useMemo(
    () => ({
      setPreventRemove,
      preventedRoutes: Object.fromEntries(preventedRoutes),
    }),
    [preventedRoutes, setPreventRemove]
  );

  return (
    <PreventRemoveContext.Provider value={value}>
      {children}
    </PreventRemoveContext.Provider>
  );
}
