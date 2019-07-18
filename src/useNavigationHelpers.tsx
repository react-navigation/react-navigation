import * as React from 'react';
import * as BaseActions from './BaseActions';
import NavigationBuilderContext from './NavigationBuilderContext';
import {
  NavigationHelpers,
  NavigationAction,
  NavigationState,
  ActionCreators,
} from './types';
import { NavigationStateContext } from './NavigationContainer';

type Options = {
  onAction: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  actionCreators: ActionCreators;
};

export default function useNavigationHelpers({
  onAction,
  getState,
  setState,
  actionCreators,
}: Options) {
  const { navigation: parentNavigationHelpers } = React.useContext(
    NavigationBuilderContext
  );

  const { performTransaction } = React.useContext(NavigationStateContext);

  return React.useMemo((): NavigationHelpers => {
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
      ...actionCreators,
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
    };
  }, [
    actionCreators,
    parentNavigationHelpers,
    performTransaction,
    setState,
    getState,
    onAction,
  ]);
}
