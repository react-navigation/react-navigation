import * as React from 'react';
import NavigationBuilderContext, {
  ChildActionListener,
} from './NavigationBuilderContext';
import { NavigationAction, NavigationState, Router } from './types';

type Options = {
  router: Router;
  getState: () => NavigationState;
  key?: string;
  setState: (state: NavigationState) => void;
  getStateForAction: (
    state: NavigationState,
    action: NavigationAction
  ) => NavigationState | null;
  actionListeners: ChildActionListener[];
};

export default function useOnAction({
  router,
  getState,
  setState,
  key,
  getStateForAction,
  actionListeners,
}: Options) {
  const {
    onAction: handleActionParent,
    onChildUpdate: handleChildUpdateParent,
  } = React.useContext(NavigationBuilderContext);

  return React.useCallback(
    (action: NavigationAction, sourceNavigatorKey?: string) => {
      const state = getState();

      if (sourceNavigatorKey === state.key) {
        return false;
      }

      const result = getStateForAction(state, action);

      if (result !== null) {
        if (handleChildUpdateParent) {
          const shouldFocus = router.shouldActionChangeFocus(action);

          handleChildUpdateParent(result, shouldFocus, key);
        } else if (state !== result) {
          setState(result);
        }

        return true;
      }

      if (handleActionParent !== undefined) {
        // Bubble action to the parent if the current navigator didn't handle it
        if (handleActionParent(action, state.key)) {
          return true;
        }
      }

      if (router.shouldActionPropagateToChildren(action)) {
        for (let i = actionListeners.length - 1; i >= 0; i--) {
          const listener = actionListeners[i];

          if (listener(action, state.key)) {
            return true;
          }
        }
      }

      return false;
    },
    [
      getState,
      getStateForAction,
      handleActionParent,
      router,
      handleChildUpdateParent,
      key,
      setState,
      actionListeners,
    ]
  );
}
