import escape from 'escape-string-regexp';
import queryString from 'query-string';
import { NavigationState, PartialState } from './types';

type ParseConfig = { [key: string]: (value: string) => any };

type Options = {
  [routeName: string]: string | { path: string; parse?: ParseConfig };
};

/**
 * Utility to parse a path string to initial state object accepted by the container.
 * This is useful for deep linking when we need to handle the incoming URL.
 *
 * Example:
 * ```js
 * getStateFromPath(
 *   '/chat/jane/42',
 *   {
 *     Chat: {
 *       path: 'chat/:author/:id',
 *       parse: { id: Number }
 *     }
 *   }
 * )
 * ```
 * @param path Path string to parse and convert, e.g. /foo/bar?count=42.
 * @param options Extra options to fine-tune how to parse the path.
 */
export default function getStateFromPath(
  path: string,
  options: Options = {}
): PartialState<NavigationState> | undefined {
  // Create a normalized config array which will be easier to use
  const routeConfig = Object.keys(options).map(key => {
    const pattern =
      typeof options[key] === 'string'
        ? (options[key] as string)
        : (options[key] as { path: string }).path;

    // Create a regex from the provided path pattern
    // With the pattern, we can match segements containing params and extract them
    const match = new RegExp(
      '^' + escape(pattern).replace(/:[a-z0-9]+/gi, '([^/]+)') + '/?'
    );

    return {
      match,
      pattern,
      routeName: key,
      // @ts-ignore
      parse: options[key].parse,
    };
  });

  let result: PartialState<NavigationState> | undefined;
  let current: PartialState<NavigationState> | undefined;

  let remaining = path
    .replace(/[/]+/, '/') // Replace multiple slash (//) with single ones
    .replace(/^\//, '') // Remove extra leading slash
    .replace(/\?.*/, ''); // Remove query params which we will handle later

  while (remaining) {
    let routeName;
    let params;

    // Go through all configs, and see if the next path segment matches our regex
    for (const config of routeConfig) {
      const match = remaining.match(config.match);

      // If our regex matches, we need to extract params from the path
      if (match) {
        routeName = config.routeName;

        const paramPatterns = config.pattern
          .split('/')
          .filter(p => p.startsWith(':'));

        if (paramPatterns.length) {
          params = paramPatterns.reduce<{ [key: string]: any }>((acc, p, i) => {
            const key = p.replace(/^:/, '');
            const value = match[i + 1]; // The param segments start from index 1 in the regex match result

            acc[key] =
              config.parse && config.parse[key]
                ? config.parse[key](value)
                : value;

            return acc;
          }, {});
        }

        // Remove the matched segment from the remaining path
        remaining = remaining.replace(match[0], '');

        break;
      }
    }

    // If we hadn't matched any segments earlier, use the path as route name
    if (routeName === undefined) {
      const segments = remaining.split('/');

      routeName = decodeURIComponent(segments[0]);
      segments.shift();
      remaining = segments.join('/');
    }

    const state = {
      routes: [{ name: routeName, params }],
    };

    if (current) {
      // The state should be nested inside the route we parsed before
      current.routes[0].state = state;
    } else {
      result = state;
    }

    current = state;
  }

  if (current == null || result == null) {
    return undefined;
  }

  const query = path.split('?')[1];

  if (query) {
    const route = current.routes[0];

    const params = queryString.parse(query);
    const config = options[route.name]
      ? (options[route.name] as { parse?: ParseConfig }).parse
      : undefined;

    if (config) {
      Object.keys(params).forEach(name => {
        if (config[name] && typeof params[name] === 'string') {
          params[name] = config[name](params[name] as string);
        }
      });
    }

    route.params = { ...route.params, ...params };
  }

  return result;
}
