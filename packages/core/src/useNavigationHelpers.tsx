import * as React from 'react';
import {
  CommonActions,
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from '@react-navigation/routers';
import NavigationContext from './NavigationContext';
import UnhandledActionContext from './UnhandledActionContext';
import type { NavigationEventEmitter } from './useEventEmitter';
import { NavigationHelpers, NavigationProp, PrivateValueStore } from './types';

// This is to make TypeScript compiler happy
// eslint-disable-next-line babel/no-unused-expressions
PrivateValueStore;

type Options<State extends NavigationState, Action extends NavigationAction> = {
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => State;
  emitter: NavigationEventEmitter<any>;
  router: Router<State, Action>;
};

/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export default function useNavigationHelpers<
  State extends NavigationState,
  ActionHelpers extends Record<string, () => void>,
  Action extends NavigationAction,
  EventMap extends Record<string, any>
>({ onAction, getState, emitter, router }: Options<State, Action>) {
  const onUnhandledAction = React.useContext(UnhandledActionContext);
  const parentNavigationHelpers = React.useContext(NavigationContext);

  return React.useMemo(() => {
    const dispatch = (op: Action | ((state: State) => Action)) => {
      const action = typeof op === 'function' ? op(getState()) : op;

      const handled = onAction(action);

      if (!handled) {
        onUnhandledAction?.(action);
      }
    };

    const actions = {
      ...router.actionCreators,
      ...CommonActions,
    };

    const helpers = Object.keys(actions).reduce<Record<string, () => void>>(
      (acc, name) => {
        // @ts-expect-error: name is a valid key, but TypeScript is dumb
        acc[name] = (...args: any) => dispatch(actions[name](...args));
        return acc;
      },
      {}
    );

    return {
      ...parentNavigationHelpers,
      ...helpers,
      dispatch,
      emit: emitter.emit,
      isFocused: parentNavigationHelpers
        ? parentNavigationHelpers.isFocused
        : () => true,
      canGoBack: () => {
        const state = getState();

        return (
          router.getStateForAction(state, CommonActions.goBack() as Action, {
            routeNames: state.routeNames,
            routeParamList: {},
            routeGetIdList: {},
          }) !== null ||
          parentNavigationHelpers?.canGoBack() ||
          false
        );
      },
      dangerouslyGetParent: () => parentNavigationHelpers as any,
      dangerouslyGetState: getState,
    } as NavigationHelpers<ParamListBase, EventMap> &
      (NavigationProp<ParamListBase, string, any, any, any> | undefined) &
      ActionHelpers;
  }, [
    emitter.emit,
    getState,
    onAction,
    onUnhandledAction,
    parentNavigationHelpers,
    router,
  ]);
}
