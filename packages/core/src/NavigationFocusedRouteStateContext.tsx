import * as React from 'react';

export type FocusedRouteState = {
  routes: [
    {
      key?: string | undefined;
      name: string;
      params?: object | undefined;
      path?: string | undefined;
      state?: FocusedRouteState | undefined;
    },
  ];
};

/**
 * Context for the parent route of a navigator.
 */
export const NavigationFocusedRouteStateContext = React.createContext<
  FocusedRouteState | undefined
>(undefined);
