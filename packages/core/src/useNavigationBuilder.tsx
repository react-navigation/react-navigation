import {
  CommonActions,
  DefaultRouterOptions,
  NavigationAction,
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
  Router,
  RouterConfigOptions,
  RouterFactory,
} from '@react-navigation/routers';
import * as React from 'react';
import { isValidElementType } from 'react-is';

import Group from './Group';
import isArrayEqual from './isArrayEqual';
import isRecordEqual from './isRecordEqual';
import NavigationHelpersContext from './NavigationHelpersContext';
import NavigationRouteContext from './NavigationRouteContext';
import NavigationStateContext from './NavigationStateContext';
import Screen from './Screen';
import {
  DefaultNavigatorOptions,
  EventMapBase,
  EventMapCore,
  NavigatorScreenParams,
  PrivateValueStore,
  RouteConfig,
} from './types';
import useChildListeners from './useChildListeners';
import useComponent from './useComponent';
import useCurrentRender from './useCurrentRender';
import useDescriptors, { ScreenConfigWithParent } from './useDescriptors';
import useEventEmitter from './useEventEmitter';
import useFocusedListenersChildrenAdapter from './useFocusedListenersChildrenAdapter';
import useFocusEvents from './useFocusEvents';
import useKeyedChildListeners from './useKeyedChildListeners';
import useNavigationHelpers from './useNavigationHelpers';
import useOnAction from './useOnAction';
import useOnGetState from './useOnGetState';
import useOnRouteFocus from './useOnRouteFocus';
import useRegisterNavigator from './useRegisterNavigator';
import useScheduleUpdate from './useScheduleUpdate';

// This is to make TypeScript compiler happy
// eslint-disable-next-line babel/no-unused-expressions
PrivateValueStore;

type NavigatorRoute<State extends NavigationState> = {
  key: string;
  params?: NavigatorScreenParams<ParamListBase, State>;
};

const isValidKey = (key: unknown) =>
  key === undefined || (typeof key === 'string' && key !== '');

/**
 * Extract route config object from React children elements.
 *
 * @param children React Elements to extract the config from.
 */
const getRouteConfigsFromChildren = <
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
>(
  children: React.ReactNode,
  groupKey?: string,
  groupOptions?: ScreenConfigWithParent<
    State,
    ScreenOptions,
    EventMap
  >['options']
) => {
  const configs = React.Children.toArray(children).reduce<
    ScreenConfigWithParent<State, ScreenOptions, EventMap>[]
  >((acc, child) => {
    if (React.isValidElement(child)) {
      if (child.type === Screen) {
        // We can only extract the config from `Screen` elements
        // If something else was rendered, it's probably a bug

        if (!isValidKey(child.props.navigationKey)) {
          throw new Error(
            `Got an invalid 'navigationKey' prop (${JSON.stringify(
              child.props.navigationKey
            )}) for the screen '${
              child.props.name
            }'. It must be a non-empty string or 'undefined'.`
          );
        }

        acc.push({
          keys: [groupKey, child.props.navigationKey],
          options: groupOptions,
          props: child.props as RouteConfig<
            ParamListBase,
            string,
            State,
            ScreenOptions,
            EventMap
          >,
        });
        return acc;
      }

      if (child.type === React.Fragment || child.type === Group) {
        if (!isValidKey(child.props.navigationKey)) {
          throw new Error(
            `Got an invalid 'navigationKey' prop (${JSON.stringify(
              child.props.navigationKey
            )}) for the group. It must be a non-empty string or 'undefined'.`
          );
        }

        // When we encounter a fragment or group, we need to dive into its children to extract the configs
        // This is handy to conditionally define a group of screens
        acc.push(
          ...getRouteConfigsFromChildren<State, ScreenOptions, EventMap>(
            child.props.children,
            child.props.navigationKey,
            child.type !== Group
              ? groupOptions
              : groupOptions != null
              ? [...groupOptions, child.props.screenOptions]
              : [child.props.screenOptions]
          )
        );
        return acc;
      }
    }

    throw new Error(
      `A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found ${
        React.isValidElement(child)
          ? `'${
              typeof child.type === 'string' ? child.type : child.type?.name
            }'${
              child.props?.name ? ` for the screen '${child.props.name}'` : ''
            }`
          : typeof child === 'object'
          ? JSON.stringify(child)
          : `'${String(child)}'`
      }). To render this component in the navigator, pass it in the 'component' prop to 'Screen'.`
    );
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    configs.forEach((config) => {
      const { name, children, component, getComponent } = config.props;

      if (typeof name !== 'string' || !name) {
        throw new Error(
          `Got an invalid name (${JSON.stringify(
            name
          )}) for the screen. It must be a non-empty string.`
        );
      }

      if (
        children != null ||
        component !== undefined ||
        getComponent !== undefined
      ) {
        if (children != null && component !== undefined) {
          throw new Error(
            `Got both 'component' and 'children' props for the screen '${name}'. You must pass only one of them.`
          );
        }

        if (children != null && getComponent !== undefined) {
          throw new Error(
            `Got both 'getComponent' and 'children' props for the screen '${name}'. You must pass only one of them.`
          );
        }

        if (component !== undefined && getComponent !== undefined) {
          throw new Error(
            `Got both 'component' and 'getComponent' props for the screen '${name}'. You must pass only one of them.`
          );
        }

        if (children != null && typeof children !== 'function') {
          throw new Error(
            `Got an invalid value for 'children' prop for the screen '${name}'. It must be a function returning a React Element.`
          );
        }

        if (component !== undefined && !isValidElementType(component)) {
          throw new Error(
            `Got an invalid value for 'component' prop for the screen '${name}'. It must be a valid React Component.`
          );
        }

        if (getComponent !== undefined && typeof getComponent !== 'function') {
          throw new Error(
            `Got an invalid value for 'getComponent' prop for the screen '${name}'. It must be a function returning a React Component.`
          );
        }

        if (typeof component === 'function' && component.name === 'component') {
          // Inline anonymous functions passed in the `component` prop will have the name of the prop
          // It's relatively safe to assume that it's not a component since it should also have PascalCase name
          // We won't catch all scenarios here, but this should catch a good chunk of incorrect use.
          console.warn(
            `Looks like you're passing an inline function for 'component' prop for the screen '${name}' (e.g. component={() => <SomeComponent />}). Passing an inline function will cause the component state to be lost on re-render and cause perf issues since it's re-created every render. You can pass the function as children to 'Screen' instead to achieve the desired behaviour.`
          );
        }
      } else {
        throw new Error(
          `Couldn't find a 'component', 'getComponent' or 'children' prop for the screen '${name}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`
        );
      }
    });
  }

  return configs;
};

/**
 * Hook for building navigators.
 *
 * @param createRouter Factory method which returns router object.
 * @param options Options object containing `children` and additional options for the router.
 * @returns An object containing `state`, `navigation`, `descriptors` objects.
 */
export default function useNavigationBuilder<
  State extends NavigationState,
  RouterOptions extends DefaultRouterOptions,
  ActionHelpers extends Record<string, () => void>,
  ScreenOptions extends {},
  EventMap extends Record<string, any>
>(
  createRouter: RouterFactory<State, any, RouterOptions>,
  options: DefaultNavigatorOptions<
    ParamListBase,
    State,
    ScreenOptions,
    EventMap
  > &
    RouterOptions
) {
  const navigatorKey = useRegisterNavigator();

  const route = React.useContext(NavigationRouteContext) as
    | NavigatorRoute<State>
    | undefined;

  const { children, screenListeners, ...rest } = options;
  const { current: router } = React.useRef<Router<State, any>>(
    createRouter({
      ...(rest as unknown as RouterOptions),
      ...(route?.params &&
      route.params.state == null &&
      route.params.initial !== false &&
      typeof route.params.screen === 'string'
        ? { initialRouteName: route.params.screen }
        : null),
    })
  );

  const routeConfigs =
    getRouteConfigsFromChildren<State, ScreenOptions, EventMap>(children);

  const screens = routeConfigs.reduce<
    Record<string, ScreenConfigWithParent<State, ScreenOptions, EventMap>>
  >((acc, config) => {
    if (config.props.name in acc) {
      throw new Error(
        `A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named '${config.props.name}')`
      );
    }

    acc[config.props.name] = config;
    return acc;
  }, {});

  const routeNames = routeConfigs.map((config) => config.props.name);
  const routeKeyList = routeNames.reduce<Record<string, React.Key | undefined>>(
    (acc, curr) => {
      acc[curr] = screens[curr].keys.map((key) => key ?? '').join(':');
      return acc;
    },
    {}
  );
  const routeParamList = routeNames.reduce<Record<string, object | undefined>>(
    (acc, curr) => {
      const { initialParams } = screens[curr].props;
      acc[curr] = initialParams;
      return acc;
    },
    {}
  );
  const routeGetIdList = routeNames.reduce<
    RouterConfigOptions['routeGetIdList']
  >(
    (acc, curr) =>
      Object.assign(acc, {
        [curr]: screens[curr].props.getId,
      }),
    {}
  );

  if (!routeNames.length) {
    throw new Error(
      "Couldn't find any screens for the navigator. Have you defined any screens as its children?"
    );
  }

  const isStateValid = React.useCallback(
    (state) => state.type === undefined || state.type === router.type,
    [router.type]
  );

  const isStateInitialized = React.useCallback(
    (state) =>
      state !== undefined && state.stale === false && isStateValid(state),
    [isStateValid]
  );

  const {
    state: currentState,
    getState: getCurrentState,
    setState: setCurrentState,
    setKey,
    getKey,
    getIsInitial,
  } = React.useContext(NavigationStateContext);

  const stateCleanedUp = React.useRef(false);

  const cleanUpState = React.useCallback(() => {
    setCurrentState(undefined);
    stateCleanedUp.current = true;
  }, [setCurrentState]);

  const setState = React.useCallback(
    (state: NavigationState | PartialState<NavigationState> | undefined) => {
      if (stateCleanedUp.current) {
        // State might have been already cleaned up due to unmount
        // We do not want to expose API allowing to override this
        // This would lead to old data preservation on main navigator unmount
        return;
      }
      setCurrentState(state);
    },
    [setCurrentState]
  );

  const [initializedState, isFirstStateInitialization] = React.useMemo(() => {
    const initialRouteParamList = routeNames.reduce<
      Record<string, object | undefined>
    >((acc, curr) => {
      const { initialParams } = screens[curr].props;
      const initialParamsFromParams =
        route?.params?.state == null &&
        route?.params?.initial !== false &&
        route?.params?.screen === curr
          ? route.params.params
          : undefined;

      acc[curr] =
        initialParams !== undefined || initialParamsFromParams !== undefined
          ? {
              ...initialParams,
              ...initialParamsFromParams,
            }
          : undefined;

      return acc;
    }, {});

    // If the current state isn't initialized on first render, we initialize it
    // We also need to re-initialize it if the state passed from parent was changed (maybe due to reset)
    // Otherwise assume that the state was provided as initial state
    // So we need to rehydrate it to make it usable
    if (
      (currentState === undefined || !isStateValid(currentState)) &&
      route?.params?.state == null
    ) {
      return [
        router.getInitialState({
          routeNames,
          routeParamList: initialRouteParamList,
          routeGetIdList,
        }),
        true,
      ];
    } else {
      return [
        router.getRehydratedState(
          route?.params?.state ?? (currentState as PartialState<State>),
          {
            routeNames,
            routeParamList: initialRouteParamList,
            routeGetIdList,
          }
        ),
        false,
      ];
    }
    // We explicitly don't include routeNames, route.params etc. in the dep list
    // below. We want to avoid forcing a new state to be calculated in those cases
    // Instead, we handle changes to these in the nextState code below. Note
    // that some changes to routeConfigs are explicitly ignored, such as changes
    // to initialParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState, router, isStateValid]);

  const previousRouteKeyListRef = React.useRef(routeKeyList);

  React.useEffect(() => {
    previousRouteKeyListRef.current = routeKeyList;
  });

  const previousRouteKeyList = previousRouteKeyListRef.current;

  let state =
    // If the state isn't initialized, or stale, use the state we initialized instead
    // The state won't update until there's a change needed in the state we have initalized locally
    // So it'll be `undefined` or stale until the first navigation event happens
    isStateInitialized(currentState)
      ? (currentState as State)
      : (initializedState as State);

  let nextState: State = state;

  if (
    !isArrayEqual(state.routeNames, routeNames) ||
    !isRecordEqual(routeKeyList, previousRouteKeyList)
  ) {
    // When the list of route names change, the router should handle it to remove invalid routes
    nextState = router.getStateForRouteNamesChange(state, {
      routeNames,
      routeParamList,
      routeGetIdList,
      routeKeyChanges: Object.keys(routeKeyList).filter(
        (name) =>
          previousRouteKeyList.hasOwnProperty(name) &&
          routeKeyList[name] !== previousRouteKeyList[name]
      ),
    });
  }

  const previousNestedParamsRef = React.useRef(route?.params);

  React.useEffect(() => {
    previousNestedParamsRef.current = route?.params;
  }, [route?.params]);

  if (route?.params) {
    const previousParams = previousNestedParamsRef.current;

    let action: CommonActions.Action | undefined;

    if (
      typeof route.params.state === 'object' &&
      route.params.state != null &&
      route.params !== previousParams
    ) {
      // If the route was updated with new state, we should reset to it
      action = CommonActions.reset(route.params.state);
    } else if (
      typeof route.params.screen === 'string' &&
      ((route.params.initial === false && isFirstStateInitialization) ||
        route.params !== previousParams)
    ) {
      // If the route was updated with new screen name and/or params, we should navigate there
      action = CommonActions.navigate({
        name: route.params.screen,
        params: route.params.params,
        path: route.params.path,
      });
    }

    // The update should be limited to current navigator only, so we call the router manually
    const updatedState = action
      ? router.getStateForAction(nextState, action, {
          routeNames,
          routeParamList,
          routeGetIdList,
        })
      : null;

    nextState =
      updatedState !== null
        ? router.getRehydratedState(updatedState, {
            routeNames,
            routeParamList,
            routeGetIdList,
          })
        : nextState;
  }

  const shouldUpdate = state !== nextState;

  useScheduleUpdate(() => {
    if (shouldUpdate) {
      // If the state needs to be updated, we'll schedule an update
      setState(nextState);
    }
  });

  // The up-to-date state will come in next render, but we don't need to wait for it
  // We can't use the outdated state since the screens have changed, which will cause error due to mismatched config
  // So we override the state object we return to use the latest state as soon as possible
  state = nextState;

  React.useEffect(() => {
    setKey(navigatorKey);

    if (!getIsInitial()) {
      // If it's not initial render, we need to update the state
      // This will make sure that our container gets notifier of state changes due to new mounts
      // This is necessary for proper screen tracking, URL updates etc.
      setState(nextState);
    }

    return () => {
      // We need to clean up state for this navigator on unmount
      // We do it in a timeout because we need to detect if another navigator mounted in the meantime
      // For example, if another navigator has started rendering, we should skip cleanup
      // Otherwise, our cleanup step will cleanup state for the other navigator and re-initialize it
      setTimeout(() => {
        if (getCurrentState() !== undefined && getKey() === navigatorKey) {
          cleanUpState();
        }
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // We initialize this ref here to avoid a new getState getting initialized
  // whenever initializedState changes. We want getState to have access to the
  // latest initializedState, but don't need it to change when that happens
  const initializedStateRef = React.useRef<State>();
  initializedStateRef.current = initializedState;

  const getState = React.useCallback((): State => {
    const currentState = getCurrentState();

    return isStateInitialized(currentState)
      ? (currentState as State)
      : (initializedStateRef.current as State);
  }, [getCurrentState, isStateInitialized]);

  const emitter = useEventEmitter<EventMapCore<State>>((e) => {
    let routeNames = [];

    let route: Route<string> | undefined;

    if (e.target) {
      route = state.routes.find((route) => route.key === e.target);

      if (route?.name) {
        routeNames.push(route.name);
      }
    } else {
      route = state.routes[state.index];
      routeNames.push(
        ...Object.keys(screens).filter((name) => route?.name === name)
      );
    }

    if (route == null) {
      return;
    }

    const navigation = descriptors[route.key].navigation;

    const listeners = ([] as (((e: any) => void) | undefined)[])
      .concat(
        // Get an array of listeners for all screens + common listeners on navigator
        ...[
          screenListeners,
          ...routeNames.map((name) => {
            const { listeners } = screens[name].props;
            return listeners;
          }),
        ].map((listeners) => {
          const map =
            typeof listeners === 'function'
              ? listeners({ route: route as any, navigation })
              : listeners;

          return map
            ? Object.keys(map)
                .filter((type) => type === e.type)
                .map((type) => map?.[type])
            : undefined;
        })
      )
      // We don't want same listener to be called multiple times for same event
      // So we remove any duplicate functions from the array
      .filter((cb, i, self) => cb && self.lastIndexOf(cb) === i);

    listeners.forEach((listener) => listener?.(e));
  });

  useFocusEvents({ state, emitter });

  React.useEffect(() => {
    emitter.emit({ type: 'state', data: { state } });
  }, [emitter, state]);

  const { listeners: childListeners, addListener } = useChildListeners();

  const { keyedListeners, addKeyedListener } = useKeyedChildListeners();

  const onAction = useOnAction({
    router,
    getState,
    setState,
    key: route?.key,
    actionListeners: childListeners.action,
    beforeRemoveListeners: keyedListeners.beforeRemove,
    routerConfigOptions: {
      routeNames,
      routeParamList,
      routeGetIdList,
    },
    emitter,
  });

  const onRouteFocus = useOnRouteFocus({
    router,
    key: route?.key,
    getState,
    setState,
  });

  const navigation = useNavigationHelpers<
    State,
    ActionHelpers,
    NavigationAction,
    EventMap
  >({
    onAction,
    getState,
    emitter,
    router,
  });

  useFocusedListenersChildrenAdapter({
    navigation,
    focusedListeners: childListeners.focus,
  });

  useOnGetState({
    getState,
    getStateListeners: keyedListeners.getState,
  });

  const descriptors = useDescriptors<
    State,
    ActionHelpers,
    ScreenOptions,
    EventMap
  >({
    state,
    screens,
    navigation,
    screenOptions: options.screenOptions,
    defaultScreenOptions: options.defaultScreenOptions,
    onAction,
    getState,
    setState,
    onRouteFocus,
    addListener,
    addKeyedListener,
    router,
    // @ts-expect-error: this should have both core and custom events, but too much work right now
    emitter,
  });

  useCurrentRender({
    state,
    navigation,
    descriptors,
  });

  const NavigationContent = useComponent(NavigationHelpersContext.Provider, {
    value: navigation,
  });

  return {
    state,
    navigation,
    descriptors,
    NavigationContent,
  };
}
