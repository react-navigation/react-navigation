import * as React from 'react';

import type { getPathFromState } from './getPathFromState';
import type { getStateFromPath } from './getStateFromPath';
import type { FocusedRouteState } from './NavigationFocusedRouteStateContext';

export type ServerStateRecord = {
  focusedState?: FocusedRouteState | undefined;
  linking?:
    | {
        config?: Parameters<typeof getStateFromPath>[1];
        getStateFromPath: typeof getStateFromPath;
        getPathFromState: typeof getPathFromState;
      }
    | undefined;
};

/**
 * Context which holds a mutable record for the current navigation tree.
 * Values are written during render and the last completed write wins.
 * The context is only provided on the server by `ServerContainer`.
 */
export const ServerStateContext = React.createContext<
  ServerStateRecord | undefined
>(undefined);
