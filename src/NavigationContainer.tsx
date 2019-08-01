import * as React from 'react';
import * as BaseActions from './BaseActions';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import NavigationBuilderContext from './NavigationBuilderContext';
import useChildActionListeners from './useChildActionListeners';
import {
  Route,
  NavigationState,
  InitialState,
  PartialState,
  ParamListBase,
  NavigationHelpers,
  NavigationAction,
} from './types';

type Props = {
  initialState?: InitialState;
  onStateChange?: (
    state: NavigationState | PartialState<NavigationState> | undefined
  ) => void;
  children: React.ReactNode;
};

type State = NavigationState | PartialState<NavigationState> | undefined;

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationStateContext = React.createContext<{
  state?: NavigationState | PartialState<NavigationState>;
  getState: () => NavigationState | PartialState<NavigationState> | undefined;
  setState: (state: NavigationState | undefined) => void;
  key?: string;
  performTransaction: (action: () => void) => void;
}>({
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get performTransaction(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

const getPartialState = (
  state: InitialState | undefined
): PartialState<NavigationState> | undefined => {
  if (state === undefined) {
    return;
  }

  // @ts-ignore
  return {
    ...state,
    stale: true,
    key: undefined,
    routeNames: undefined,
    routes: state.routes.map(route => {
      if (route.state === undefined) {
        return route as Route<string> & {
          state?: PartialState<NavigationState>;
        };
      }

      return { ...route, state: getPartialState(route.state) };
    }),
  };
};

/**
 * Container component which holds the navigation state.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
const Container = React.forwardRef(function NavigationContainer(
  { initialState, onStateChange, children }: Props,
  ref: React.Ref<NavigationHelpers<ParamListBase>>
) {
  const [state, setNavigationState] = React.useState<State>(() =>
    getPartialState(initialState)
  );

  const dispatch = (action: NavigationAction) =>
    context.performTransaction(() => {
      for (let i = 0; i < actionListeners.length; i++) {
        actionListeners[i](action, undefined, null);
      }
    });

  React.useImperativeHandle(ref, () => ({
    dispatch,
    ...(Object.keys(BaseActions) as Array<keyof typeof BaseActions>).reduce<
      any
    >((acc, name) => {
      acc[name] = (...args: any[]) =>
        dispatch(
          // eslint-disable-next-line import/namespace
          BaseActions[name](
            // @ts-ignore
            ...args
          )
        );
      return acc;
    }, {}),
  }));

  const navigationStateRef = React.useRef<State>();
  const transactionStateRef = React.useRef<State | null>(null);
  const isTransactionActiveRef = React.useRef<boolean>(false);
  const isFirstMountRef = React.useRef<boolean>(true);

  const {
    listeners: actionListeners,
    addActionListener,
    removeActionListener,
  } = useChildActionListeners();

  const navigationContext = React.useMemo(
    () => ({
      addActionListener,
      removeActionListener,
    }),
    [addActionListener, removeActionListener]
  );

  const performTransaction = React.useCallback((callback: () => void) => {
    if (isTransactionActiveRef.current) {
      throw new Error(
        "Only one transaction can be active at a time. Did you accidentally nest 'performTransaction'?"
      );
    }

    setNavigationState((navigationState: State) => {
      isTransactionActiveRef.current = true;
      transactionStateRef.current = navigationState;

      callback();

      isTransactionActiveRef.current = false;

      return transactionStateRef.current;
    });
  }, []);

  const getState = React.useCallback(
    () =>
      transactionStateRef.current !== null
        ? transactionStateRef.current
        : navigationStateRef.current,
    []
  );

  const setState = React.useCallback((navigationState: State) => {
    if (transactionStateRef.current === null) {
      throw new Error(
        "Any 'setState' calls need to be done inside 'performTransaction'"
      );
    }

    transactionStateRef.current = navigationState;
  }, []);

  const context = React.useMemo(
    () => ({
      state,
      performTransaction,
      getState,
      setState,
    }),
    [getState, performTransaction, setState, state]
  );

  React.useEffect(() => {
    navigationStateRef.current = state;
    transactionStateRef.current = null;

    if (!isFirstMountRef.current && onStateChange) {
      onStateChange(state);
    }

    isFirstMountRef.current = false;
  }, [state, onStateChange]);

  return (
    <NavigationStateContext.Provider value={context}>
      <NavigationBuilderContext.Provider value={navigationContext}>
        <EnsureSingleNavigator>{children}</EnsureSingleNavigator>
      </NavigationBuilderContext.Provider>
    </NavigationStateContext.Provider>
  );
});

export default Container;
