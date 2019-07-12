import * as React from 'react';
import {
  Descriptor,
  InitialState,
  NavigationAction,
  NavigationHelpers,
  NavigationState,
  ParamListBase,
  ScreenProps,
} from './types';
import SceneView from './SceneView';
import NavigationBuilderContext from './NavigationBuilderContext';

type Options = {
  state: NavigationState | InitialState;
  screens: { [key: string]: ScreenProps<ParamListBase, string> };
  helpers: NavigationHelpers<ParamListBase>;
  onAction: (action: NavigationAction) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
};

export default function useDescriptors({
  state,
  screens,
  helpers,
  onAction,
  getState,
  setState,
}: Options) {
  const context = React.useMemo(
    () => ({
      helpers,
      onAction,
    }),
    [helpers, onAction]
  );

  return state.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];

      acc[route.key] = {
        render() {
          return (
            <NavigationBuilderContext.Provider value={context}>
              <SceneView
                helpers={helpers}
                route={route}
                screen={screen}
                getState={getState}
                setState={setState}
              />
            </NavigationBuilderContext.Provider>
          );
        },
        options: screen.options || {},
      };
      return acc;
    },
    {} as { [key: string]: Descriptor }
  );
}
