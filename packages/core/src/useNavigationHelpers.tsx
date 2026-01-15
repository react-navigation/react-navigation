import {
  CommonActions,
  type NavigationAction,
  type NavigationState,
  type ParamListBase,
  type Router,
} from '@react-navigation/routers';
import * as React from 'react';

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
  stateRef: React.RefObject<State | null>;
  meta: object;
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
  stateRef,
  meta,
}: Options<State, Action>) {
  const [initialMeta] = React.useState(meta);

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
      getState: (): State => {
        // FIXME: Workaround for when the state is read during render
        // By this time, we haven't committed the new state yet
        // Without this `useSyncExternalStore` will keep reading the old state
        // This may result in `useNavigationState` or `useIsFocused` returning wrong values
        // Apart from `useSyncExternalStore`, `getState` should never be called during render
        if (stateRef.current != null) {
          return stateRef.current;
        }

        return getState();
      },
      '~meta': initialMeta,
    } as NavigationHelpers<ParamListBase, EventMap> & ActionHelpers;

    return navigationHelpers;
  }, [
    router,
    parentNavigationHelpers,
    emitter.emit,
    initialMeta,
    getState,
    onAction,
    onUnhandledAction,
    stateRef,
  ]);
}
