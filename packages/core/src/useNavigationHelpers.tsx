import * as React from 'react';
import {
  CommonActions,
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from '@react-navigation/routers';
import NavigationContext from './NavigationContext';
import { NavigationEventEmitter } from './useEventEmitter';
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
  EventMap extends Record<string, any>
>({ onAction, getState, emitter, router }: Options<State, Action>) {
  const parentNavigationHelpers = React.useContext(NavigationContext);

  return React.useMemo(() => {
    const dispatch = (op: Action | ((state: State) => Action)) => {
      const action = typeof op === 'function' ? op(getState()) : op;

      const handled = onAction(action);

      if (!handled && process.env.NODE_ENV !== 'production') {
        const payload: Record<string, any> | undefined = action.payload;

        let message = `The action '${action.type}'${
          payload ? ` with payload ${JSON.stringify(action.payload)}` : ''
        } was not handled by any navigator.`;

        switch (action.type) {
          case 'NAVIGATE':
          case 'PUSH':
          case 'REPLACE':
          case 'JUMP_TO':
            if (payload?.name) {
              message += `\n\nDo you have a screen named '${payload.name}'?\n\nIf you're trying to navigate to a screen in a nested navigator, see https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator.`;
            } else {
              message += `\n\nYou need to pass the name of the screen to navigate to.\n\nSee https://reactnavigation.org/docs/navigation-actions for usage.`;
            }

            break;
          case 'GO_BACK':
          case 'POP':
          case 'POP_TO_TOP':
            message += `\n\nIs there any screen to go back to?`;
            break;
          case 'OPEN_DRAWER':
          case 'CLOSE_DRAWER':
          case 'TOGGLE_DRAWER':
            message += `\n\nIs your screen inside a Drawer navigator?`;
            break;
        }

        message += `\n\nThis is a development-only warning and won't be shown in production.`;

        console.error(message);
      }
    };

    const actions = {
      ...router.actionCreators,
      ...CommonActions,
    };

    const helpers = Object.keys(actions).reduce<Record<string, () => void>>(
      (acc, name) => {
        // @ts-ignore
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
          }) !== null ||
          parentNavigationHelpers?.canGoBack() ||
          false
        );
      },
    } as NavigationHelpers<ParamListBase, EventMap> &
      (NavigationProp<ParamListBase, string, any, any, any> | undefined);
  }, [router, getState, parentNavigationHelpers, emitter.emit, onAction]);
}
