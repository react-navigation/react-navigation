import * as React from 'react';
import NavigationBuilderContext, {
  ChildActionListener,
} from './NavigationBuilderContext';
import { NavigationStateContext } from './NavigationContainer';
import { NavigationAction, NavigationState, Router } from './types';

type Options = {
  router: Router<NavigationState, NavigationAction>;
  key?: string;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  listeners: ChildActionListener[];
};

export default function useOnAction({
  router,
  getState,
  setState,
  key,
  listeners,
}: Options) {
  const {
    onAction: onActionParent,
    onRouteFocus: onRouteFocusParent,
  } = React.useContext(NavigationBuilderContext);

  const { key: routeKey } = React.useContext(NavigationStateContext);

  const onAction = React.useCallback(
    (
      action: NavigationAction,
      visitedNavigators: Set<string> = new Set<string>(),
      targetForInternalDispatching?: string | null
    ) => {
      const state = getState();

      if (visitedNavigators.has(state.key)) {
        return false;
      }

      visitedNavigators.add(state.key);

      if (targetForInternalDispatching === undefined) {
        let result = router.getStateForAction(state, action);

        // If a target is specified and set to current navigator, the action shouldn't bubble
        result =
          result === null && action.target === state.key ? state : result;

        if (result !== null) {
          if (state !== result) {
            setState(result);
          }

          if (onRouteFocusParent !== undefined) {
            const shouldFocus = router.shouldActionChangeFocus(action);

            if (shouldFocus && key !== undefined) {
              onRouteFocusParent(key);
            }
          }

          return true;
        }

        if (onActionParent !== undefined) {
          // Bubble action to the parent if the current navigator didn't handle it
          if (onActionParent(action, visitedNavigators)) {
            return true;
          }
        }

        for (let i = listeners.length - 1; i >= 0; i--) {
          const listener = listeners[i];

          if (listener(action, visitedNavigators)) {
            return true;
          }
        }
      } else {
        const focusedKey = state.routes[state.index].key;

        for (let i = listeners.length - 1; i >= 0; i--) {
          const listener = listeners[i];

          if (listener(action, visitedNavigators, focusedKey)) {
            return true;
          }
        }

        if (
          targetForInternalDispatching === null ||
          targetForInternalDispatching === routeKey
        ) {
          onAction(action);
          return true;
        }

        return false;
      }

      return false;
    },
    [
      getState,
      router,
      onActionParent,
      onRouteFocusParent,
      setState,
      key,
      listeners,
      routeKey,
    ]
  );
  return onAction;
}
