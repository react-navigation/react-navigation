import * as React from 'react';
import {
  CommonActions,
  Route,
  NavigationState,
  InitialState,
  PartialState,
  NavigationAction,
} from '@react-navigation/routers';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import NavigationBuilderContext from './NavigationBuilderContext';
import useFocusedListeners from './useFocusedListeners';
import useDevTools from './useDevTools';
import useStateGetters from './useStateGetters';
import isSerializable from './isSerializable';

import { NavigationContainerRef, NavigationContainerProps } from './types';
import useEventEmitter from './useEventEmitter';

type State = NavigationState | PartialState<NavigationState> | undefined;

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationStateContext = React.createContext<{
  isDefault?: true;
  state?: NavigationState | PartialState<NavigationState>;
  getState: () => NavigationState | PartialState<NavigationState> | undefined;
  setState: (
    state: NavigationState | PartialState<NavigationState> | undefined
  ) => void;
  key?: string;
  performTransaction: (action: () => void) => void;
}>({
  isDefault: true,

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

let hasWarnedForSerialization = false;

/**
 * Remove `key` and `routeNames` from the state objects recursively to get partial state.
 *
 * @param state Initial state object.
 */
const getPartialState = (
  state: InitialState | undefined
): PartialState<NavigationState> | undefined => {
  if (state === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key, routeNames, ...partialState } = state;

  // @ts-ignore
  return {
    ...partialState,
    stale: true,
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
const BaseNavigationContainer = React.forwardRef(
  function BaseNavigationContainer(
    {
      initialState,
      onStateChange,
      independent,
      children,
    }: NavigationContainerProps,
    ref: React.Ref<NavigationContainerRef>
  ) {
    const parent = React.useContext(NavigationStateContext);

    if (!parent.isDefault && !independent) {
      throw new Error(
        "Looks like you have nested a 'NavigationContainer' inside another. Normally you need only one container at the root of the app, so this was probably an error. If this was intentional, pass 'independent={true}' explicitely."
      );
    }

    const [state, setNavigationState] = React.useState<State>(() =>
      getPartialState(initialState == null ? undefined : initialState)
    );

    const navigationStateRef = React.useRef<State>();
    const transactionStateRef = React.useRef<State | null>(null);
    const isTransactionActiveRef = React.useRef<boolean>(false);
    const isFirstMountRef = React.useRef<boolean>(true);
    const skipTrackingRef = React.useRef<boolean>(false);

    const performTransaction = React.useCallback((callback: () => void) => {
      if (isTransactionActiveRef.current) {
        throw new Error(
          "Only one transaction can be active at a time. Did you accidentally nest 'performTransaction'?"
        );
      }

      setNavigationState((navigationState: State) => {
        isTransactionActiveRef.current = true;
        transactionStateRef.current = navigationState;

        try {
          callback();
        } finally {
          isTransactionActiveRef.current = false;
        }

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

    const reset = React.useCallback(
      (state: NavigationState) => {
        performTransaction(() => {
          skipTrackingRef.current = true;
          setState(state);
        });
      },
      [performTransaction, setState]
    );

    const { trackState, trackAction } = useDevTools({
      name: '@react-navigation',
      reset,
      state,
    });

    const {
      listeners,
      addListener: addFocusedListener,
    } = useFocusedListeners();

    const { getStateForRoute, addStateGetter } = useStateGetters();

    const dispatch = (
      action: NavigationAction | ((state: NavigationState) => NavigationAction)
    ) => {
      listeners[0](navigation => navigation.dispatch(action));
    };

    const canGoBack = () => {
      const { result, handled } = listeners[0](navigation =>
        navigation.canGoBack()
      );

      if (handled) {
        return result;
      } else {
        return false;
      }
    };

    const resetRoot = React.useCallback(
      (state?: PartialState<NavigationState> | NavigationState) => {
        performTransaction(() => {
          trackAction('@@RESET_ROOT');
          setState(state);
        });
      },
      [performTransaction, setState, trackAction]
    );

    const getRootState = React.useCallback(() => {
      return getStateForRoute('root');
    }, [getStateForRoute]);

    const emitter = useEventEmitter();

    React.useImperativeHandle(ref, () => ({
      ...(Object.keys(CommonActions) as (keyof typeof CommonActions)[]).reduce<
        any
      >((acc, name) => {
        acc[name] = (...args: any[]) =>
          dispatch(
            CommonActions[name](
              // @ts-ignore
              ...args
            )
          );
        return acc;
      }, {}),
      ...emitter.create('root'),
      resetRoot,
      dispatch,
      canGoBack,
      getRootState,
    }));

    const builderContext = React.useMemo(
      () => ({
        addFocusedListener,
        addStateGetter,
        trackAction,
      }),
      [addFocusedListener, trackAction, addStateGetter]
    );

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
      if (process.env.NODE_ENV !== 'production') {
        if (
          state !== undefined &&
          !isSerializable(state) &&
          !hasWarnedForSerialization
        ) {
          hasWarnedForSerialization = true;

          console.warn(
            "We found non-serializable values in the navigation state, which can break usage such as persisting and restoring state. This might happen if you passed non-serializable values such as function, class instances etc. in params. If you need to use functions in your options, you can use 'navigation.setOptions' instead."
          );
        }
      }

      emitter.emit({
        type: 'state',
        data: { state },
      });

      if (skipTrackingRef.current) {
        skipTrackingRef.current = false;
      } else {
        trackState(getRootState);
      }

      navigationStateRef.current = state;
      transactionStateRef.current = null;

      if (!isFirstMountRef.current && onStateChange) {
        onStateChange(getRootState());
      }

      isFirstMountRef.current = false;
    }, [state, onStateChange, trackState, getRootState, emitter]);

    return (
      <NavigationBuilderContext.Provider value={builderContext}>
        <NavigationStateContext.Provider value={context}>
          <EnsureSingleNavigator>{children}</EnsureSingleNavigator>
        </NavigationStateContext.Provider>
      </NavigationBuilderContext.Provider>
    );
  }
);

export default BaseNavigationContainer;
