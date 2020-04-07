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
import { ScheduleUpdateContext } from './useScheduleUpdate';
import useFocusedListeners from './useFocusedListeners';
import useDevTools from './useDevTools';
import useStateGetters from './useStateGetters';
import useEventEmitter from './useEventEmitter';
import useSyncState from './useSyncState';
import isSerializable from './isSerializable';

import { NavigationContainerRef, NavigationContainerProps } from './types';

type State = NavigationState | PartialState<NavigationState> | undefined;

const MISSING_CONTEXT_ERROR =
  "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'? See https://reactnavigation.org/docs/getting-started for setup instructions.";

const NOT_INITIALIZED_ERROR =
  "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. See https://reactnavigation.org/docs/navigating-without-navigation-prop#handling-initialization for more details.";

export const NavigationStateContext = React.createContext<{
  isDefault?: true;
  state?: NavigationState | PartialState<NavigationState>;
  getKey: () => string | undefined;
  setKey: (key: string) => void;
  getState: () => NavigationState | PartialState<NavigationState> | undefined;
  setState: (
    state: NavigationState | PartialState<NavigationState> | undefined
  ) => void;
}>({
  isDefault: true,

  get getKey(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setKey(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
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
    routes: state.routes.map((route) => {
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
    ref?: React.Ref<NavigationContainerRef>
  ) {
    const parent = React.useContext(NavigationStateContext);

    if (!parent.isDefault && !independent) {
      throw new Error(
        "Looks like you have nested a 'NavigationContainer' inside another. Normally you need only one container at the root of the app, so this was probably an error. If this was intentional, pass 'independent={true}' explicitely. Note that this will make the child navigators disconnected from the parent and you won't be able to navigate between them."
      );
    }

    const [
      state,
      getState,
      setState,
      scheduleUpdate,
      flushUpdates,
    ] = useSyncState<State>(() =>
      getPartialState(initialState == null ? undefined : initialState)
    );

    const isFirstMountRef = React.useRef<boolean>(true);
    const skipTrackingRef = React.useRef<boolean>(false);

    const navigatorKeyRef = React.useRef<string | undefined>();

    const getKey = React.useCallback(() => navigatorKeyRef.current, []);

    const setKey = React.useCallback((key: string) => {
      navigatorKeyRef.current = key;
    }, []);

    const reset = React.useCallback(
      (state: NavigationState) => {
        skipTrackingRef.current = true;
        setState(state);
      },
      [setState]
    );

    const { trackState, trackAction } = useDevTools({
      enabled: false,
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
      if (listeners[0] == null) {
        throw new Error(NOT_INITIALIZED_ERROR);
      }

      listeners[0]((navigation) => navigation.dispatch(action));
    };

    const canGoBack = () => {
      if (listeners[0] == null) {
        return false;
      }

      const { result, handled } = listeners[0]((navigation) =>
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
        trackAction('@@RESET_ROOT');
        setState(state);
      },
      [setState, trackAction]
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

    const scheduleContext = React.useMemo(
      () => ({ scheduleUpdate, flushUpdates }),
      [scheduleUpdate, flushUpdates]
    );

    const context = React.useMemo(
      () => ({
        state,
        getState,
        setState,
        getKey,
        setKey,
      }),
      [getKey, getState, setKey, setState, state]
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
            "Non-serializable values were found in the navigation state, which can break usage such as persisting and restoring state. This might happen if you passed non-serializable values such as function, class instances etc. in params. If you need to use components with callbacks in your options, you can use 'navigation.setOptions' instead. See https://reactnavigation.org/docs/troubleshooting#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state for more details."
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

      if (!isFirstMountRef.current && onStateChange) {
        onStateChange(getRootState());
      }

      isFirstMountRef.current = false;
    }, [onStateChange, trackState, getRootState, emitter, state]);

    return (
      <ScheduleUpdateContext.Provider value={scheduleContext}>
        <NavigationBuilderContext.Provider value={builderContext}>
          <NavigationStateContext.Provider value={context}>
            <EnsureSingleNavigator>{children}</EnsureSingleNavigator>
          </NavigationStateContext.Provider>
        </NavigationBuilderContext.Provider>
      </ScheduleUpdateContext.Provider>
    );
  }
);

export default BaseNavigationContainer;
