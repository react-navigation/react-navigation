import * as React from 'react';
import * as BaseActions from './BaseActions';
import NavigationContext from './NavigationContext';
import { NavigationStateContext } from './NavigationContainer';
import {
  NavigationHelpers,
  NavigationAction,
  NavigationState,
  ActionCreators,
  ParamListBase,
} from './types';

type Options<Action extends NavigationAction> = {
  onAction: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  actionCreators?: ActionCreators<Action>;
};

export default function useNavigationHelpers<Action extends NavigationAction>({
  onAction,
  getState,
  setState,
  actionCreators,
}: Options<Action>) {
  const parentNavigationHelpers = React.useContext(NavigationContext);
  const { performTransaction } = React.useContext(NavigationStateContext);

  return React.useMemo((): NavigationHelpers<ParamListBase> => {
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
