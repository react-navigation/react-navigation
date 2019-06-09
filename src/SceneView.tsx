import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import { NavigationPropContext } from './useNavigationBuilder';
import { Route, NavigationProp, NavigationState } from './types';

type Props = {
  screen:
    | { component: React.ComponentType<any> }
    | { children: (props: any) => React.ReactNode };
  navigation: NavigationProp;
  route: Route & { state?: NavigationState };
  state: NavigationState;
  setState: (state: NavigationState) => void;
};

export default function SceneView(props: Props) {
  const { screen, route, state, setState } = props;

  const navigation = React.useMemo(
    () => ({
      ...props.navigation,
      state: route,
    }),
    [props.navigation, route]
  );

  const value = React.useMemo(
    () => ({
      state: route.state,
      setState: (child: NavigationState) =>
        setState({
          ...state,
          routes: state.routes.map(r =>
            r === route ? { ...route, state: child } : r
          ),
        }),
    }),
    [route, setState, state]
  );

  return (
    <NavigationStateContext.Provider value={value}>
      <NavigationPropContext.Provider value={navigation}>
        {'component' in screen && screen.component !== undefined ? (
          <screen.component navigation={navigation} />
        ) : 'children' in screen && screen.children !== undefined ? (
          screen.children({ navigation })
        ) : null}
      </NavigationPropContext.Provider>
    </NavigationStateContext.Provider>
  );
}
