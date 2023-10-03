import type {
  NavigationState,
  PartialState,
} from '@react-navigation/core';
import * as React from 'react';

const MISSING_CONTEXT_ERROR = "Couldn't find a SetNextStateContext context.";

export const SetNextStateContext = React.createContext<{
  stateForNextRouteNamesChange: [string, PartialState<NavigationState>] | null;
  setStateForNextRouteNamesChange: (
    state: [string, PartialState<NavigationState>] | null
  ) => void;
}>({
  get stateForNextRouteNamesChange(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setStateForNextRouteNamesChange(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

SetNextStateContext.displayName = 'SetNextStateContext';
