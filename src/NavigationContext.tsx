import * as React from 'react';
import { NavigationHelpers, ParamListBase } from './types';

const NavigationContext = React.createContext<
  NavigationHelpers<ParamListBase> | undefined
>(undefined);

export default NavigationContext;
