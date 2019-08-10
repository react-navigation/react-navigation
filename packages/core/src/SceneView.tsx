import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import NavigationContext from './NavigationContext';
import StaticContainer from './StaticContainer';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import {
  Route,
  ParamListBase,
  NavigationState,
  NavigationProp,
  RouteConfig,
} from './types';

type Props<State extends NavigationState, ScreenOptions extends object> = {
  screen: RouteConfig<ParamListBase, string, ScreenOptions>;
  navigation: NavigationProp<ParamListBase, string, State, ScreenOptions>;
  route: Route<string> & { state?: NavigationState };
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
};

/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
export default function SceneView<
  State extends NavigationState,
  ScreenOptions extends object
>({
  screen,
  route,
  navigation,
  getState,
  setState,
}: Props<State, ScreenOptions>) {
  const { performTransaction } = React.useContext(NavigationStateContext);

  const getCurrentState = React.useCallback(() => {
    const state = getState();
    const currentRoute = state.routes.find(r => r.key === route.key);

    return currentRoute ? currentRoute.state : undefined;
  }, [getState, route.key]);

  const setCurrentState = React.useCallback(
    (child: NavigationState | undefined) => {
      const state = getState();

      setState({
        ...state,
        routes: state.routes.map(r =>
          r.key === route.key ? { ...r, state: child } : r
        ),
      });
    },
    [getState, route, setState]
  );

  const context = React.useMemo(
    () => ({
      state: route.state,
      getState: getCurrentState,
      setState: setCurrentState,
      performTransaction,
      key: route.key,
    }),
    [
      getCurrentState,
      performTransaction,
      route.key,
      route.state,
      setCurrentState,
    ]
  );

  return (
    <NavigationContext.Provider value={navigation}>
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
              <screen.component navigation={navigation} route={route} />
            ) : 'children' in screen && screen.children !== undefined ? (
              screen.children({ navigation, route })
            ) : null}
          </StaticContainer>
        </EnsureSingleNavigator>
      </NavigationStateContext.Provider>
    </NavigationContext.Provider>
  );
}
