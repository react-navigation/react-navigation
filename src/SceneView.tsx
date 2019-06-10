import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import StaticContainer from './StaticContainer';
import { Props as ScreenProps } from './Screen';
import { Route, NavigationState, NavigationHelpers } from './types';

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
      state: route,
    }),
    [helpers, route]
  );

  const stateRef = React.useRef(route.state);

  React.useEffect(() => {
    stateRef.current = route.state;
  });

  const getCurrentState = React.useCallback(() => stateRef.current, []);
  const setCurrentState = React.useCallback(
    (child: NavigationState | undefined) => {
      const state = getState();

      setState({
        ...state,
        routes: state.routes.map(r =>
          r === route ? { ...route, state: child } : r
        ),
      });
    },
    [getState, route, setState]
  );

  const value = React.useMemo(
    () => ({
      state: route.state,
      getState: getCurrentState,
      setState: setCurrentState,
    }),
    [getCurrentState, route.state, setCurrentState]
  );

  return (
    <NavigationStateContext.Provider value={value}>
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
    </NavigationStateContext.Provider>
  );
}
