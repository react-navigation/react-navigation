import * as React from 'react';
import { Route } from '@react-navigation/routers';

/**
 * Context which holds the route prop for a screen.
 */
const NavigationContext = React.createContext<Route<string> | undefined>(
  undefined
);

export default NavigationContext;
