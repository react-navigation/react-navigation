import type { ParamListBase, Route } from '@react-navigation/routers';
import * as React from 'react';

import type { NavigationProp } from './types';
import { useLazyValue } from './useLazyValue';

/**
 * Context which holds the route prop for a screen.
 */
export const NavigationRouteContext = React.createContext<
  Route<string> | undefined
>(undefined);

/**
 * Context which holds the navigation prop for a screen.
 */
export const NavigationContext = React.createContext<
  NavigationProp<ParamListBase> | undefined
>(undefined);

export const NavigationRouteNameContext = React.createContext<
  string | undefined
>(undefined);

type Props = {
  route: Route<string>;
  navigation: NavigationProp<ParamListBase>;
  children: React.ReactNode;
};

/**
 * Component to provide the navigation and route contexts to its children.
 */
export const NamedRouteContextListContext = React.createContext<
  Record<string, React.Context<Route<string>>>
>({});

export function NavigationProvider({ route, navigation, children }: Props) {
  const NamedRouteContext = useLazyValue(() => React.createContext(route));

  const parents = React.use(NamedRouteContextListContext);

  const NamedRouteContextList = React.useMemo(
    () => ({
      ...parents,
      [route.name]: NamedRouteContext,
    }),
    [NamedRouteContext, parents, route.name]
  );

  return (
    <NamedRouteContextListContext.Provider value={NamedRouteContextList}>
      <NamedRouteContext.Provider value={route}>
        <NavigationRouteContext.Provider value={route}>
          <NavigationContext.Provider value={navigation}>
            <NavigationRouteNameContext.Provider value={route.name}>
              {children}
            </NavigationRouteNameContext.Provider>
          </NavigationContext.Provider>
        </NavigationRouteContext.Provider>
      </NamedRouteContext.Provider>
    </NamedRouteContextListContext.Provider>
  );
}
