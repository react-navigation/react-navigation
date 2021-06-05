import type { Route } from '@react-navigation/routers';
import * as React from 'react';

/**
 * Context which holds the route prop for a screen.
 */
const NavigationRouteContext =
  React.createContext<Route<string> | undefined>(undefined);

export default NavigationRouteContext;
