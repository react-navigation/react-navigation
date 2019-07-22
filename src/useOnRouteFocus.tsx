import * as React from 'react';
import { NavigationAction, NavigationState, Router } from './types';
import NavigationBuilderContext from './NavigationBuilderContext';

type Options<Action extends NavigationAction> = {
  router: Router<Action>;
  onAction: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  key?: string;
};

export default function useOnRouteFocus<Action extends NavigationAction>({
  router,
  onAction,
  getState,
  key: sourceNavigatorKey,
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

      if (
        onRouteFocusParent !== undefined &&
        sourceNavigatorKey !== undefined
      ) {
        onRouteFocusParent(sourceNavigatorKey);
      }
    },
    [getState, onRouteFocusParent, router, setState, sourceNavigatorKey]
  );
}
