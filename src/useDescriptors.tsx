import * as React from 'react';
import {
  Descriptor,
  PartialState,
  NavigationAction,
  NavigationHelpers,
  NavigationState,
  ParamListBase,
  RouteConfig,
} from './types';
import SceneView from './SceneView';
import NavigationBuilderContext, {
  ChildActionListener,
} from './NavigationBuilderContext';

type Options = {
  state: NavigationState | PartialState;
  screens: { [key: string]: RouteConfig<ParamListBase, string> };
  navigation: NavigationHelpers<ParamListBase>;
  onAction: (action: NavigationAction, sourceNavigatorKey?: string) => boolean;
  getState: () => NavigationState;
  setState: (state: NavigationState) => void;
  addActionListener: (listener: ChildActionListener) => void;
  removeActionListener: (listener: ChildActionListener) => void;
  onChildUpdate: (
    state: NavigationState,
    focus: boolean,
    key: string | undefined
  ) => void;
};

const EMPTY_OPTIONS = Object.freeze({});

export default function useDescriptors({
  state,
  screens,
  navigation,
  onAction,
  getState,
  setState,
  addActionListener,
  removeActionListener,
  onChildUpdate,
}: Options) {
  const context = React.useMemo(
    () => ({
      navigation,
      onAction,
      addActionListener,
      removeActionListener,
      onChildUpdate,
    }),
    [
      navigation,
      onAction,
      onChildUpdate,
      addActionListener,
      removeActionListener,
    ]
  );

  return state.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];

      acc[route.key] = {
        render() {
          return (
            <NavigationBuilderContext.Provider value={context}>
              <SceneView
                navigation={navigation}
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
