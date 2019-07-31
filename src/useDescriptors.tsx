import * as React from 'react';
import SceneView from './SceneView';
import NavigationBuilderContext, {
  ChildActionListener,
} from './NavigationBuilderContext';
import useNavigationCache from './useNavigationCache';
import {
  Descriptor,
  PartialState,
  NavigationAction,
  NavigationHelpers,
  NavigationState,
  ParamListBase,
  RouteConfig,
} from './types';

type Options<ScreenOptions extends object> = {
  state: NavigationState | PartialState<NavigationState>;
  screens: { [key: string]: RouteConfig<ParamListBase, string, ScreenOptions> };
  navigation: NavigationHelpers<ParamListBase>;
  onAction: (
    action: NavigationAction,
    visitedNavigators?: Set<string>
  ) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  addActionListener: (listener: ChildActionListener) => void;
  removeActionListener: (listener: ChildActionListener) => void;
  onRouteFocus: (key: string) => void;
};

export default function useDescriptors<ScreenOptions extends object>({
  state,
  screens,
  navigation,
  onAction,
  getState,
  setState,
  addActionListener,
  removeActionListener,
  onRouteFocus,
}: Options<ScreenOptions>) {
  const [options, setOptions] = React.useState<{ [key: string]: object }>({});
  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addActionListener,
      removeActionListener,
      onRouteFocus,
    }),
    [
      navigation,
      onAction,
      onRouteFocus,
      addActionListener,
      removeActionListener,
    ]
  );

  const navigations = useNavigationCache({
    state,
    navigation,
    setOptions,
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
          ...(typeof screen.options === 'object' || screen.options == null
            ? screen.options
            : screen.options({
                // @ts-ignore
                route,
                navigation: navigations[route.key],
              })),
          ...options[route.key],
        },
      };
      return acc;
    },
    {} as { [key: string]: Descriptor<ScreenOptions> }
  );
}
