import {
  CommonActions,
  type NavigationAction,
  type NavigationState,
  type ParamListBase,
  type Router,
} from '@react-navigation/routers';
import * as React from 'react';

import { NavigationBuilderContext } from './NavigationBuilderContext';
import { NavigationContext } from './NavigationProvider';
import { type NavigationHelpers, PrivateValueStore } from './types';
import type { NavigationEventEmitter } from './useEventEmitter';

// This is to make TypeScript compiler happy
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
PrivateValueStore;

type Options<State extends NavigationState, Action extends NavigationAction> = {
  onAction: (action: NavigationAction) => boolean;
  onUnhandledAction: (action: NavigationAction) => void;
  getState: () => State;
  emitter: NavigationEventEmitter<any>;
  router: Router<State, Action>;
};

/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export function useNavigationHelpers<
  State extends NavigationState,
  ActionHelpers extends Record<string, (...args: any) => void>,
  Action extends NavigationAction,
  EventMap extends Record<string, any>,
>({
  onAction,
  onUnhandledAction,
  getState,
  emitter,
  router,
}: Options<State, Action>) {
  const parentNavigationHelpers = React.use(NavigationContext);
  const { withStackTrace } = React.use(NavigationBuilderContext);

  return React.useMemo(() => {
    const dispatch = (op: Action | ((state: State) => Action)) => {
      withStackTrace(dispatch, () => {
        const action = typeof op === 'function' ? op(getState()) : op;

        const handled = onAction(action);

        if (!handled) {
          onUnhandledAction?.(action);
        }
      });
    };

    const actions = {
      ...router.actionCreators,
      ...CommonActions,
    };

    const helpers = Object.keys(actions).reduce((acc, name) => {
      const helper = (...args: any) =>
        withStackTrace(helper, () =>
          // @ts-expect-error: name is a valid key, but TypeScript is dumb
          dispatch(actions[name](...args))
        );

      // @ts-expect-error: name is a valid key, but TypeScript is dumb
      acc[name] = helper;

      return acc;
    }, {} as ActionHelpers);

    const navigationHelpers = {
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
      getState,
    } as NavigationHelpers<ParamListBase, EventMap> & ActionHelpers;

    return navigationHelpers;
  }, [
    router,
    parentNavigationHelpers,
    emitter.emit,
    getState,
    onAction,
    onUnhandledAction,
    withStackTrace,
  ]);
}
