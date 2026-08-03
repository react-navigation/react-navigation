import {
  CommonActions,
  type InitialState,
  type NavigationAction,
  type NavigationState,
  type ParamListBase,
  type PartialState,
  type Route,
} from '@react-navigation/routers';
import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import { checkDuplicateRouteNames } from './checkDuplicateRouteNames';
import { checkSerializable } from './checkSerializable';
import { ConsumedParamsContext } from './ConsumedParamsContext';
import { NOT_INITIALIZED_ERROR } from './createNavigationContainerRef';
import { EnsureSingleNavigator } from './EnsureSingleNavigator';
import { findFocusedRoute } from './findFocusedRoute';
import {
  NavigationBuilderContext,
  type WithStackTrace,
} from './NavigationBuilderContext';
import { NavigationContainerRefContext } from './NavigationContainerRefContext';
import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
import { NavigationRootContext } from './NavigationRootContext';
import { NavigationStateContext } from './NavigationStateContext';
import { ThemeProvider } from './theming/ThemeProvider';
import type {
  EventListenerCallback,
  GenericNavigation,
  NavigationContainerEventMap,
  NavigationContainerProps,
  NavigationContainerRef,
  RootParamList,
} from './types';
import { UnhandledActionContext } from './UnhandledActionContext';
import { useChildListeners } from './useChildListeners';
import { useEventEmitter } from './useEventEmitter';
import { useKeyedChildListeners } from './useKeyedChildListeners';
import { useLazyValue } from './useLazyValue';
import { useNavigationIndependentTree } from './useNavigationIndependentTree';
import { useOptionsGetters } from './useOptionsGetters';
import { useSyncState } from './useSyncState';

type State = NavigationState | PartialState<NavigationState> | undefined;

const serializableWarnings: string[] = [];
const duplicateNameWarnings: string[] = [];

type Props<ParamList extends {}> = NavigationContainerProps & {
  ref?: React.Ref<NavigationContainerRef<ParamList>>;
};

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
 * @param props.onReady Callback which is called after the navigation tree mounts.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.onUnhandledAction Callback which is called when an action is not handled.
 * @param props.theme Theme object for the UI elements.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
export function BaseNavigationContainer<ParamList extends {} = RootParamList>({
  initialState,
  onStateChange,
  onReady,
  onUnhandledAction,
  theme,
  children,
  ref,
}: Props<ParamList>) {
  const parent = React.use(NavigationStateContext);
  const independent = useNavigationIndependentTree();

  if (!parent.isDefault && !independent) {
    throw new Error(
      "Looks like you have nested a 'NavigationContainer' inside another. Normally you need only one container at the root of the app, so this was probably an error. If this was intentional, wrap the container in 'NavigationIndependentTree' explicitly. Note that this will make the child navigators disconnected from the parent and you won't be able to navigate between them."
    );
  }

  const { state, getState, setState, subscribe, scheduleUpdate, flushUpdates } =
    useSyncState<State>(() =>
      getPartialState(initialState == null ? undefined : initialState)
    );

  const consumedParams = useLazyValue(() => new WeakMap<object, true>());

  const isFirstMountRef = React.useRef<boolean>(true);

  const navigatorKeyRef = React.useRef<string | undefined>(undefined);

  const getKey = React.useCallback(() => navigatorKeyRef.current, []);

  const setKey = React.useCallback((key: string) => {
    navigatorKeyRef.current = key;
  }, []);

  const { listeners, addListener } = useChildListeners();

  const { keyedListeners, addKeyedListener } = useKeyedChildListeners();

  const stackRef = React.useRef<string | undefined>(undefined);

  const withStackTrace = React.useCallback<WithStackTrace>(
    (entry, callback) => {
      if (process.env.NODE_ENV === 'production' || stackRef.current != null) {
        callback();
        return;
      }

      const error = new Error();

      if (Error.captureStackTrace) {
        // Available on V8 and Hermes, omits the frames of `entry` and what it called
        Error.captureStackTrace(error, entry);

        stackRef.current = error.stack;
      } else {
        // Other engines always include them, so we drop the frames up to `entry` ourselves
        const frames = error.stack?.split('\n') ?? [];
        const index = frames.findIndex((frame) =>
          frame.includes(`${entry.name}@`)
        );

        stackRef.current = frames.slice(index + 1).join('\n');
      }

      try {
        callback();
      } finally {
        stackRef.current = undefined;
      }
    },
    []
  );

  const dispatch = useLatestCallback(
    (
      action: NavigationAction | ((state: NavigationState) => NavigationAction)
    ) => {
      const listener = listeners.focus[0];

      if (listener == null) {
        console.error(NOT_INITIALIZED_ERROR);
      } else {
        withStackTrace(dispatch, () => {
          listener((navigation) =>
            React.startTransition(() => {
              navigation.dispatch(action);
            })
          );
        });
      }
    }
  );

  const canGoBack = useLatestCallback(() => {
    if (listeners.focus[0] == null) {
      return false;
    }

    const { result, handled } = listeners.focus[0]((navigation) =>
      navigation.canGoBack()
    );

    if (handled) {
      return result;
    } else {
      return false;
    }
  });

  const resetRoot = useLatestCallback(
    (state: PartialState<NavigationState> | NavigationState) => {
      const target = keyedListeners.getState.root?.().key;
      const listener = listeners.focus[0];

      if (target == null || listener == null) {
        console.error(NOT_INITIALIZED_ERROR);
      } else {
        listener((navigation) =>
          navigation.dispatch({
            ...CommonActions.reset(state),
            target,
          })
        );
      }
    }
  );

  const getRootState = useLatestCallback(() => {
    return keyedListeners.getState.root?.();
  });

  const getCurrentRoute = useLatestCallback(() => {
    const state = getRootState();

    if (state == null) {
      return undefined;
    }

    const route = findFocusedRoute(state);

    return route as Route<string> | undefined;
  });

  const isReady = useLatestCallback(() => listeners.focus[0] != null);

  const emitter = useEventEmitter<NavigationContainerEventMap>();

  const { addOptionsGetter, getCurrentOptions } = useOptionsGetters({});

  const container: NavigationContainerRef<ParamList> = React.useMemo(
    () => ({
      ...Object.keys(CommonActions).reduce<any>((acc, name) => {
        const helper = (...args: any[]) =>
          withStackTrace(helper, () =>
            // @ts-expect-error: this is ok
            dispatch(CommonActions[name](...args))
          );

        acc[name] = helper;

        return acc;
      }, {}),
      ...emitter.create('root'),
      dispatch,
      resetRoot,
      canGoBack,
      getState,
      getRootState,
      getCurrentRoute,
      getCurrentOptions,
      isReady,
    }),
    [
      canGoBack,
      dispatch,
      emitter,
      getCurrentOptions,
      getCurrentRoute,
      getRootState,
      getState,
      isReady,
      resetRoot,
      withStackTrace,
    ]
  );

  const navigation: GenericNavigation<ParamListBase> = React.useMemo(() => {
    const events = emitter.create('root');

    const dispatch = (
      thunk: NavigationAction | ((state: NavigationState) => NavigationAction)
    ) => {
      const root = keyedListeners.getNavigation.root?.();

      if (root == null) {
        console.error(NOT_INITIALIZED_ERROR);
        return;
      }

      withStackTrace(dispatch, () => {
        React.startTransition(() => {
          root.dispatch(thunk);
        });
      });
    };

    const helpers = Object.keys(CommonActions).reduce<any>((acc, name) => {
      const helper = (...args: any) => {
        if (
          name === 'setParams' ||
          name === 'replaceParams' ||
          name === 'pushParams'
        ) {
          throw new Error(`Cannot call ${name} outside a screen`);
        }

        withStackTrace(helper, () =>
          // @ts-expect-error name is a valid key, but TypeScript cannot infer it.
          dispatch(CommonActions[name](...args))
        );
      };

      acc[name] = helper;

      return acc;
    }, {});

    const listeners = new WeakMap<
      (...args: never[]) => void,
      EventListenerCallback<NavigationContainerEventMap, 'state'>
    >();

    return {
      ...helpers,
      dispatch,
      addListener: (type, callback) => {
        if (type === 'state') {
          let listener = listeners.get(callback);

          if (listener === undefined) {
            // Root's state change events can contain stale and undefined state
            // But navigation objects should only receive non-stale state
            // So we add a wrapper to filter out stale events
            listener = (event) => {
              if (event.data.state?.stale === false) {
                // @ts-expect-error TypeScript doesn't narrow the generic event callback with its type.
                callback(event);
              }
            };

            listeners.set(callback, listener);
          }

          return events.addListener('state', listener);
        }

        return () => {};
      },
      removeListener: (type, callback) => {
        if (type === 'state') {
          const listener = listeners.get(callback);

          if (listener) {
            events.removeListener('state', listener);
            listeners.delete(callback);
          }
        }
      },
      canGoBack: () =>
        keyedListeners.getNavigation.root?.().canGoBack() ?? false,
      getState: () => keyedListeners.getState.root?.(),
      getParent: (routeName?: string) => {
        if (routeName !== undefined) {
          throw new Error(
            `Couldn't find a navigation object for '${routeName}' because it's called outside a screen. Is your component inside a screen?`
          );
        }

        return undefined;
      },
      setOptions: () => {
        throw new Error('Cannot call setOptions outside a screen');
      },
      isFocused: () => true,
    };
  }, [emitter, keyedListeners, withStackTrace]);

  React.useImperativeHandle(ref, () => container, [container]);

  const onDispatchAction = useLatestCallback(
    (action: NavigationAction, noop: boolean) => {
      emitter.emit({
        type: '__unsafe_action__',
        data: { action, noop, stack: stackRef.current },
      });
    }
  );

  const onEmitEvent = useLatestCallback(
    (event: {
      type: string;
      defaultPrevented: boolean | undefined;
      target: string | undefined;
      data: unknown;
    }) => {
      emitter.emit({
        type: '__unsafe_event__',
        data: event,
      });
    }
  );

  const lastEmittedOptionsRef = React.useRef<object | undefined>(undefined);

  const onOptionsChange = useLatestCallback((options: object) => {
    if (lastEmittedOptionsRef.current === options) {
      return;
    }

    lastEmittedOptionsRef.current = options;

    emitter.emit({
      type: 'options',
      data: { options },
    });
  });

  const lastEmittedStateRef = React.useRef<State>(undefined);

  const getIsStateEmitted = useLatestCallback(
    () => !isFirstMountRef.current && lastEmittedStateRef.current === getState()
  );

  const builderContext = React.useMemo(
    () => ({
      addListener,
      addKeyedListener,
      onDispatchAction,
      onEmitEvent,
      onOptionsChange,
      getIsStateEmitted,
      scheduleUpdate,
      flushUpdates,
      withStackTrace,
    }),
    [
      addListener,
      addKeyedListener,
      onDispatchAction,
      onEmitEvent,
      onOptionsChange,
      getIsStateEmitted,
      scheduleUpdate,
      flushUpdates,
      withStackTrace,
    ]
  );

  const isInitialRef = React.useRef(true);

  const getIsInitial = React.useCallback(() => isInitialRef.current, []);

  const context = React.useMemo(
    () => ({
      state,
      getState,
      setState,
      subscribe,
      getKey,
      setKey,
      getIsInitial,
      addOptionsGetter,
    }),
    [
      state,
      getState,
      setState,
      subscribe,
      getKey,
      setKey,
      getIsInitial,
      addOptionsGetter,
    ]
  );

  const onReadyRef = React.useRef(onReady);
  const onStateChangeRef = React.useRef(onStateChange);

  React.useEffect(() => {
    isInitialRef.current = false;
    onStateChangeRef.current = onStateChange;
    onReadyRef.current = onReady;
  });

  const onReadyCalledRef = React.useRef(false);

  React.useEffect(() => {
    if (!onReadyCalledRef.current && isReady()) {
      onReadyCalledRef.current = true;
      onReadyRef.current?.();
      emitter.emit({ type: 'ready' });
    }
  }, [state, isReady, emitter]);

  React.useEffect(() => {
    const hydratedState = getRootState();

    if (process.env.NODE_ENV !== 'production') {
      if (hydratedState !== undefined) {
        const serializableResult = checkSerializable(hydratedState);

        if (!serializableResult.serializable) {
          const { location, reason } = serializableResult;

          let path = '';
          let pointer: Record<any, any> = hydratedState;
          let params = false;

          for (let i = 0; i < location.length; i++) {
            const curr = location[i];
            const prev = location[i - 1];

            if (curr == null) {
              continue;
            }

            pointer = pointer[curr];

            if (!params && curr === 'state') {
              continue;
            } else if (!params && curr === 'routes') {
              if (path) {
                path += ' > ';
              }
            } else if (
              !params &&
              typeof curr === 'number' &&
              prev === 'routes'
            ) {
              path += pointer?.name;
            } else if (!params) {
              path += ` > ${curr}`;
              params = true;
            } else {
              if (typeof curr === 'number' || /^[0-9]+$/.test(curr)) {
                path += `[${curr}]`;
              } else if (/^[a-z$_]+$/i.test(curr)) {
                path += `.${curr}`;
              } else {
                path += `[${JSON.stringify(curr)}]`;
              }
            }
          }

          const message = `Non-serializable values were found in the navigation state. Check:\n\n${path} (${reason})\n\nThis can break usage such as persisting and restoring state. This might happen if you passed non-serializable values such as function, class instances etc. in params. If you need to use components with callbacks in your options, you can use 'navigation.setOptions' instead. See https://reactnavigation.org/docs/troubleshooting#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state for more details.`;

          if (!serializableWarnings.includes(message)) {
            serializableWarnings.push(message);
            console.warn(message);
          }
        }

        const duplicateRouteNamesResult =
          checkDuplicateRouteNames(hydratedState);

        if (duplicateRouteNamesResult.length) {
          const message = `Found screens with the same name nested inside one another. Check:\n${duplicateRouteNamesResult.map(
            (locations) => `\n${locations.join(', ')}`
          )}\n\nThis can cause confusing behavior during navigation. Consider using unique names for each screen instead.`;

          if (!duplicateNameWarnings.includes(message)) {
            duplicateNameWarnings.push(message);
            console.warn(message);
          }
        }
      }
    }

    lastEmittedStateRef.current = state;

    emitter.emit({ type: 'state', data: { state } });

    if (!isFirstMountRef.current && onStateChangeRef.current) {
      onStateChangeRef.current(hydratedState);
    }

    isFirstMountRef.current = false;
  }, [getRootState, emitter, state]);

  const defaultOnUnhandledAction = useLatestCallback(
    (action: NavigationAction) => {
      if (process.env.NODE_ENV === 'production') {
        return;
      }

      const payload: Record<string, any> | undefined = action.payload;

      let message = `The action '${action.type}'${
        payload ? ` with payload ${JSON.stringify(action.payload)}` : ''
      } was not handled by any navigator.`;

      switch (action.type) {
        case 'PRELOAD':
        case 'NAVIGATE':
        case 'PUSH':
        case 'REPLACE':
        case 'POP_TO':
        case 'JUMP_TO':
          if (payload?.name) {
            message += `\n\nDo you have a screen named '${payload.name}'?\n\nIf you're trying to navigate to a screen in a nested navigator, see https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator.\n\nIf you're using conditional rendering, navigation will happen automatically and you shouldn't navigate manually, see.`;
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
  );

  return (
    <NavigationIndependentTreeContext.Provider value={false}>
      <NavigationContainerRefContext.Provider value={container}>
        <NavigationRootContext.Provider value={navigation}>
          <NavigationBuilderContext.Provider value={builderContext}>
            <NavigationStateContext.Provider value={context}>
              <ConsumedParamsContext.Provider value={consumedParams}>
                <UnhandledActionContext.Provider
                  value={onUnhandledAction ?? defaultOnUnhandledAction}
                >
                  <EnsureSingleNavigator>
                    <ThemeProvider value={theme}>{children}</ThemeProvider>
                  </EnsureSingleNavigator>
                </UnhandledActionContext.Provider>
              </ConsumedParamsContext.Provider>
            </NavigationStateContext.Provider>
          </NavigationBuilderContext.Provider>
        </NavigationRootContext.Provider>
      </NavigationContainerRefContext.Provider>
    </NavigationIndependentTreeContext.Provider>
  );
}
