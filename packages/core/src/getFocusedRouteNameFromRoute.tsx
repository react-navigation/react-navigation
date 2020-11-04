import type {
  Route,
  PartialState,
  NavigationState,
} from '@react-navigation/routers';
import { SUPPRESS_STATE_ACCESS_WARNING } from './useRouteCache';

export default function getFocusedRouteNameFromRoute(
  route: Partial<Route<string>> & { state?: PartialState<NavigationState> }
): string | undefined {
  SUPPRESS_STATE_ACCESS_WARNING.value = true;

  const state = route.state;

  SUPPRESS_STATE_ACCESS_WARNING.value = false;

  const params = route.params as { screen?: unknown } | undefined;

  const routeName = state
    ? // Get the currently active route name in the nested navigator
      state.routes[
        // If we have a partial state without index, for tab/drawer, first screen will be focused one, and last for stack
        // The type property will only exist for rehydrated state and not for state from deep link
        state.index ??
          (typeof state.type === 'string' && state.type !== 'stack'
            ? 0
            : state.routes.length - 1)
      ].name
    : // If state doesn't exist, we need to default to `screen` param if available
    typeof params?.screen === 'string'
    ? params.screen
    : undefined;

  return routeName;
}
