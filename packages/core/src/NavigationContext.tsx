import * as React from 'react';
import { NavigationProp, ParamListBase } from './types';

const NavigationContext = React.createContext<
  NavigationProp<ParamListBase> | undefined
>(undefined);

export default NavigationContext;
