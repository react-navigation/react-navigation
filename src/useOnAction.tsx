import * as React from 'react';
import NavigationBuilderContext from './NavigationBuilderContext';
import { NavigationAction, NavigationState } from './types';

type Options = {
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  getStateForAction: (
    state: NavigationState,
    action: NavigationAction
  ) => NavigationState | null;
};

export default function useOnAction({
  getState,
  setState,
  getStateForAction,
}: Options) {
  const { onAction: handleActionParent } = React.useContext(
    NavigationBuilderContext
  );

  return React.useCallback(
    (action: NavigationAction) => {
      const state = getState();
      const result = getStateForAction(state, action);

      if (result !== null) {
        if (state !== result) {
          setState(result);
        }

        return true;
      }

      if (handleActionParent !== undefined) {
        // Bubble action to the parent if the current navigator didn't handle it
        if (handleActionParent(action)) {
          return true;
        }
      }

      return false;
    },
    [getState, handleActionParent, getStateForAction, setState]
  );
}
