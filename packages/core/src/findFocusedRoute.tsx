import type { NavigationState, PartialState } from '@react-navigation/routers';

type State = NavigationState | PartialState<NavigationState>;

type Route = State['routes'][number] | undefined;

export function findFocusedRoute(state: State): Route {
  let current: State | undefined = state;

  while (current != null) {
    const route: Route = current.routes[current.index];

    if (route?.state == null) {
      return route;
    }

    current = route.state;
  }

  return undefined;
}
