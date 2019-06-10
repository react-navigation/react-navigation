import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import StaticContainer from './StaticContainer';
import { Props as ScreenProps } from './Screen';
import { Route, NavigationState, NavigationHelpers } from './types';

type Props = {
  screen: ScreenProps;
  helpers: NavigationHelpers;
  route: Route & { state?: NavigationState };
  initialState: NavigationState;
  setState: React.Dispatch<React.SetStateAction<NavigationState | undefined>>;
};

export default function SceneView(props: Props) {
  const { screen, route, helpers, initialState, setState } = props;

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      state: route,
    }),
    [helpers, route]
  );

  const value = React.useMemo(
    () => ({
      state: route.state,
      setState<T = NavigationState | undefined>(child: T | ((state: T) => T)) {
        setState((state: NavigationState = initialState) => ({
          ...state,
          routes: state.routes.map(r =>
            r === route
              ? {
                  ...route,
                  state:
                    // @ts-ignore
                    typeof child === 'function' ? child(route.state) : child,
                }
              : r
          ),
        }));
      },
    }),
    [initialState, route, setState]
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
