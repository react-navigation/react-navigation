import * as React from 'react';

import { NavigationFocusedRouteStateContext } from './NavigationFocusedRouteStateContext';

export function useStateForPath() {
  const state = React.useContext(NavigationFocusedRouteStateContext);

  return state;
}
