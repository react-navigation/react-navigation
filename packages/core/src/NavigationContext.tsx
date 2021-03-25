import * as React from 'react';
import type { ParamListBase } from '@react-navigation/routers';
import type { NavigationProp } from './types';

/**
 * Context which holds the navigation prop for a screen.
 */
const NavigationContext = React.createContext<
  NavigationProp<ParamListBase, string, any, any> | undefined
>(undefined);

export default NavigationContext;
