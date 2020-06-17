import * as React from 'react';
import type {
  NavigationAction,
  NavigationState,
  Router,
} from '@react-navigation/routers';
import NavigationBuilderContext from './NavigationBuilderContext';

type Options<Action extends NavigationAction> = {
  router: Router<NavigationState, Action>;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  key?: string;
};

/**
 * Hook to handle focus actions for a route.
 * Focus action needs to be treated specially, coz when a nested route is focused,
 * the parent navigators also needs to be focused.
 */
export default function useOnRouteFocus<Action extends NavigationAction>({
  router,
  getState,
  key: sourceRouteKey,
  setState,
}: Options<Action>) {
  const { onRouteFocus: onRouteFocusParent } = React.useContext(
    NavigationBuilderContext
  );

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
