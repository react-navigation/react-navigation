import type {
  ParamListBase,
  Route,
  StackNavigationState,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';

type RetainContextT = {
  retain(): string;
  release(key: string): boolean;
  restore(key: string): boolean;
  supported: boolean;
};

/**
 * This context allows you to retain screens in memory, even after
 * they have been popped off the stack. This is important for
 * supporting native iOS "Picture in Picture" mode, as the
 * originating UIViewController must be retained in memory for the
 * PiP overlay to continue running.
 * Retained screens can also be "restored" to the top of the stack,
 * for example when the user taps the button in the PiP overlay
 * to return to the app.
 */
export const RetainContext = React.createContext<RetainContextT>({
  retain() {
    throw new Error(`Not in a native screen stack`);
  },
  release() {
    throw new Error(`Not in a native screen stack`);
  },
  restore() {
    throw new Error(`Not in a native screen stack`);
  },
  supported: false,
});

type RetainedScenes = {
  [key: string]: {
    route: Route<any>;
    descriptor: NativeStackDescriptorMap['key'];
  };
};

export function useRetainContext(
  state: StackNavigationState<ParamListBase>,
  navigation: NativeStackNavigationHelpers,
  descriptors: NativeStackDescriptorMap
) {
  const [retainedScenes, setRetainedScenes] = React.useState<RetainedScenes>(
    {}
  );
  const latestValues = React.useRef({ state, retainedScenes, descriptors });
  React.useEffect(() => {
    latestValues.current = { state, retainedScenes, descriptors };
  });

  const retainContext = React.useMemo<RetainContextT>(
    () => ({
      retain() {
        const { state, descriptors } = latestValues.current;
        const route = state.routes[state.routes.length - 1];
        setRetainedScenes((screens) => ({
          ...screens,
          [route.key]: {
            route,
            descriptor: descriptors[route.key],
          },
        }));
        return route.key;
      },
      release(key) {
        setRetainedScenes((screens) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = screens;
          return rest;
        });
        return latestValues.current.retainedScenes[key] != null;
      },
      restore(key) {
        const { retainedScenes, state } = latestValues.current;

        const route = retainedScenes[key]?.route;
        if (!route) {
          return false;
        }

        // Remove from retained
        setRetainedScenes((screens) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = screens;
          return rest;
        });

        const index = state.routes.findIndex((r) => r.key === key);
        const routes =
          index !== -1 ? state.routes.slice(0, index) : state.routes.slice();
        routes.push(route);
        navigation.dispatch({
          type: 'RESET',
          payload: { ...state, index: routes.length - 1, routes },
        });

        return true;
      },
      supported: true,
    }),
    [navigation]
  );

  const routeKeys = state.routes.reduce((map, route) => {
    map[route.key] = true;
    return map;
  }, {} as { [key: string]: true });

  // Routes that were marked as 'retain' and have been removed from the stack,
  // for which we still want to keep the memory allocated.
  const hiddenRoutes: Route<any>[] = [];
  const hiddenDescriptors: NativeStackDescriptorMap = {};
  Object.keys(retainedScenes).forEach((key) => {
    if (!routeKeys[key]) {
      hiddenRoutes.push(retainedScenes[key].route);
      hiddenDescriptors[key] = retainedScenes[key].descriptor;
    }
  });

  return {
    retainContext,
    hiddenRoutes,
    hiddenDescriptors,
    retainedKeys: Object.keys(retainedScenes),
  };
}
