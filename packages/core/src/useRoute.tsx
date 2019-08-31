import * as React from 'react';
import NavigationContext from './NavigationContext';
import { ParamListBase, RouteProp } from './types';

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
export default function useRoute<
  T extends RouteProp<ParamListBase, string>
>(): T {
  const { route } = React.useContext(NavigationContext);

  if (route === undefined) {
    throw new Error(
      "We couldn't find a route object. Is your component inside a navigator?"
    );
  }

  return route as T;
}
