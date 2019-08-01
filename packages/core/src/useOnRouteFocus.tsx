import * as React from 'react';
import NavigationBuilderContext from './NavigationBuilderContext';
import { NavigationAction, NavigationState, Router } from './types';

type Options<Action extends NavigationAction> = {
  router: Router<NavigationState, Action>;
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  key?: string;
};

export default function useOnRouteFocus<Action extends NavigationAction>({
  router,
  onAction,
  getState,
  key: sourceRouteKey,
  setState,
}: Options<Action>) {
  const {
    onRouteFocus: onRouteFocusParent,
    addActionListener: addActionListenerParent,
    removeActionListener: removeActionListenerParent,
  } = React.useContext(NavigationBuilderContext);

  React.useEffect(() => {
    addActionListenerParent && addActionListenerParent(onAction);

    return () => {
      removeActionListenerParent && removeActionListenerParent(onAction);
    };
  }, [addActionListenerParent, onAction, removeActionListenerParent]);

  return React.useCallback(
    (key: string) => {
      const state = getState();
      const result = router.getStateForRouteFocus(state, key);

      if (result !== state) {
        setState(result);
      }

      if (onRouteFocusParent !== undefined && sourceRouteKey !== undefined) {
        onRouteFocusParent(sourceRouteKey);
      }
    },
    [getState, onRouteFocusParent, router, setState, sourceRouteKey]
  );
}
