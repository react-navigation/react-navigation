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
import NavigationBuilderContext, {
  ChildActionListener,
} from './NavigationBuilderContext';

type Options = {
  state: NavigationState | PartialState;
  screens: { [key: string]: ScreenProps<ParamListBase, string> };
  helpers: NavigationHelpers<ParamListBase>;
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
  helpers,
  onAction,
  getState,
  setState,
  addActionListener,
  removeActionListener,
  onChildUpdate,
}: Options) {
  const context = React.useMemo(
    () => ({
      helpers,
      onAction,
      addActionListener,
      removeActionListener,
      onChildUpdate,
    }),
    [helpers, onAction, onChildUpdate, addActionListener, removeActionListener]
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
