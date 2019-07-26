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
      sourceNavigatorKey?: string,
      targetForInternalDispatching?: string | null
    ) => {
      const state = getState();

      if (sourceNavigatorKey === state.key) {
        return false;
      }

      if (targetForInternalDispatching === undefined) {
        const result = router.getStateForAction(state, action);

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
          if (onActionParent(action, state.key)) {
            return true;
          }
        }

        if (router.shouldActionPropagateToChildren(action)) {
          for (let i = listeners.length - 1; i >= 0; i--) {
            const listener = listeners[i];

            if (listener(action, state.key)) {
              return true;
            }
          }
        }
      } else {
        for (let i = listeners.length - 1; i >= 0; i--) {
          const listener = listeners[i];

          if (listener(action, state.key, state.routes[state.index].key)) {
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
