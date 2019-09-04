import * as React from 'react';
import { Route } from './types';

/**
 * Context which holds the route prop for a screen.
 */
const NavigationContext = React.createContext<Route<string> | undefined>(
  undefined
);

export default NavigationContext;
