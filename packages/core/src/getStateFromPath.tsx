import escape from 'escape-string-regexp';
import queryString from 'query-string';
import { NavigationState, PartialState, InitialState } from './types';

type ParseConfig = Record<string, (value: string) => any>;

type Options = {
  [routeName: string]: string | { path: string; parse?: ParseConfig } | Options;
};

type RouteConfig = {
  match: RegExp;
  pattern: string;
  routeNames: string[];
  parse: ParseConfig | undefined;
};

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
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
): ResultState | undefined {
  // Create a normalized configs array which will be easier to use
  const configs = ([] as RouteConfig[]).concat(
    ...Object.keys(options).map(key => createNormalizedConfigs(key, options))
  );

  let result: PartialState<NavigationState> | undefined;
  let current: PartialState<NavigationState> | undefined;

  let remaining = path
    .replace(/[/]+/, '/') // Replace multiple slash (//) with single ones
    .replace(/^\//, '') // Remove extra leading slash
    .replace(/\?.*/, ''); // Remove query params which we will handle later

  while (remaining) {
    let routeNames;
    let params;

    // Go through all configs, and see if the next path segment matches our regex
    for (const config of configs) {
      const match = remaining.match(config.match);

      // If our regex matches, we need to extract params from the path
      if (match) {
        routeNames = config.routeNames;

        const paramPatterns = config.pattern
          .split('/')
          .filter(p => p.startsWith(':'));

        if (paramPatterns.length) {
          params = paramPatterns.reduce<Record<string, any>>((acc, p, i) => {
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
    if (routeNames === undefined) {
      const segments = remaining.split('/');

      routeNames = [decodeURIComponent(segments[0])];
      segments.shift();
      remaining = segments.join('/');
    }

    let state: InitialState;

    if (routeNames.length === 1) {
      state = {
        routes: [
          { name: routeNames.shift() as string, ...(params && { params }) },
        ],
      };
    } else {
      state = {
        routes: [{ name: routeNames.shift() as string, state: { routes: [] } }],
      };

      let helper = state.routes[0].state as InitialState;
      let routeName;

      while ((routeName = routeNames.shift())) {
        if (routeNames.length === 0) {
          helper.routes.push({
            name: routeName,
            ...(params && { params }),
          });
        } else {
          helper.routes[0] = {
            name: routeName,
            state: {
              routes: [],
            },
          };
          helper = helper.routes[0].state as InitialState;
        }
      }
    }

    if (current) {
      // The state should be nested inside the deepest route we parsed before
      while (current.routes[0].state) {
        current = current.routes[0].state;
      }

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
    while (current.routes[0].state) {
      // The query params apply to the deepest route
      current = current.routes[0].state;
    }

    const route = current.routes[0];

    const params = queryString.parse(query);
    const parseFunction = findParseConfigForRoute(route.name, options);

    if (parseFunction) {
      Object.keys(params).forEach(name => {
        if (parseFunction[name] && typeof params[name] === 'string') {
          params[name] = parseFunction[name](params[name] as string);
        }
      });
    }

    route.params = { ...route.params, ...params };
  }

  return result;
}

function createNormalizedConfigs(
  key: string,
  routeConfig: Options,
  routeNames: string[] = []
): RouteConfig[] {
  const configs = [];

  routeNames.push(key);

  const value = routeConfig[key];

  if (typeof value === 'string') {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    configs.push(createConfigItem(routeNames, value));
  } else if (typeof value === 'object') {
    // if an object is specified as the value (e.g. Foo: { ... }),
    // it could have config object and optionally nested config
    Object.keys(value).forEach(nestedKey => {
      if (nestedKey === 'path') {
        configs.push(
          createConfigItem(
            routeNames,
            value[nestedKey] as string,
            value.parse ? (value.parse as ParseConfig) : undefined
          )
        );
      } else if (nestedKey === 'parse') {
        // We handle custom parse function when a `path` is specified (in nestedKey === path)
      } else {
        // If the name of the key is not `path` or `parse`, it's a nested config for route
        // So we need to traverse into it and collect the configs
        const result = createNormalizedConfigs(
          nestedKey,
          routeConfig[key] as Options,
          routeNames
        );

        configs.push(...result);
      }
    });
  }

  routeNames.pop();

  return configs;
}

function createConfigItem(
  routeNames: string[],
  pattern: string,
  parse?: ParseConfig
): RouteConfig {
  const match = new RegExp(
    '^' + escape(pattern).replace(/:[a-z0-9]+/gi, '([^/]+)') + '/?'
  );

  return {
    match,
    pattern,
    // The routeNames array is mutated, so copy it to keep the current state
    routeNames: [...routeNames],
    parse,
  };
}

function findParseConfigForRoute(
  routeName: string,
  config: Options
): ParseConfig | undefined {
  if (config[routeName]) {
    return (config[routeName] as { parse?: ParseConfig }).parse;
  }

  for (const name in config) {
    if (typeof config[name] === 'object') {
      const parse = findParseConfigForRoute(routeName, config[name] as Options);

      if (parse) {
        return parse;
      }
    }
  }

  return undefined;
}
