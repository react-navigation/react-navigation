import * as React from 'react';
import { NavigationProp } from './types';

const NavigationContext = React.createContext<NavigationProp | undefined>(
  undefined
);

export default NavigationContext;
