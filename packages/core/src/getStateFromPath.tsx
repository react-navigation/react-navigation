import escape from 'escape-string-regexp';
import queryString from 'query-string';
import {
  NavigationState,
  PartialState,
  InitialState,
} from '@react-navigation/routers';
import { PathConfig } from './types';

type ParseConfig = Record<string, (value: string) => any>;

type RouteConfig = {
  screen: string;
  regex?: RegExp;
  path: string;
  pattern: string;
  routeNames: string[];
  parse?: ParseConfig;
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
  options: PathConfig = {}
): ResultState | undefined {
  let initialRoutes: InitialRouteConfig[] = [];

  // Create a normalized configs array which will be easier to use
  const configs = ([] as RouteConfig[])
    .concat(
      ...Object.keys(options).map((key) =>
        createNormalizedConfigs(key, options, [], initialRoutes)
      )
    )
    .sort(
      (a, b) =>
        // Sort configs so the most exhaustive is always first to be chosen
        b.pattern.split('/').length - a.pattern.split('/').length
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
        config.path === '' &&
        config.routeNames.every(
          // Make sure that none of the parent configs have a non-empty path defined
          (name) => !configs.find((c) => c.screen === name)?.path
        )
    );

    if (match) {
      return createNestedStateObject(
        match.routeNames.map((name, i, self) => {
          if (i === self.length - 1) {
            return { name, params: parseQueryParams(path, match.parse) };
          }

          return { name };
        }),
        initialRoutes
      );
    }

    return undefined;
  }

  let result: PartialState<NavigationState> | undefined;
  let current: PartialState<NavigationState> | undefined;

  while (remaining) {
    let routeNames: string[] | undefined;
    let allParams: Record<string, any> | undefined;

    // Go through all configs, and see if the next path segment matches our regex
    for (const config of configs) {
      if (!config.regex) {
        continue;
      }

      const match = remaining.match(config.regex);

      // If our regex matches, we need to extract params from the path
      if (match) {
        routeNames = [...config.routeNames];

        const paramPatterns = config.pattern
          .split('/')
          .filter((p) => p.startsWith(':'));

        if (paramPatterns.length) {
          allParams = paramPatterns.reduce<Record<string, any>>((acc, p, i) => {
            const value = match![(i + 1) * 2].replace(/\//, ''); // The param segments appear every second item starting from 2 in the regex match result

            acc[p] = value;

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

    const state = createNestedStateObject(
      routeNames.map((name) => {
        const config = configs.find((c) => c.screen === name);

        let params: object | undefined;

        if (allParams && config?.path) {
          const pattern = config.path;

          if (pattern) {
            const paramPatterns = pattern
              .split('/')
              .filter((p) => p.startsWith(':'));

            if (paramPatterns.length) {
              params = paramPatterns.reduce<Record<string, any>>((acc, p) => {
                const key = p.replace(/^:/, '').replace(/\?$/, '');
                const value = allParams![p];

                if (value) {
                  acc[key] =
                    config.parse && config.parse[key]
                      ? config.parse[key](value)
                      : value;
                }

                return acc;
              }, {});
            }
          }
        }

        if (params && Object.keys(params).length) {
          return { name, params };
        }

        return { name };
      }),
      initialRoutes
    );

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

const joinPaths = (...paths: string[]): string =>
  ([] as string[])
    .concat(...paths.map((p) => p.split('/')))
    .filter(Boolean)
    .join('/');

const createNormalizedConfigs = (
  screen: string,
  routeConfig: PathConfig,
  routeNames: string[] = [],
  initials: InitialRouteConfig[],
  parentPattern?: string
): RouteConfig[] => {
  const configs: RouteConfig[] = [];

  routeNames.push(screen);

  const config = routeConfig[screen];

  if (typeof config === 'string') {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    const pattern = parentPattern ? joinPaths(parentPattern, config) : config;

    configs.push(createConfigItem(screen, routeNames, pattern, config));
  } else if (typeof config === 'object') {
    let pattern: string | undefined;

    // if an object is specified as the value (e.g. Foo: { ... }),
    // it can have `path` property and
    // it could have `screens` prop which has nested configs
    if (typeof config.path === 'string') {
      pattern =
        config.exact !== true && parentPattern
          ? joinPaths(parentPattern, config.path)
          : config.path;

      configs.push(
        createConfigItem(screen, routeNames, pattern, config.path, config.parse)
      );
    }

    if (config.screens) {
      // property `initialRouteName` without `screens` has no purpose
      if (config.initialRouteName) {
        initials.push({
          initialRouteName: config.initialRouteName,
          connectedRoutes: Object.keys(config.screens),
        });
      }

      Object.keys(config.screens).forEach((nestedConfig) => {
        const result = createNormalizedConfigs(
          nestedConfig,
          config.screens as PathConfig,
          routeNames,
          initials,
          pattern
        );

        configs.push(...result);
      });
    }
  }

  routeNames.pop();

  return configs;
};

const createConfigItem = (
  screen: string,
  routeNames: string[],
  pattern: string,
  path: string,
  parse?: ParseConfig
): RouteConfig => {
  // Normalize pattern to remove any leading, trailing slashes, duplicate slashes etc.
  pattern = pattern.split('/').filter(Boolean).join('/');

  const regex = pattern
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
    : undefined;

  return {
    screen,
    regex,
    pattern,
    path,
    // The routeNames array is mutated, so copy it to keep the current state
    routeNames: [...routeNames],
    parse,
  };
};

const findParseConfigForRoute = (
  routeName: string,
  flatConfig: RouteConfig[]
): ParseConfig | undefined => {
  for (const config of flatConfig) {
    if (routeName === config.routeNames[config.routeNames.length - 1]) {
      return config.parse;
    }
  }

  return undefined;
};

// Try to find an initial route connected with the one passed
const findInitialRoute = (
  routeName: string,
  initialRoutes: InitialRouteConfig[]
): string | undefined => {
  for (const config of initialRoutes) {
    if (config.connectedRoutes.includes(routeName)) {
      return config.initialRouteName === routeName
        ? undefined
        : config.initialRouteName;
    }
  }
  return undefined;
};

// returns state object with values depending on whether
// it is the end of state and if there is initialRoute for this level
const createStateObject = (
  initialRoute: string | undefined,
  routeName: string,
  params: Record<string, any> | undefined,
  isEmpty: boolean
): InitialState => {
  if (isEmpty) {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{ name: initialRoute }, { name: routeName as string, params }],
      };
    } else {
      return {
        routes: [{ name: routeName as string, params }],
      };
    }
  } else {
    if (initialRoute) {
      return {
        index: 1,
        routes: [
          { name: initialRoute },
          { name: routeName as string, params, state: { routes: [] } },
        ],
      };
    } else {
      return {
        routes: [{ name: routeName as string, params, state: { routes: [] } }],
      };
    }
  }
};

const createNestedStateObject = (
  routes: { name: string; params?: object }[],
  initialRoutes: InitialRouteConfig[]
) => {
  let state: InitialState;
  let route = routes.shift() as { name: string; params?: object };
  let initialRoute = findInitialRoute(route.name, initialRoutes);

  state = createStateObject(
    initialRoute,
    route.name,
    route.params,
    routes.length === 0
  );

  if (routes.length > 0) {
    let nestedState = state;

    while ((route = routes.shift() as { name: string; params?: object })) {
      initialRoute = findInitialRoute(route.name, initialRoutes);

      const nestedStateIndex =
        nestedState.index || nestedState.routes.length - 1;

      nestedState.routes[nestedStateIndex].state = createStateObject(
        initialRoute,
        route.name,
        route.params,
        routes.length === 0
      );

      if (routes.length > 0) {
        nestedState = nestedState.routes[nestedStateIndex]
          .state as InitialState;
      }
    }
  }

  return state;
};

const findFocusedRoute = (state: InitialState) => {
  let current: InitialState | undefined = state;

  while (current?.routes[current.index || 0].state) {
    // The query params apply to the deepest route
    current = current.routes[current.index || 0].state;
  }

  const route = (current as PartialState<NavigationState>).routes[
    current?.index || 0
  ];

  return route;
};

const parseQueryParams = (
  path: string,
  parseConfig?: Record<string, (value: string) => any>
) => {
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
};
