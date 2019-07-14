import * as React from 'react';
import {
  Descriptor,
  PartialState,
  NavigationAction,
  NavigationHelpers,
  NavigationState,
  ParamListBase,
  ScreenProps,
} from './types';
import SceneView from './SceneView';
import NavigationBuilderContext from './NavigationBuilderContext';

type Options = {
  state: NavigationState | PartialState;
  screens: { [key: string]: ScreenProps<ParamListBase, string> };
  helpers: NavigationHelpers<ParamListBase>;
  onAction: (action: NavigationAction) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
};

const EMPTY_OPTIONS = Object.freeze({});

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
        options: screen.options || EMPTY_OPTIONS,
      };
      return acc;
    },
    {} as { [key: string]: Descriptor }
  );
}
