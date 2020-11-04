import * as React from 'react';
import type {
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from '@react-navigation/routers';
import SceneView from './SceneView';
import NavigationBuilderContext, {
  AddListener,
  AddKeyedListener,
} from './NavigationBuilderContext';
import type { NavigationEventEmitter } from './useEventEmitter';
import useNavigationCache from './useNavigationCache';
import useRouteCache from './useRouteCache';
import NavigationContext from './NavigationContext';
import NavigationRouteContext from './NavigationRouteContext';
import type {
  Descriptor,
  NavigationHelpers,
  RouteConfig,
  RouteProp,
  EventMapBase,
} from './types';

type Options<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
> = {
  state: State;
  screens: Record<
    string,
    RouteConfig<ParamListBase, string, State, ScreenOptions, EventMap>
  >;
  navigation: NavigationHelpers<ParamListBase>;
  screenOptions?:
    | ScreenOptions
    | ((props: {
        route: RouteProp<ParamListBase, string>;
        navigation: any;
      }) => ScreenOptions);
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => State;
  setState: (state: State) => void;
  addListener: AddListener;
  addKeyedListener: AddKeyedListener;
  onRouteFocus: (key: string) => void;
  router: Router<State, NavigationAction>;
  emitter: NavigationEventEmitter<any>;
};

/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export default function useDescriptors<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
>({
  state,
  screens,
  navigation,
  screenOptions,
  onAction,
  getState,
  setState,
  addListener,
  addKeyedListener,
  onRouteFocus,
  router,
  emitter,
}: Options<State, ScreenOptions, EventMap>) {
  const [options, setOptions] = React.useState<Record<string, object>>({});
  const { onDispatchAction, onOptionsChange } = React.useContext(
    NavigationBuilderContext
  );

  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addListener,
      addKeyedListener,
      onRouteFocus,
      onDispatchAction,
      onOptionsChange,
    }),
    [
      navigation,
      onAction,
      addListener,
      addKeyedListener,
      onRouteFocus,
      onDispatchAction,
      onOptionsChange,
    ]
  );

  const navigations = useNavigationCache<State, ScreenOptions>({
    state,
    getState,
    navigation,
    setOptions,
    router,
    emitter,
  });

  const routes = useRouteCache(state.routes);

  return routes.reduce<
    Record<string, Descriptor<ParamListBase, string, State, ScreenOptions>>
  >((acc, route, i) => {
    const screen = screens[route.name];
    const navigation = navigations[route.key];

    const routeOptions = {
      // The default `screenOptions` passed to the navigator
      ...(typeof screenOptions === 'object' || screenOptions == null
        ? screenOptions
        : // @ts-expect-error: this is a function, but typescript doesn't think so
          screenOptions({
            route,
            navigation,
          })),
      // The `options` prop passed to `Screen` elements
      ...(typeof screen.options === 'object' || screen.options == null
        ? screen.options
        : // @ts-expect-error: this is a function, but typescript doesn't think so
          screen.options({
            route,
            navigation,
          })),
      // The options set via `navigation.setOptions`
      ...options[route.key],
    };

    acc[route.key] = {
      navigation,
      render() {
        return (
          <NavigationBuilderContext.Provider key={route.key} value={context}>
            <NavigationContext.Provider value={navigation}>
              <NavigationRouteContext.Provider value={route}>
                <SceneView
                  navigation={navigation}
                  route={route}
                  screen={screen}
                  routeState={state.routes[i].state}
                  getState={getState}
                  setState={setState}
                  options={routeOptions}
                />
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          </NavigationBuilderContext.Provider>
        );
      },
      options: routeOptions as ScreenOptions,
    };

    return acc;
  }, {});
}
