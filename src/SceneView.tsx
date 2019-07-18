import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import StaticContainer from './StaticContainer';
import {
  Route,
  NavigationState,
  NavigationHelpers,
  RouteConfig,
} from './types';
import EnsureSingleNavigator from './EnsureSingleNavigator';

type Props = {
  screen: RouteConfig;
  navigation: NavigationHelpers;
  route: Route & { state?: NavigationState };
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
};

export default function SceneView(props: Props) {
  const { screen, route, navigation: helpers, getState, setState } = props;
  const { performTransaction } = React.useContext(NavigationStateContext);

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      setParams: (params: object) => {
        performTransaction(() => {
          const state = getState();

          setState({
            ...state,
            routes: state.routes.map(r =>
              r.key === route.key
                ? { ...r, params: { ...r.params, ...params } }
                : r
            ),
          });
        });
      },
    }),
    [getState, helpers, performTransaction, route.key, setState]
  );

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
  );
}
