import {
  CommonActions,
  type NavigationAction,
  type NavigationState,
  type ParamListBase,
  type Router,
} from '@react-navigation/routers';
import * as React from 'react';

import { NavigationContext } from './NavigationContext';
import { type NavigationHelpers, PrivateValueStore } from './types';
import type { NavigationEventEmitter } from './useEventEmitter';

// This is to make TypeScript compiler happy
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
PrivateValueStore;

type Options<State extends NavigationState, Action extends NavigationAction> = {
  id: string | undefined;
  onAction: (action: NavigationAction) => boolean;
  onUnhandledAction: (action: NavigationAction) => void;
  getState: () => State;
  state: State;
  emitter: NavigationEventEmitter<any>;
  router: Router<State, Action>;
};

/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export function useNavigationHelpers<
  State extends NavigationState,
  ActionHelpers extends Record<string, () => void>,
  Action extends NavigationAction,
  EventMap extends Record<string, any>,
>({
  id: navigatorId,
  onAction,
  onUnhandledAction,
  getState,
  state,
  emitter,
  router,
}: Options<State, Action>) {
  const parentNavigationHelpers = React.useContext(NavigationContext);

  // In some cases (e.g. route names change), internal state might have changed
  // But it hasn't been committed yet, so hasn't propagated to any listeners
  // During this time, we need to return the internal state in `getState`
  // Otherwise it can return an inconsistent state during render in children
  // This may affect hooks like `useNavigationState` that need to read the state during render
  // To avoid this, we use a ref for render phase, and immediately clear it on commit
  const stateRef = React.useRef<State | null>(state);

  stateRef.current = state;

  React.useInsertionEffect(() => {
    stateRef.current = null;
  });

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

    const helpers = Object.keys(actions).reduce((acc, name) => {
      // @ts-expect-error: name is a valid key, but TypeScript is dumb
      acc[name] = (...args: any) => dispatch(actions[name](...args));
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
      getId: () => navigatorId,
      getParent: (id?: string) => {
        if (id !== undefined) {
          let current = navigationHelpers;

          while (current && id !== current.getId()) {
            current = current.getParent();
          }

          return current;
        }

        return parentNavigationHelpers;
      },
      getState: (): State => {
        // FIXME: Workaround for when the state is read during render
        // Apart from subscriptions, `getState` should never be called during render
        if (stateRef.current != null) {
          return stateRef.current;
        }

        return getState();
      },
    } as NavigationHelpers<ParamListBase, EventMap> & ActionHelpers;

    return navigationHelpers;
  }, [
    router,
    parentNavigationHelpers,
    emitter.emit,
    getState,
    onAction,
    onUnhandledAction,
    navigatorId,
    stateRef,
  ]);
}
