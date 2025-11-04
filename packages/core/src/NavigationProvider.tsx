import type { ParamListBase, Route } from '@react-navigation/routers';
import * as React from 'react';

import type { NavigationProp } from './types';

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
export const NavigationProvider = ({ route, navigation, children }: Props) => {
  return (
    <NavigationContext.Provider value={navigation}>
      <NavigationRouteContext.Provider value={route}>
        <NavigationRouteNameContext.Provider value={route.name}>
          {children}
        </NavigationRouteNameContext.Provider>
      </NavigationRouteContext.Provider>
    </NavigationContext.Provider>
  );
};
