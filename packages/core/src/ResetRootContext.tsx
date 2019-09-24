import * as React from 'react';
import { NavigationState, PartialState } from './types';

/**
 * Context which holds the method to reset root navigator state.
 */
const ResetRootContext = React.createContext<
  (state: PartialState<NavigationState> | NavigationState) => void
>(() => {
  throw new Error(
    "We couldn't find a way to reset root state. Have you wrapped your app with 'NavigationContainer'?"
  );
});

export default ResetRootContext;
