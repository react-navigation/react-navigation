import * as React from 'react';
import { NavigationHelpers, NavigationAction } from './types';

const NavigationBuilderContext = React.createContext<{
  helpers?: NavigationHelpers;
  onAction?: (action: NavigationAction) => boolean;
}>({});

export default NavigationBuilderContext;
