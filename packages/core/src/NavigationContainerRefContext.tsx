import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import type { NavigationContainerRef } from './types';

/**
 * Context which holds the route prop for a screen.
 */
const NavigationContainerRefContext =
  React.createContext<NavigationContainerRef<ParamListBase> | undefined>(
    undefined
  );

export default NavigationContainerRefContext;
