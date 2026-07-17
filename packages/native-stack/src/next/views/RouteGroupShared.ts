import {
  type ParamListBase,
  type Route,
  StackActions,
  type StackNavigationState,
} from '@react-navigation/native';

import type {
  NativeStackDescriptor,
  NativeStackNavigationHelpers,
} from '../../types';
import { useDismissedRouteError } from '../../utils/useDismissedRouteError';

// Data shared by all route groups in the tree, passed down as a single prop.
export type RouteGroupContext = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  poppedRouteKeys: ReadonlySet<string>;
  detachedRouteKeys: ReadonlySet<string>;
  routeIndexByKey: ReadonlyMap<string, number>;
  getDescriptor: (route: Route<string>) => NativeStackDescriptor;
  getPreviousDescriptor: (
    route: Route<string>
  ) => NativeStackDescriptor | undefined;
  onRemovePoppedRoute: (key: string) => void;
  onAddNativelyDismissedRoutes: (keys: string[]) => void;
};

// Pops the routes from the given index after their screens were dismissed
// natively, so the JS state catches up with the native stack.
export function useNativeDismiss({
  state,
  navigation,
  onAddNativelyDismissedRoutes,
}: RouteGroupContext) {
  const { setNextDismissedKey } = useDismissedRouteError(state);

  return ({
    routeIndex,
    source,
    markNativelyDismissed,
  }: {
    routeIndex: number;
    source: string;
    markNativelyDismissed: boolean;
  }) => {
    const dismissedRoute = state.routes[routeIndex];
    const dismissCount = state.index - routeIndex + 1;

    if (dismissedRoute == null || dismissCount < 1) {
      return;
    }

    if (markNativelyDismissed) {
      onAddNativelyDismissedRoutes(
        state.routes
          .slice(routeIndex, state.index + 1)
          .map((route) => route.key)
      );
    }

    navigation.dispatch({
      ...StackActions.pop(dismissCount),
      source,
      target: state.key,
    });

    if (markNativelyDismissed) {
      setNextDismissedKey(dismissedRoute.key);
    }
  };
}
