import * as React from 'react';
import * as BaseActions from './BaseActions';
import NavigationContext from './NavigationContext';
import { NavigationStateContext } from './NavigationContainer';
import { NavigationEventEmitter } from './useEventEmitter';
import {
  NavigationHelpers,
  NavigationProp,
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from './types';

type Options<Action extends NavigationAction> = {
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  emitter: NavigationEventEmitter;
  router: Router<NavigationState, Action>;
};

/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export default function useNavigationHelpers<Action extends NavigationAction>({
  onAction,
  getState,
  setState,
  emitter,
  router,
}: Options<Action>) {
  const parentNavigationHelpers = React.useContext(NavigationContext);
  const { performTransaction } = React.useContext(NavigationStateContext);

  return React.useMemo((): NavigationHelpers<ParamListBase> &
    Partial<NavigationProp<ParamListBase, string, any, any, any>> => {
    const dispatch = (
      action: NavigationAction | ((state: NavigationState) => NavigationState)
    ) => {
      performTransaction(() => {
        if (typeof action === 'function') {
          setState(action(getState()));
        } else {
          onAction(action);
        }
      });
    };

    const actions = {
      ...router.actionCreators,
      ...BaseActions,
    };

    // @ts-ignore
    return {
      ...parentNavigationHelpers,
      ...Object.keys(actions).reduce(
        (acc, name) => {
          // @ts-ignore
          acc[name] = (...args: any) => dispatch(actions[name](...args));
          return acc;
        },
        {} as { [key: string]: () => void }
      ),
      dispatch,
      emit: emitter.emit,
      isFocused: parentNavigationHelpers
        ? parentNavigationHelpers.isFocused
        : () => true,
      canGoBack: () =>
        router.canGoBack(getState()) ||
        (parentNavigationHelpers && parentNavigationHelpers.canGoBack()) ||
        false,
    };
  }, [
    router,
    getState,
    parentNavigationHelpers,
    emitter.emit,
    performTransaction,
    setState,
    onAction,
  ]);
}
