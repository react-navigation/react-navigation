import type { Route } from '@react-navigation/routers';
import * as React from 'react';
import { useMemo } from 'react';
import useLatestCallback from 'use-latest-callback';

/**
 * Context which holds the route prop for a screen.
 */
export const NavigationRouteContext = React.createContext<
  Route<string> | undefined
>(undefined);

// TODO merge those contexts?
export const NavigationRouteContextOuter = React.createContext<{
  getRoute: (name: string) => Route<string> | undefined;
  getSubscribe: (name: string) => (callback: () => void) => () => void;
}>({
  get getRoute(): any {
    throw new Error(
      "Couldn't find a route. Have you wrapped your route with `NavigationRouteContextProvider`?"
    );
  },
  get getSubscribe(): any {
    throw new Error(
      "Couldn't find a route. Have you wrapped your route with `NavigationRouteContextProvider`?"
    );
  },
});

export function NavigationRouteContextProvider({
  value,
  children,
}: {
  value: Route<string> | undefined;
  children: React.ReactNode;
}) {
  const parent = React.useContext(NavigationRouteContextOuter);

  const getRoute = useLatestCallback((name: string) => {
    if (value?.name === name) {
      return value;
    }
    return parent?.getRoute(name);
  });

  const routeListeners = React.useRef(new Set<() => void>()).current;

  const subscribe = (callback: () => void) => {
    routeListeners.add(callback);

    return () => {
      routeListeners.delete(callback);
    };
  };

  const getSubscribe = useLatestCallback((name: string) => {
    if (value?.name === name) {
      return subscribe;
    }
    return parent?.getSubscribe(name);
  });

  const notifyRouteListeners = useLatestCallback(() => {
    routeListeners.forEach((listener) => listener());
  });

  const previousValue = React.useRef(value);
  if (previousValue.current !== value) {
    previousValue.current = value;
    notifyRouteListeners();
  }

  return (
    <NavigationRouteContextOuter.Provider
      value={useMemo(
        () => ({
          getRoute,
          getSubscribe,
        }),
        [getRoute, getSubscribe]
      )}
    >
      <NavigationRouteContext.Provider value={value}>
        {children}
      </NavigationRouteContext.Provider>
    </NavigationRouteContextOuter.Provider>
  );
}
