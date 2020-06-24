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
import NavigationBuilderContext from './NavigationBuilderContext';
import useFocusEffect from './useFocusEffect';
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
  const { onOptionsChange } = React.useContext(NavigationBuilderContext);
  const getKey = React.useCallback(() => navigatorKeyRef.current, []);
  const optionsRef = React.useRef<object | undefined>(options);
  const getOptions = React.useCallback(() => optionsRef.current, []);

  const { addOptionsGetter, hasAnyChildListener } = useOptionsGetters({
    key: route.key,
    getState,
    getOptions,
  });

  const optionsChange = React.useCallback(() => {
    optionsRef.current = options;
    if (!hasAnyChildListener) {
      onOptionsChange(options);
    }
  }, [onOptionsChange, options, hasAnyChildListener]);

  useFocusEffect(optionsChange);

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
      addOptionsGetter,
    }),
    [
      getCurrentState,
      getKey,
      route.state,
      setCurrentState,
      setKey,
      addOptionsGetter,
    ]
  );

  return (
    <NavigationStateContext.Provider value={context}>
      <EnsureSingleNavigator>
        <StaticContainer
          name={screen.name}
          // @ts-expect-error: these properties exist on screen, but TS is confused
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
