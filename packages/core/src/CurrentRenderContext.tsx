import type { NavigationState, PartialState } from '@react-navigation/routers';
import * as React from 'react';

export type CurrentRender = {
  state?: NavigationState | PartialState<NavigationState> | undefined;
};

/**
 * Context which holds the state of the deepest focused navigator rendered so far.
 * Intended for use in SSR. This is not safe to use on the client.
 */
export const CurrentRenderContext = React.createContext<
  CurrentRender | undefined
>(undefined);
