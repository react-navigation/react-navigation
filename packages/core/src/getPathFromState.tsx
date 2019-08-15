import { NavigationState, PartialState, Route } from './types';

type State = NavigationState | Omit<PartialState<NavigationState>, 'stale'>;

/**
 * Utility to serialize a navigation state object to a path string.
 *
 * @param state Navigation state to serialize.
 * @returns Path representing the state, e.g. /foo/bar?count=42.
 */
export default function getPathFromState(state: State): string {
  let path = '/';

  let current: State | undefined = state;

  while (current) {
    const index = typeof current.index === 'number' ? current.index : 0;
    const route = current.routes[index] as Route<string> & {
      state?: State | undefined;
    };

    path += encodeURIComponent(route.name);

    if (route.state) {
      path += '/';
    } else if (route.params) {
      const query = [];

      for (const param in route.params) {
        const value = (route.params as { [key: string]: any })[param];

        query.push(
          `${encodeURIComponent(param)}=${encodeURIComponent(
            JSON.stringify(value)
          )}`
        );
      }

      path += `?${query.join('&')}`;
    }

    current = route.state;
  }

  return path;
}
