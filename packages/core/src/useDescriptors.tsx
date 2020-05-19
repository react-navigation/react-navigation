import * as React from 'react';
import {
  NavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from '@react-navigation/routers';
import SceneView from './SceneView';
import NavigationBuilderContext, {
  ChildActionListener,
  FocusedNavigationListener,
  NavigatorStateGetter,
} from './NavigationBuilderContext';
import { NavigationEventEmitter } from './useEventEmitter';
import useNavigationCache from './useNavigationCache';
import {
  Descriptor,
  NavigationHelpers,
  RouteConfig,
  RouteProp,
  EventMapBase,
} from './types';

type Options<
  State extends NavigationState,
  ScreenOptions extends object,
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
  addActionListener: (listener: ChildActionListener) => void;
  addFocusedListener: (listener: FocusedNavigationListener) => void;
  addStateGetter: (key: string, getter: NavigatorStateGetter) => void;
  onRouteFocus: (key: string) => void;
  router: Router<State, NavigationAction>;
  emitter: NavigationEventEmitter;
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
  ScreenOptions extends object,
  EventMap extends EventMapBase
>({
  state,
  screens,
  navigation,
  screenOptions,
  onAction,
  getState,
  setState,
  addActionListener,
  addFocusedListener,
  addStateGetter,
  onRouteFocus,
  router,
  emitter,
}: Options<State, ScreenOptions, EventMap>) {
  const [options, setOptions] = React.useState<Record<string, object>>({});
  const { trackAction } = React.useContext(NavigationBuilderContext);

  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addActionListener,
      addFocusedListener,
      addStateGetter,
      onRouteFocus,
      trackAction,
    }),
    [
      navigation,
      onAction,
      addActionListener,
      addFocusedListener,
      onRouteFocus,
      addStateGetter,
      trackAction,
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

  return state.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];
      const navigation = navigations[route.key];

      const routeOptions = {
        // The default `screenOptions` passed to the navigator
        ...(typeof screenOptions === 'object' || screenOptions == null
          ? screenOptions
          : screenOptions({
              // @ts-ignore
              route,
              navigation,
            })),
        // The `options` prop passed to `Screen` elements
        ...(typeof screen.options === 'object' || screen.options == null
          ? screen.options
          : screen.options({
              // @ts-ignore
              route,
              // @ts-ignore
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
              <SceneView
                navigation={navigation}
                route={route}
                screen={screen}
                getState={getState}
                setState={setState}
                options={routeOptions}
              />
            </NavigationBuilderContext.Provider>
          );
        },
        options: routeOptions,
      };

      return acc;
    },
    {} as {
      [key: string]: Descriptor<ParamListBase, string, State, ScreenOptions>;
    }
  );
}
