import queryString from 'query-string';
import { NavigationState, PartialState, Route } from './types';

type State = NavigationState | Omit<PartialState<NavigationState>, 'stale'>;

type StringifyConfig = Record<string, (value: any) => string>;

type Options = {
  [routeName: string]:
    | string
    | { path: string; stringify?: StringifyConfig }
    | Options;
};

/**
 * Utility to serialize a navigation state object to a path string.
 *
 * Example:
 * ```js
 * getPathFromState(
 *   {
 *     routes: [
 *       {
 *         name: 'Chat',
 *         params: { author: 'Jane', id: 42 },
 *       },
 *     ],
 *   },
 *   {
 *     Chat: {
 *       path: 'chat/:author/:id',
 *       stringify: { author: author => author.toLowerCase() }
 *     }
 *   }
 * )
 * ```
 *
 * @param state Navigation state to serialize.
 * @param options Extra options to fine-tune how to serialize the path.
 * @returns Path representing the state, e.g. /foo/bar?count=42.
 */
export default function getPathFromState(
  state?: State,
  options: Options = {}
): string {
  let path = '/';

  let current: State | undefined = state;

  while (current) {
    let index = typeof current.index === 'number' ? current.index : 0;
    let route = current.routes[index] as Route<string> & {
      state?: State | undefined;
    };
    let currentOptions = options;
    let pattern = route.name;

    while (route.name in currentOptions) {
      if (typeof currentOptions[route.name] === 'string') {
        pattern = currentOptions[route.name] as string;
        break;
      } else if (typeof currentOptions[route.name] === 'object') {
        if (route.state === undefined) {
          pattern = (currentOptions[route.name] as { path: string }).path;
          break;
        } else {
          currentOptions = currentOptions[route.name] as Options;
          index = typeof route.state.index === 'number' ? route.state.index : 0;
          route = route.state.routes[index] as Route<string> & {
            state?: State | undefined;
          };
        }
      }
    }

    const config =
      currentOptions[route.name] !== undefined
        ? (currentOptions[route.name] as { stringify?: StringifyConfig })
            .stringify
        : undefined;

    const params = route.params
      ? // Stringify all of the param values before we use them
        Object.entries(route.params).reduce<{
          [key: string]: string;
        }>((acc, [key, value]) => {
          acc[key] = config?.[key] ? config[key](value) : String(value);
          return acc;
        }, {})
      : undefined;

    if (currentOptions[route.name] !== undefined) {
      path += pattern
        .split('/')
        .map(p => {
          const name = p.replace(/^:/, '');

          // If the path has a pattern for a param, put the param in the path
          if (params && name in params && p.startsWith(':')) {
            const value = params[name];
            // Remove the used value from the params object since we'll use the rest for query string
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete params[name];
            return encodeURIComponent(value);
          }

          return encodeURIComponent(p);
        })
        .join('/');
    } else {
      path += encodeURIComponent(route.name);
    }

    if (route.state) {
      path += '/';
    } else if (params) {
      path += `?${queryString.stringify(params)}`;
    }

    current = route.state;
  }

  return path;
}
