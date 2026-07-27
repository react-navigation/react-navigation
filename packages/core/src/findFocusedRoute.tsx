import type { NavigationState, PartialState } from '@react-navigation/routers';

type State = NavigationState | PartialState<NavigationState>;

export function findFocusedRoute(
  state: State
): State['routes'][number] | undefined {
  let current: State | undefined = state;

  while (current != null) {
    const route: State['routes'][number] | undefined =
      current.routes[current.index ?? current.routes.length - 1];

    if (route?.state == null) {
      return route;
    }

    current = route.state;
  }

  return undefined;
}
