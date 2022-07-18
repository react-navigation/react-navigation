import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import useLatestCallback from 'use-latest-callback';

import NavigationHelpersContext from './NavigationHelpersContext';
import NavigationRouteContext from './NavigationRouteContext';
import PreventRemoveContext, { PreventedRoutes } from './PreventRemoveContext';

type Props = {
  children: React.ReactNode;
};

type PreventedRoutesMap = Map<
  string,
  {
    routeKey: string;
    shouldPrevent: boolean;
  }
>;

const transformPreventedRoutes = (
  preventedRoutesById: PreventedRoutesMap
): PreventedRoutes => {
  // create an object from Map
  const preventedRoutesObjById = Object.fromEntries(preventedRoutesById);
  // get rid of IDs
  const preventedRoutesToTransform = Object.values(preventedRoutesObjById);

  // when routeKey was in route we can safely assume it should be prevented
  const preventedRoutesWithRepetition = preventedRoutesToTransform.map(
    ({ routeKey }) => ({ [routeKey]: { shouldPrevent: true } })
  );
  // remove the duplicates
  const preventedRoutesArr = [...new Set(preventedRoutesWithRepetition)];
  // and create an object from that array
  return Object.assign({}, ...preventedRoutesArr);
};

/**
 * Component used for managing which routes have to be prevented from removal in native-stack
 */
export default function PreventRemoveProvider({ children }: Props) {
  const [id] = React.useState(() => nanoid());
  const [preventedRoutesById, setPreventedRoutesById] =
    React.useState<PreventedRoutesMap>(new Map());

  const navigation = React.useContext(NavigationHelpersContext);
  const route = React.useContext(NavigationRouteContext);

  // take `setPreventRemove` from parent context
  const { setPreventRemove: setParentPrevented } =
    React.useContext(PreventRemoveContext);

  const setPreventRemove = useLatestCallback(
    (id: string, routeKey: string, shouldPrevent: boolean): void => {
      if (
        shouldPrevent &&
        (navigation == null ||
          navigation
            ?.getState()
            .routes.every((route) => route.key !== routeKey))
      ) {
        throw new Error(
          `Couldn't find a route with the key ${routeKey}. Is your component inside NavigationContent?`
        );
      }

      setPreventedRoutesById((prevPrevented) => {
        // values haven't changed - do nothing
        if (
          routeKey === prevPrevented.get(id)?.routeKey &&
          shouldPrevent === prevPrevented.get(id)?.shouldPrevent
        ) {
          return prevPrevented;
        }

        const nextPrevented = new Map(prevPrevented);

        if (shouldPrevent) {
          nextPrevented.set(id, { routeKey, shouldPrevent });
        } else {
          nextPrevented.delete(id);
        }

        return nextPrevented;
      });
    }
  );

  const isPrevented = [...preventedRoutesById.values()].some(
    ({ shouldPrevent }) => shouldPrevent
  );

  React.useEffect(() => {
    if (route?.key !== undefined && setParentPrevented !== undefined) {
      // when route is defined (and setParentPrevented) it means we're in a nested stack
      // route.key then will host route key of parent
      setParentPrevented(id, route.key, isPrevented);
      return () => {
        setParentPrevented(id, route.key, false);
      };
    }

    return;
  }, [id, isPrevented, route?.key, setParentPrevented]);

  const value = React.useMemo(
    () => ({
      setPreventRemove,
      preventedRoutes: transformPreventedRoutes(preventedRoutesById),
    }),
    [setPreventRemove, preventedRoutesById]
  );

  return (
    <PreventRemoveContext.Provider value={value}>
      {children}
    </PreventRemoveContext.Provider>
  );
}
