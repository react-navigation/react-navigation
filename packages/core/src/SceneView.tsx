import * as React from 'react';
import type {
  Route,
  ParamListBase,
  NavigationState,
  PartialState,
} from '@react-navigation/routers';
import NavigationStateContext from './NavigationStateContext';
import StaticContainer from './StaticContainer';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import useOptionsGetters from './useOptionsGetters';
import type { NavigationProp, RouteConfig, EventMapBase } from './types';

type Props<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = {
  screen: RouteConfig<ParamListBase, string, State, ScreenOptions, EventMap>;
  navigation: NavigationProp<ParamListBase, string, State, ScreenOptions>;
  route: Route<string> & {
    state?: NavigationState | PartialState<NavigationState>;
  };
  getState: () => State;
  setState: (state: State) => void;
  options: object;
};

/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
export default function SceneView<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
>({
  screen,
  route,
  navigation,
  getState,
  setState,
  options,
}: Props<State, ScreenOptions, EventMap>) {
  const navigatorKeyRef = React.useRef<string | undefined>();
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

  const isInitialRef = React.useRef(true);

  React.useEffect(() => {
    isInitialRef.current = false;
  });

  const getIsInitial = React.useCallback(() => isInitialRef.current, []);

  const context = React.useMemo(
    () => ({
      state: route.state,
      getState: getCurrentState,
      setState: setCurrentState,
      getKey,
      setKey,
      getIsInitial,
      addOptionsGetter,
    }),
    [
      route.state,
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
    <NavigationStateContext.Provider value={context}>
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
    </NavigationStateContext.Provider>
  );
}
