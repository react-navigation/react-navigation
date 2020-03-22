import * as React from 'react';
import {
  Route,
  ParamListBase,
  NavigationState,
  PartialState,
} from '@react-navigation/routers';
import { NavigationStateContext } from './BaseNavigationContainer';
import NavigationContext from './NavigationContext';
import NavigationRouteContext from './NavigationRouteContext';
import StaticContainer from './StaticContainer';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import { NavigationProp, RouteConfig, EventMapBase } from './types';

type Props<
  State extends NavigationState,
  ScreenOptions extends object,
  EventMap extends EventMapBase
> = {
  screen: RouteConfig<ParamListBase, string, State, ScreenOptions, EventMap>;
  navigation: NavigationProp<ParamListBase, string, State, ScreenOptions>;
  route: Route<string> & {
    state?: NavigationState | PartialState<NavigationState>;
  };
  getState: () => State;
  setState: (state: State) => void;
};

/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
export default function SceneView<
  State extends NavigationState,
  ScreenOptions extends object,
  EventMap extends EventMapBase
>({
  screen,
  route,
  navigation,
  getState,
  setState,
}: Props<State, ScreenOptions, EventMap>) {
  const navigatorKeyRef = React.useRef<string | undefined>();

  const getKey = React.useCallback(() => navigatorKeyRef.current, []);

  const setKey = React.useCallback((key: string) => {
    navigatorKeyRef.current = key;
  }, []);

  const getCurrentState = React.useCallback(() => {
    const state = getState();
    const currentRoute = state.routes.find((r) => r.key === route.key);

    return currentRoute ? currentRoute.state : undefined;
  }, [getState, route.key]);

  const setCurrentState = React.useCallback(
    (child: NavigationState | PartialState<NavigationState> | undefined) => {
      const state = getState();

      setState({
        ...state,
        routes: state.routes.map((r) =>
          r.key === route.key ? { ...r, state: child } : r
        ),
      });
    },
    [getState, route.key, setState]
  );

  const context = React.useMemo(
    () => ({
      state: route.state,
      getState: getCurrentState,
      setState: setCurrentState,
      getKey,
      setKey,
    }),
    [getCurrentState, getKey, route.state, setCurrentState, setKey]
  );

  return (
    <NavigationContext.Provider value={navigation}>
      <NavigationRouteContext.Provider value={route}>
        <NavigationStateContext.Provider value={context}>
          <EnsureSingleNavigator>
            <StaticContainer
              name={screen.name}
              // @ts-ignore
              render={screen.component || screen.children}
              navigation={navigation}
              route={route}
            >
              {'component' in screen && screen.component !== undefined ? (
                // @ts-ignore
                <screen.component navigation={navigation} route={route} />
              ) : 'children' in screen && screen.children !== undefined ? (
                // @ts-ignore
                screen.children({ navigation, route })
              ) : null}
            </StaticContainer>
          </EnsureSingleNavigator>
        </NavigationStateContext.Provider>
      </NavigationRouteContext.Provider>
    </NavigationContext.Provider>
  );
}
