import { nanoid } from 'nanoid/non-secure';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import { NavigationHelpersContext } from './NavigationHelpersContext';
import { NavigationRouteContext } from './NavigationProvider';
import {
  type PreventedRoutes,
  PreventRemoveContext,
} from './PreventRemoveContext';

type Props = {
  children: React.ReactNode;
};

type PreventedRoutesMap = Map<string, string>;

/**
 * Util function to transform map of prevented routes to a simpler object.
 */
const transformPreventedRoutes = (
  preventedRoutesMap: PreventedRoutesMap
): PreventedRoutes => {
  const preventedRoutes: PreventedRoutes = {};

  for (const routeKey of preventedRoutesMap.values()) {
    preventedRoutes[routeKey] = { preventRemove: true };
  }

  return preventedRoutes;
};

/**
 * Component used for managing which routes have to be prevented from removal in native-stack.
 */
export function PreventRemoveProvider({ children }: Props) {
  const [parentId] = React.useState(() => nanoid());
  const [preventedRoutesMap, setPreventedRoutesMap] =
    React.useState<PreventedRoutesMap>(() => new Map());

  const registry = React.useRef<PreventedRoutesMap>(new Map());

  const navigation = React.useContext(NavigationHelpersContext);
  const route = React.useContext(NavigationRouteContext);

  const preventRemoveContextValue = React.useContext(PreventRemoveContext);
  // take `setPreventRemove` from parent context - if exist it means we're in a nested context
  const setParentPrevented = preventRemoveContextValue?.setPreventRemove;
  const notifyParentPrevented = preventRemoveContextValue?.notifyPreventRemove;

  const setPreventRemove = useLatestCallback(
    (id: string, routeKey: string, preventRemove: boolean): void => {
      if (
        preventRemove &&
        (navigation == null ||
          navigation
            ?.getState()
            .routes.every((route) => route.key !== routeKey))
      ) {
        throw new Error(
          `Couldn't find a route with the key ${routeKey}. Is your component inside NavigationContent?`
        );
      }

      if (preventRemove) {
        registry.current.set(id, routeKey);
      } else {
        registry.current.delete(id);
      }
    }
  );

  const notifyPreventRemove = useLatestCallback(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setPreventedRoutesMap((prevPrevented) => {
      const nextPrevented = registry.current;

      const hasChanged =
        prevPrevented.size !== nextPrevented.size ||
        [...nextPrevented].some(
          ([id, routeKey]) => prevPrevented.get(id) !== routeKey
        );

      // values haven't changed - do nothing
      if (!hasChanged) {
        return prevPrevented;
      }

      return new Map(nextPrevented);
    });
  });

  // Sync the state on every commit in case the registry was changed by a screen
  // unmounting while hidden with `<Activity>`, where no passive effects run
  // Also notify the parent so nested prevention propagates upwards
  React.useEffect(() => {
    notifyPreventRemove();
    notifyParentPrevented?.();

    return () => {
      notifyParentPrevented?.();
    };
  });

  const isPrevented = preventedRoutesMap.size > 0;

  React.useInsertionEffect(() => {
    if (route?.key !== undefined && setParentPrevented !== undefined) {
      // when route is defined (and setParentPrevented) it means we're in a nested stack
      // route.key then will be the route key of parent
      setParentPrevented(parentId, route.key, isPrevented);
      return () => {
        setParentPrevented(parentId, route.key, false);
      };
    }

    return;
  }, [parentId, isPrevented, route?.key, setParentPrevented]);

  const value = React.useMemo(
    () => ({
      setPreventRemove,
      notifyPreventRemove,
      preventedRoutes: transformPreventedRoutes(preventedRoutesMap),
    }),
    [setPreventRemove, notifyPreventRemove, preventedRoutesMap]
  );

  return (
    <PreventRemoveContext.Provider value={value}>
      {children}
    </PreventRemoveContext.Provider>
  );
}
