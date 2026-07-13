import type { InitialState } from '@react-navigation/routers';

type Result =
  | {
      key?: string | undefined;
      name: string;
      params?: object | undefined;
      path?: string | undefined;
    }
  | undefined;

export function findFocusedRoute(state: InitialState): Result {
  let current: InitialState | undefined = state;

  while (current != null) {
    const route: InitialState['routes'][number] | undefined =
      current.routes[current.index ?? current.routes.length - 1];

    if (route?.state == null) {
      return route;
    }

    current = route.state;
  }

  return undefined;
}
