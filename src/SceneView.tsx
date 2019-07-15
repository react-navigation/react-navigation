import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import StaticContainer from './StaticContainer';
import {
  Route,
  NavigationState,
  NavigationHelpers,
  ScreenProps,
} from './types';
import EnsureSingleNavigator from './EnsureSingleNavigator';

type Props = {
  screen: ScreenProps;
  helpers: NavigationHelpers;
  route: Route & { state?: NavigationState };
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
};

export default function SceneView(props: Props) {
  const { screen, route, helpers, getState, setState } = props;

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      setParams: (params: object) => {
        const state = getState();

        setState({
          ...state,
          routes: state.routes.map(r =>
            r.key === route.key
              ? { ...r, params: { ...r.params, ...params } }
              : r
          ),
        });
      },
      state: route,
    }),
    [getState, helpers, route, setState]
  );

  const getCurrentState = React.useCallback(() => {
    const state = getState();

    return state.routes.find(r => r.key === route.key)!.state;
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
    }),
    [getCurrentState, route.state, setCurrentState]
  );

  return (
    <NavigationStateContext.Provider value={context}>
      <EnsureSingleNavigator>
        <StaticContainer
          name={screen.name}
          // @ts-ignore
          render={screen.component || screen.children}
          navigation={navigation}
        >
          {'component' in screen && screen.component !== undefined ? (
            <screen.component navigation={navigation} />
          ) : 'children' in screen && screen.children !== undefined ? (
            screen.children({ navigation })
          ) : null}
        </StaticContainer>
      </EnsureSingleNavigator>
    </NavigationStateContext.Provider>
  );
}
