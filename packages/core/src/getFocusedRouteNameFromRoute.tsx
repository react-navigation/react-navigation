import type { Route } from '@react-navigation/routers';

import { CHILD_STATE } from './useRouteCache';

export function getFocusedRouteNameFromRoute(
  route: Partial<Route<string>>
): string | undefined {
  // @ts-expect-error: this isn't in type definitions coz we want this private
  const state = route[CHILD_STATE] ?? route.state;
  const params = route.params as { screen?: unknown } | undefined;

  const routeName = state
    ? // Get the currently active route name in the nested navigator
      state.routes[state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available
      typeof params?.screen === 'string'
      ? params.screen
      : undefined;

  return routeName;
}
