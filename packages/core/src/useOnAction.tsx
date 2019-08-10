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

/**
 * Hook to handle actions for a navigator, including state updates and bubbling.
 *
 * Bubbling an action is achieved in 2 ways:
 * 1. To bubble action to parent, we expose the action handler in context and then access the parent context
 * 2. To bubble action to child, child adds event listeners subscribing to actions from parent
 *
 * When the action handler handles as action, it returns `true`, otherwise `false`.
 */
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
    addActionListener: addActionListenerParent,
    removeActionListener: removeActionListenerParent,
  } = React.useContext(NavigationBuilderContext);

  const { key: routeKey } = React.useContext(NavigationStateContext);

  const onAction = React.useCallback(
    (
      action: NavigationAction,
      visitedNavigators: Set<string> = new Set<string>(),
      targetForInternalDispatching?: string | null
    ) => {
      const state = getState();

      // Since actions can bubble both up and down, they could come to the same navigator again
      // We keep track of navigators which have already tried to handle the action and return if it's already visited
      if (visitedNavigators.has(state.key)) {
        return false;
      }

      visitedNavigators.add(state.key);

      if (targetForInternalDispatching !== undefined) {
        // The action was dispatched to be handled by the currently focused navigator in the tree
        // First, we need to check if there is a child navigator in the focused route which can handle it
        // So we re-dispatch the action to child navigators with the target set to focused route key
        const focusedKey = state.routes[state.index].key;

        for (let i = listeners.length - 1; i >= 0; i--) {
          const listener = listeners[i];

          if (listener(action, visitedNavigators, focusedKey)) {
            return true;
          }
        }

        // If the action wasn't handled, there was no child navigator in the focused route
        // This means this navigator should handle the action itself
        if (
          targetForInternalDispatching === null ||
          targetForInternalDispatching === routeKey
        ) {
          onAction(action);
          return true;
        }

        return false;
      } else {
        if (typeof action.target === 'string' && action.target !== state.key) {
          return false;
        }

        let result = router.getStateForAction(state, action);

        // If a target is specified and set to current navigator, the action shouldn't bubble
        // So instead of `null`, we use the state object for such cases to signal that action was handled
        result =
          result === null && action.target === state.key ? state : result;

        if (result !== null) {
          if (state !== result) {
            setState(result);
          }

          if (onRouteFocusParent !== undefined) {
            // Some actions such as `NAVIGATE` also want to bring the navigated route to focus in the whole tree
            // This means we need to focus all of the parent navigators of this navigator as well
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

        // If the action wasn't handled by current navigator or a parent navigator, let children handle it
        for (let i = listeners.length - 1; i >= 0; i--) {
          const listener = listeners[i];

          if (listener(action, visitedNavigators)) {
            return true;
          }
        }
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

  React.useEffect(() => {
    addActionListenerParent && addActionListenerParent(onAction);

    return () => {
      removeActionListenerParent && removeActionListenerParent(onAction);
    };
  }, [addActionListenerParent, onAction, removeActionListenerParent]);

  return onAction;
}
