import * as React from 'react';
import SceneView from './SceneView';
import NavigationBuilderContext, {
  ChildActionListener,
  FocusedNavigationListener,
} from './NavigationBuilderContext';
import { NavigationEventEmitter } from './useEventEmitter';
import useNavigationCache from './useNavigationCache';
import {
  Descriptor,
  PartialState,
  NavigationAction,
  NavigationHelpers,
  NavigationState,
  ParamListBase,
  RouteConfig,
  Router,
} from './types';

type Options<ScreenOptions extends object> = {
  state: NavigationState | PartialState<NavigationState>;
  screens: { [key: string]: RouteConfig<ParamListBase, string, ScreenOptions> };
  navigation: NavigationHelpers<ParamListBase>;
  screenOptions?: ScreenOptions;
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  addActionListener: (listener: ChildActionListener) => void;
  addFocusedListener: (listener: FocusedNavigationListener) => void;
  onRouteFocus: (key: string) => void;
  router: Router<NavigationState, NavigationAction>;
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
  ScreenOptions extends object
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
  onRouteFocus,
  router,
  emitter,
}: Options<ScreenOptions>) {
  const [options, setOptions] = React.useState<{ [key: string]: object }>({});
  const { trackAction } = React.useContext(NavigationBuilderContext);

  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addActionListener,
      addFocusedListener,
      onRouteFocus,
      trackAction,
    }),
    [
      navigation,
      onAction,
      addActionListener,
      addFocusedListener,
      onRouteFocus,
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

      acc[route.key] = {
        render() {
          return (
            <NavigationBuilderContext.Provider key={route.key} value={context}>
              <SceneView
                navigation={navigations[route.key]}
                route={route}
                screen={screen}
                getState={getState}
                setState={setState}
              />
            </NavigationBuilderContext.Provider>
          );
        },
        options: {
          // The default `screenOptions` passed to the navigator
          ...screenOptions,
          // The `options` prop passed to `Screen` elements
          ...(typeof screen.options === 'object' || screen.options == null
            ? screen.options
            : screen.options({
                // @ts-ignore
                route,
                navigation: navigations[route.key],
              })),
          // The options set via `navigation.setOptions`
          ...options[route.key],
        },
        navigation: navigations[route.key],
      };
      return acc;
    },
    {} as {
      [key: string]: Descriptor<ParamListBase, string, State, ScreenOptions>;
    }
  );
}
