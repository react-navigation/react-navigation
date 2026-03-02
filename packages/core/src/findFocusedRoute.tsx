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

  while (current?.routes[current.index ?? 0].state != null) {
    current = current.routes[current.index ?? 0].state;
  }

  const route = current?.routes[current?.index ?? 0];

  return route;
}
