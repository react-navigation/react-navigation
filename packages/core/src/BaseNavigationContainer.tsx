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
import NavigationStateContext from './NavigationStateContext';
import UnhandledActionContext from './UnhandledActionContext';
import { ScheduleUpdateContext } from './useScheduleUpdate';
import useFocusedListeners from './useFocusedListeners';
import useStateGetters from './useStateGetters';
import useOptionsGetters from './useOptionsGetters';
import useEventEmitter from './useEventEmitter';
import useSyncState from './useSyncState';
import isSerializable from './isSerializable';
import type {
  NavigationContainerEventMap,
  NavigationContainerRef,
  NavigationContainerProps,
} from './types';

type State = NavigationState | PartialState<NavigationState> | undefined;

const NOT_INITIALIZED_ERROR =
  "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. See https://reactnavigation.org/docs/navigating-without-navigation-prop#handling-initialization for more details.";

let hasWarnedForSerialization = false;

/**
 * Migration instructions for removal of devtools from core
 */
Object.defineProperty(
  global,
  'REACT_NAVIGATION_REDUX_DEVTOOLS_EXTENSION_INTEGRATION_ENABLED',
  {
    set(_) {
      console.warn(
        "Redux devtools extension integration can be enabled with the '@react-navigation/devtools' package. For more details, see https://reactnavigation.org/docs/devtools"
      );
    },
  }
);

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

    const navigatorKeyRef = React.useRef<string | undefined>();

    const getKey = React.useCallback(() => navigatorKeyRef.current, []);

    const setKey = React.useCallback((key: string) => {
      navigatorKeyRef.current = key;
    }, []);

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
        setState(state);
      },
      [setState]
    );

    const getRootState = React.useCallback(() => {
      return getStateForRoute('root');
    }, [getStateForRoute]);

    const getCurrentRoute = React.useCallback(() => {
      let state = getRootState();
      if (state === undefined) {
        return undefined;
      }
      while (state.routes[state.index].state !== undefined) {
        state = state.routes[state.index].state as NavigationState;
      }
      return state.routes[state.index];
    }, [getRootState]);

    const emitter = useEventEmitter<NavigationContainerEventMap>();

    const { addOptionsGetter, getCurrentOptions } = useOptionsGetters({});

    React.useImperativeHandle(ref, () => ({
      ...(Object.keys(CommonActions) as (keyof typeof CommonActions)[]).reduce<
        any
      >((acc, name) => {
        acc[name] = (...args: any[]) =>
          dispatch(
            CommonActions[name](
              // @ts-expect-error: we can't know the type statically
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
      dangerouslyGetState: () => state,
      dangerouslyGetParent: () => undefined,
      getCurrentRoute,
      getCurrentOptions,
    }));

    const onDispatchAction = React.useCallback(
      (action: NavigationAction, noop: boolean) => {
        emitter.emit({ type: '__unsafe_action__', data: { action, noop } });
      },
      [emitter]
    );

    const onOptionsChange = React.useCallback(
      (options) => {
        emitter.emit({
          type: 'options',
          data: { options },
        });
      },
      [emitter]
    );

    const builderContext = React.useMemo(
      () => ({
        addFocusedListener,
        addStateGetter,
        onDispatchAction,
        onOptionsChange,
      }),
      [addFocusedListener, addStateGetter, onDispatchAction, onOptionsChange]
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
        addOptionsGetter,
      }),
      [getKey, getState, setKey, setState, state, addOptionsGetter]
    );

    const onStateChangeRef = React.useRef(onStateChange);

    React.useEffect(() => {
      onStateChangeRef.current = onStateChange;
    });

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

      emitter.emit({ type: 'state', data: { state } });

      if (!isFirstMountRef.current && onStateChangeRef.current) {
        onStateChangeRef.current(getRootState());
      }

      isFirstMountRef.current = false;
    }, [getRootState, emitter, state]);

    const onUnhandledAction = React.useCallback((action: NavigationAction) => {
      if (process.env.NODE_ENV === 'production') {
        return;
      }

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
    }, []);

    return (
      <ScheduleUpdateContext.Provider value={scheduleContext}>
        <NavigationBuilderContext.Provider value={builderContext}>
          <NavigationStateContext.Provider value={context}>
            <UnhandledActionContext.Provider value={onUnhandledAction}>
              <EnsureSingleNavigator>{children}</EnsureSingleNavigator>
            </UnhandledActionContext.Provider>
          </NavigationStateContext.Provider>
        </NavigationBuilderContext.Provider>
      </ScheduleUpdateContext.Provider>
    );
  }
);

export default BaseNavigationContainer;
