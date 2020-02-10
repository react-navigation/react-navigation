import * as React from 'react';
import {
  NavigationAction,
  NavigationState,
  PartialState,
  Router,
  RouterConfigOptions,
} from '@react-navigation/routers';
import NavigationBuilderContext, {
  ChildActionListener,
} from './NavigationBuilderContext';

type Options = {
  router: Router<NavigationState, NavigationAction>;
  key?: string;
  getState: () => NavigationState;
  setState: (state: NavigationState | PartialState<NavigationState>) => void;
  listeners: ChildActionListener[];
  routerConfigOptions: RouterConfigOptions;
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
  routerConfigOptions,
}: Options) {
  const {
    onAction: onActionParent,
    onRouteFocus: onRouteFocusParent,
    addActionListener: addActionListenerParent,
    trackAction,
  } = React.useContext(NavigationBuilderContext);

  const routerConfigOptionsRef = React.useRef<RouterConfigOptions>(
    routerConfigOptions
  );

  React.useEffect(() => {
    routerConfigOptionsRef.current = routerConfigOptions;
  });

  const onAction = React.useCallback(
    (
      action: NavigationAction,
      visitedNavigators: Set<string> = new Set<string>()
    ) => {
      const state = getState();

      // Since actions can bubble both up and down, they could come to the same navigator again
      // We keep track of navigators which have already tried to handle the action and return if it's already visited
      if (visitedNavigators.has(state.key)) {
        return false;
      }

      visitedNavigators.add(state.key);

      if (typeof action.target === 'string' && action.target !== state.key) {
        return false;
      }

      let result = router.getStateForAction(
        state,
        action,
        routerConfigOptionsRef.current
      );

      // If a target is specified and set to current navigator, the action shouldn't bubble
      // So instead of `null`, we use the state object for such cases to signal that action was handled
      result = result === null && action.target === state.key ? state : result;

      if (result !== null) {
        trackAction(action);

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

      return false;
    },
    [
      getState,
      router,
      onActionParent,
      trackAction,
      onRouteFocusParent,
      setState,
      key,
      listeners,
    ]
  );

  React.useEffect(() => addActionListenerParent?.(onAction), [
    addActionListenerParent,
    onAction,
  ]);

  return onAction;
}
