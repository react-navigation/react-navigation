import * as React from 'react';
import * as CommonActions from './CommonActions';
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
  PrivateValueStore,
} from './types';

// This is to make TypeScript compiler happy
// eslint-disable-next-line babel/no-unused-expressions
PrivateValueStore;

type Options<State extends NavigationState, Action extends NavigationAction> = {
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => State;
  emitter: NavigationEventEmitter;
  router: Router<State, Action>;
};

/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export default function useNavigationHelpers<
  State extends NavigationState,
  Action extends NavigationAction,
  EventMap extends { [key: string]: any }
>({ onAction, getState, emitter, router }: Options<State, Action>) {
  const parentNavigationHelpers = React.useContext(NavigationContext);
  const { performTransaction } = React.useContext(NavigationStateContext);

  return React.useMemo(() => {
    const dispatch = (action: Action | ((state: State) => Action)) =>
      performTransaction(() => {
        const payload =
          typeof action === 'function' ? action(getState()) : action;

        onAction(payload);
      });

    const actions = {
      ...router.actionCreators,
      ...CommonActions,
    };

    const helpers = Object.keys(actions).reduce(
      (acc, name) => {
        // @ts-ignore
        acc[name] = (...args: any) => dispatch(actions[name](...args));
        return acc;
      },
      {} as { [key: string]: () => void }
    );

    return {
      ...parentNavigationHelpers,
      ...helpers,
      dispatch,
      emit: emitter.emit,
      isFocused: parentNavigationHelpers
        ? parentNavigationHelpers.isFocused
        : () => true,
      canGoBack: () =>
        router.getStateForAction(
          getState(),
          CommonActions.goBack() as Action
        ) !== null ||
        (parentNavigationHelpers && parentNavigationHelpers.canGoBack()) ||
        false,
    } as NavigationHelpers<ParamListBase, EventMap> &
      (NavigationProp<ParamListBase, string, any, any, any> | undefined);
  }, [
    router,
    getState,
    parentNavigationHelpers,
    emitter.emit,
    performTransaction,
    onAction,
  ]);
}
