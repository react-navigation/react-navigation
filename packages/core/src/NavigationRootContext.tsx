import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import type { GenericNavigation } from './types';

/**
 * Context which holds the navigation object for components outside a screen.
 */
export const NavigationRootContext = React.createContext<
  GenericNavigation<ParamListBase> | undefined
>(undefined);
