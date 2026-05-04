import type {
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
} from '@react-navigation/routers';
import * as React from 'react';

import { ConsumedParamsContext } from './ConsumedParamsContext';
import { EnsureSingleNavigator } from './EnsureSingleNavigator';
import {
  type FocusedRouteState,
  NavigationFocusedRouteStateContext,
} from './NavigationFocusedRouteStateContext';
import { NavigationStateContext } from './NavigationStateContext';
import { StaticContainer } from './StaticContainer';
import type { NavigationProp, RouteConfigComponent } from './types';
import { useOptionsGetters } from './useOptionsGetters';

type Props<State extends NavigationState, ScreenOptions extends {}> = {
  screen: RouteConfigComponent<ParamListBase, string> & { name: string };
  navigation: NavigationProp<ParamListBase, string, State, ScreenOptions>;
  route: Route<string>;
  routeState: NavigationState | PartialState<NavigationState> | undefined;
  getRouteState: (
    routeKey: string
  ) => NavigationState | PartialState<NavigationState> | undefined;
  setRouteState: (
    routeKey: string,
    state: NavigationState | PartialState<NavigationState> | undefined
  ) => void;
  options: object;
  clearOptions: () => void;
};

/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
export function SceneView<
  State extends NavigationState,
  ScreenOptions extends {},
>({
  screen,
  route,
  navigation,
  routeState,
  getRouteState,
  setRouteState,
  options,
  clearOptions,
}: Props<State, ScreenOptions>) {
  const navigatorKeyRef = React.useRef<string | undefined>(undefined);
  const getKey = React.useCallback(() => navigatorKeyRef.current, []);

  const { addOptionsGetter } = useOptionsGetters({
    key: route.key,
    options,
    navigation,
  });

  const setKey = React.useCallback((key: string) => {
    navigatorKeyRef.current = key;
  }, []);

  const getCurrentState = React.useCallback(() => {
    return getRouteState(route.key);
  }, [getRouteState, route.key]);

  const setCurrentState = React.useCallback(
    (child: NavigationState | PartialState<NavigationState> | undefined) => {
      setRouteState(route.key, child);
    },
    [route.key, setRouteState]
  );

  const isInitialRef = React.useRef(true);

  React.useEffect(() => {
    isInitialRef.current = false;
  });

  // Clear options set by this screen when it is unmounted
  React.useEffect(() => {
    return clearOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIsInitial = React.useCallback(() => isInitialRef.current, []);

  const [consumedParams, setConsumedParams] = React.useState<WeakMap<
    object,
    true
  > | null>(null);

  const consumedParamsContext = React.useMemo(
    () => ({
      isConsumed: (params: object) => {
        if (consumedParams) {
          return consumedParams.has(params);
        }

        return false;
      },
      setConsumed: (params: object) => {
        setConsumedParams((prev) => {
          if (prev && prev.has(params)) {
            return prev;
          }

          const map = new WeakMap<object, true>();

          map.set(params, true);

          return map;
        });
      },
    }),
    [consumedParams]
  );

  const parentFocusedRouteState = React.use(NavigationFocusedRouteStateContext);

  const focusedRouteState = React.useMemo(() => {
    const state: FocusedRouteState = {
      routes: [
        {
          key: route.key,
          name: route.name,
          params: route.params,
          path: route.path,
        },
      ],
    };

    // Add our state to the innermost route of the parent state
    const addState = (
      parent: FocusedRouteState | undefined
    ): FocusedRouteState => {
      const parentRoute = parent?.routes[0];

      if (parentRoute) {
        return {
          routes: [
            {
              ...parentRoute,
              state: addState(parentRoute.state),
            },
          ],
        };
      }

      return state;
    };

    return addState(parentFocusedRouteState);
  }, [
    parentFocusedRouteState,
    route.key,
    route.name,
    route.params,
    route.path,
  ]);

  const context = React.useMemo(
    () => ({
      state: routeState,
      getState: getCurrentState,
      setState: setCurrentState,
      getKey,
      setKey,
      getIsInitial,
      addOptionsGetter,
    }),
    [
      routeState,
      getCurrentState,
      setCurrentState,
      getKey,
      setKey,
      getIsInitial,
      addOptionsGetter,
    ]
  );

  const ScreenComponent = screen.getComponent
    ? screen.getComponent()
    : screen.component;

  return (
    <ConsumedParamsContext.Provider value={consumedParamsContext}>
      <NavigationStateContext.Provider value={context}>
        <NavigationFocusedRouteStateContext.Provider value={focusedRouteState}>
          <EnsureSingleNavigator>
            <StaticContainer
              name={screen.name}
              render={ScreenComponent || screen.children}
              navigation={navigation}
              route={route}
            >
              {ScreenComponent !== undefined ? (
                <ScreenComponent navigation={navigation} route={route} />
              ) : screen.children !== undefined ? (
                screen.children({ navigation, route })
              ) : null}
            </StaticContainer>
          </EnsureSingleNavigator>
        </NavigationFocusedRouteStateContext.Provider>
      </NavigationStateContext.Provider>
    </ConsumedParamsContext.Provider>
  );
}
