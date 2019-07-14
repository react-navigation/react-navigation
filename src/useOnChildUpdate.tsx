import * as React from 'react';
import { NavigationAction, NavigationState, Router } from './types';
import NavigationBuilderContext from './NavigationBuilderContext';

type Options = {
  router: Router;
  onAction: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  key?: string;
};

export default function useOnChildUpdate({
  router,
  onAction,
  getState,
  key: sourceNavigatorKey,
  setState,
}: Options) {
  const {
    onChildUpdate: parentOnChildUpdate,
    addActionListener: parentAddActionListener,
    removeActionListener: parentRemoveActionListener,
  } = React.useContext(NavigationBuilderContext);

  React.useEffect(() => {
    parentAddActionListener && parentAddActionListener(onAction);

    return () => {
      parentRemoveActionListener && parentRemoveActionListener(onAction);
    };
  }, [onAction, parentAddActionListener, parentRemoveActionListener]);

  const onChildUpdate = React.useCallback(
    (update: NavigationState, focus: boolean, key: string | undefined) => {
      const state = getState();
      const result = router.getStateForChildUpdate(state, {
        update,
        focus,
        key,
      });

      if (parentOnChildUpdate !== undefined) {
        parentOnChildUpdate(result, focus, sourceNavigatorKey);
      } else {
        setState(result);
      }
    },
    [getState, parentOnChildUpdate, sourceNavigatorKey, router, setState]
  );

  return onChildUpdate;
}
