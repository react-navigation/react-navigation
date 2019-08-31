import * as React from 'react';
import {
  NavigationProp,
  ParamListBase,
  PartialState,
  Route,
  NavigationState,
} from './types';

/**
 * Context which holds the navigation prop for a screen.
 */
const NavigationContext = React.createContext<{
  navigation: NavigationProp<ParamListBase, string, any, any> | undefined;
  route:
    | Route<string> & {
        state?: NavigationState | PartialState<NavigationState>;
      }
    | undefined;
}>({ navigation: undefined, route: undefined });

export default NavigationContext;
