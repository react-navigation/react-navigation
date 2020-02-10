import * as React from 'react';
import { ParamListBase } from '@react-navigation/routers';
import { NavigationProp } from './types';

/**
 * Context which holds the navigation prop for a screen.
 */
const NavigationContext = React.createContext<
  NavigationProp<ParamListBase, string, any, any> | undefined
>(undefined);

export default NavigationContext;
