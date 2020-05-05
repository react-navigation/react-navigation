import escape from 'escape-string-regexp';
import queryString from 'query-string';
import {
  NavigationState,
  PartialState,
  InitialState,
} from '@react-navigation/routers';

type ParseConfig = Record<string, (value: string) => any>;

type Options = {
  [routeName: string]:
    | string
    | {
        path?: string;
        parse?: ParseConfig;
        screens?: Options;
        initialRouteName?: string;
      };
};

type RouteConfig = {
  screen: string;
  match: RegExp | null;
  pattern: string;
  routeNames: string[];
  parse: ParseConfig | undefined;
};

type InitialRouteConfig = {
  initialRouteName: string;
  connectedRoutes: string[];
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
  let initialRoutes: InitialRouteConfig[] = [];

  // Create a normalized configs array which will be easier to use
  const configs = ([] as RouteConfig[]).concat(
    ...Object.keys(options).map((key) =>
      createNormalizedConfigs(key, options, [], initialRoutes)
    )
  );

  // sort configs so the most exhaustive is always first to be chosen
  configs.sort(
    (config1, config2) =>
      config2.pattern.split('/').length - config1.pattern.split('/').length
  );

  let remaining = path
    .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
    .replace(/^\//, '') // Remove extra leading slash
    .replace(/\?.*$/, ''); // Remove query params which we will handle later

  // Make sure there is a trailing slash
  remaining = remaining.endsWith('/') ? remaining : `${remaining}/`;

  if (remaining === '/') {
    // We need to add special handling of empty path so navigation to empty path also works
    // When handling empty path, we should only look at the root level config
    const match = configs.find(
      (config) =>
        config.pattern === '' &&
        config.routeNames.every(
          // make sure that none of the parent configs have a non-empty path defined
          (name) => !configs.find((c) => c.screen === name)?.pattern
        )
    );

    if (match) {
      return createNestedStateObject(
        match.routeNames,
        initialRoutes,
        parseQueryParams(path, match.parse)
      );
    }

    return undefined;
  }

  let result: PartialState<NavigationState> | undefined;
  let current: PartialState<NavigationState> | undefined;

  while (remaining) {
    let routeNames: string[] | undefined;
    let params: Record<string, any> | undefined;

    // Go through all configs, and see if the next path segment matches our regex
    for (const config of configs) {
      if (!config.match) {
        continue;
      }

      const match = remaining.match(config.match);

      // If our regex matches, we need to extract params from the path
      if (match) {
        routeNames = [...config.routeNames];

        const paramPatterns = config.pattern
          .split('/')
          .filter((p) => p.startsWith(':'));

        if (paramPatterns.length) {
          params = paramPatterns.reduce<Record<string, any>>((acc, p, i) => {
            const key = p.replace(/^:/, '').replace(/\?$/, '');
            const value = match[(i + 1) * 2].replace(/\//, ''); // The param segments appear every second item starting from 2 in the regex match result

            if (value) {
              acc[key] =
                config.parse && config.parse[key]
                  ? config.parse[key](value)
                  : value;
            }

            return acc;
          }, {});
        }

        remaining = remaining.replace(match[1], '');

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

    const state = createNestedStateObject(routeNames, initialRoutes, params);

    if (current) {
      // The state should be nested inside the deepest route we parsed before
      while (current?.routes[current.index || 0].state) {
        current = current.routes[current.index || 0].state;
      }

      (current as PartialState<NavigationState>).routes[
        current?.index || 0
      ].state = state;
    } else {
      result = state;
    }

    current = state;
  }

  if (current == null || result == null) {
    return undefined;
  }

  const route = findFocusedRoute(current);
  const params = parseQueryParams(
    path,
    findParseConfigForRoute(route.name, configs)
  );

  if (params) {
    route.params = { ...route.params, ...params };
  }

  return result;
}

function createNormalizedConfigs(
  key: string,
  routeConfig: Options,
  routeNames: string[] = [],
  initials: InitialRouteConfig[]
): RouteConfig[] {
  const configs: RouteConfig[] = [];

  routeNames.push(key);

  const value = routeConfig[key];

  if (typeof value === 'string') {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    configs.push(createConfigItem(key, routeNames, value));
  } else if (typeof value === 'object') {
    // if an object is specified as the value (e.g. Foo: { ... }),
    // it can have `path` property and
    // it could have `screens` prop which has nested configs
    if (typeof value.path === 'string') {
      configs.push(createConfigItem(key, routeNames, value.path, value.parse));
    }

    if (value.screens) {
      // property `initialRouteName` without `screens` has no purpose
      if (value.initialRouteName) {
        initials.push({
          initialRouteName: value.initialRouteName,
          connectedRoutes: Object.keys(value.screens),
        });
      }
      Object.keys(value.screens).forEach((nestedConfig) => {
        const result = createNormalizedConfigs(
          nestedConfig,
          value.screens as Options,
          routeNames,
          initials
        );
        configs.push(...result);
      });
    }
  }

  routeNames.pop();

  return configs;
}

function createConfigItem(
  screen: string,
  routeNames: string[],
  pattern: string,
  parse?: ParseConfig
): RouteConfig {
  const match = pattern
    ? new RegExp(
        `^(${pattern
          .split('/')
          .map((it) => {
            if (it.startsWith(':')) {
              return `(([^/]+\\/)${it.endsWith('?') ? '?' : ''})`;
            }

            return `${escape(it)}\\/`;
          })
          .join('')})`
      )
    : null;

  return {
    screen,
    match,
    pattern,
    // The routeNames array is mutated, so copy it to keep the current state
    routeNames: [...routeNames],
    parse,
  };
}

function findParseConfigForRoute(
  routeName: string,
  flatConfig: RouteConfig[]
): ParseConfig | undefined {
  for (const config of flatConfig) {
    if (routeName === config.routeNames[config.routeNames.length - 1]) {
      return config.parse;
    }
  }
  return undefined;
}

// tries to find an initial route connected with the one passed
function findInitialRoute(
  routeName: string,
  initialRoutes: InitialRouteConfig[]
): string | undefined {
  for (const config of initialRoutes) {
    if (config.connectedRoutes.includes(routeName)) {
      return config.initialRouteName === routeName
        ? undefined
        : config.initialRouteName;
    }
  }
  return undefined;
}

// returns state object with values depending on whether
// it is the end of state and if there is initialRoute for this level
function createStateObject(
  initialRoute: string | undefined,
  routeName: string,
  isEmpty: boolean,
  params?: Record<string, any> | undefined
): InitialState {
  if (isEmpty) {
    if (initialRoute) {
      return {
        index: 1,
        routes: [
          { name: initialRoute },
          { name: routeName as string, ...(params && { params }) },
        ],
      };
    } else {
      return {
        routes: [{ name: routeName as string, ...(params && { params }) }],
      };
    }
  } else {
    if (initialRoute) {
      return {
        index: 1,
        routes: [
          { name: initialRoute },
          { name: routeName as string, state: { routes: [] } },
        ],
      };
    } else {
      return { routes: [{ name: routeName as string, state: { routes: [] } }] };
    }
  }
}

function createNestedStateObject(
  routeNames: string[],
  initialRoutes: InitialRouteConfig[],
  params: object | undefined
) {
  let state: InitialState;
  let routeName = routeNames.shift() as string;
  let initialRoute = findInitialRoute(routeName, initialRoutes);

  state = createStateObject(
    initialRoute,
    routeName,
    routeNames.length === 0,
    params
  );

  if (routeNames.length > 0) {
    let nestedState = state;

    while ((routeName = routeNames.shift() as string)) {
      initialRoute = findInitialRoute(routeName, initialRoutes);
      nestedState.routes[nestedState.index || 0].state = createStateObject(
        initialRoute,
        routeName,
        routeNames.length === 0,
        params
      );
      if (routeNames.length > 0) {
        nestedState = nestedState.routes[nestedState.index || 0]
          .state as InitialState;
      }
    }
  }

  return state;
}

function findFocusedRoute(state: InitialState) {
  let current: InitialState | undefined = state;

  while (current?.routes[current.index || 0].state) {
    // The query params apply to the deepest route
    current = current.routes[current.index || 0].state;
  }

  const route = (current as PartialState<NavigationState>).routes[
    current?.index || 0
  ];

  return route;
}

function parseQueryParams(
  path: string,
  parseConfig?: Record<string, (value: string) => any>
) {
  const query = path.split('?')[1];
  const params = queryString.parse(query);

  if (parseConfig) {
    Object.keys(params).forEach((name) => {
      if (parseConfig[name] && typeof params[name] === 'string') {
        params[name] = parseConfig[name](params[name] as string);
      }
    });
  }

  return Object.keys(params).length ? params : undefined;
}
