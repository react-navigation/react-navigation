import type { NavigationState, PartialState } from '@react-navigation/routers';
import queryString from 'query-string';

import { getPatternParts, type PatternPart } from './getPatternParts';
import { getStateFromRouteParams } from './getStateFromRouteParams';
import type { PathConfig, PathConfigMap } from './types';
import { validatePathConfig } from './validatePathConfig';

type Options<ParamList extends {}> = {
  path?: string | undefined;
  initialRouteName?: string | undefined;
  screens: PathConfigMap<ParamList>;
};

type State = NavigationState | Omit<PartialState<NavigationState>, 'stale'>;

type StringifyConfig = Record<string, ((value: unknown) => string) | undefined>;

type ConfigItem = {
  parts?: PatternPart[] | undefined;
  stringify?: StringifyConfig | undefined;
  screens?: Record<string, ConfigItem> | undefined;
};

const encodePathParam = (value: string) => {
  let result = '';

  for (const char of value) {
    const charCode = char.charCodeAt(0);
    const safe =
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      (charCode >= 48 && charCode <= 57) ||
      "-._~!$&'()*+,;=:@".includes(char);

    result += safe ? char : encodeURIComponent(char);
  }

  return result;
};

const getActiveRoute = (
  state: State
): { name: string; params?: object | undefined } => {
  const route =
    typeof state.index === 'number'
      ? state.routes[state.index]
      : state.routes[state.routes.length - 1];

  if (route == null) {
    throw new Error(`Couldn't find the active route.`);
  }

  if (route.state) {
    return getActiveRoute(route.state);
  }

  return route;
};

const cachedNormalizedConfigs = new WeakMap<
  PathConfigMap<{}>,
  Record<string, ConfigItem>
>();

const getNormalizedConfigs = (options?: Options<{}>) => {
  if (!options?.screens) return {};

  const cached = cachedNormalizedConfigs.get(options?.screens);

  if (cached) return cached;

  const normalizedConfigs = createNormalizedConfigs(options.screens);

  cachedNormalizedConfigs.set(options.screens, normalizedConfigs);

  return normalizedConfigs;
};

const getTransformedState = (
  state: State,
  configs: Record<string, ConfigItem> | undefined
): Omit<PartialState<NavigationState>, 'stale'> => {
  const routes = state.routes.map(
    (route): Omit<PartialState<NavigationState>, 'stale'>['routes'][number] => {
      const config = configs?.[route.name];

      if (
        route.state ||
        (config?.screens &&
          route.params &&
          (('screen' in route.params &&
            typeof route.params.screen === 'string' &&
            config.screens[route.params.screen]) ||
            'state' in route.params))
      ) {
        const nestedState: State | undefined =
          route.state ?? getStateFromRouteParams(route.params);

        if (nestedState) {
          return {
            ...route,
            state: getTransformedState(
              nestedState,
              configs?.[route.name]?.screens
            ),
          };
        }
      }

      // @ts-expect-error route.state is handled in previous condition
      return route;
    }
  );

  return {
    ...state,
    routes,
  };
};

/**
 * Utility to serialize a navigation state object to a path string.
 *
 * @example
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
 *     screens: {
 *       Chat: {
 *         path: 'chat/:author/:id',
 *         stringify: { author: author => author.toLowerCase() }
 *       }
 *     }
 *   }
 * )
 * ```
 *
 * @param state Navigation state to serialize.
 * @param options Extra options to fine-tune how to serialize the path.
 * @returns Path representing the state, e.g. /foo/bar?count=42.
 */
export function getPathFromState<ParamList extends {}>(
  state: State,
  options?: Options<ParamList>
): string {
  if (state == null) {
    throw Error(
      `Got '${String(state)}' for the navigation state. You must pass a valid state object.`
    );
  }

  if (process.env.NODE_ENV !== 'production' && options) {
    validatePathConfig(options);
  }

  const configs = getNormalizedConfigs(options);
  const transformedState = getTransformedState(state, configs);

  let path = '/';
  let current: State | undefined = transformedState;

  const allParams: Record<string, string> = {};

  while (current) {
    let index: number = typeof current.index === 'number' ? current.index : 0;

    const initialRoute: State['routes'][number] | undefined =
      current.routes[index];

    if (initialRoute == null) {
      throw new Error(`Couldn't find a route at index ${index}.`);
    }

    let route: State['routes'][number] = initialRoute;

    let parts: PatternPart[] | undefined;

    let focusedParams: Record<string, string> | undefined;
    let currentOptions = configs;

    const focusedRoute = getActiveRoute(transformedState);

    // Keep all the route names that appeared during going deeper in config in case the pattern is resolved to undefined
    const nestedRouteNames = [];

    let hasNext = true;

    while (hasNext) {
      const config = currentOptions[route.name];

      if (config == null) {
        break;
      }

      parts = config.parts;

      nestedRouteNames.push(route.name);

      if (route.params) {
        const options = config;
        const params = route.params as Record<string, unknown>;
        const currentParams: Record<string, string> = {};

        for (const key in params) {
          const value = params[key];

          if (value === undefined) {
            let optional = false;

            for (const part of options.parts ?? []) {
              if (part.param === key) {
                optional = part.optional === true;
                break;
              }
            }

            if (optional) {
              continue;
            }
          }

          const stringify = options.stringify?.[key] ?? String;

          currentParams[key] = stringify(value);
        }

        if (parts?.length) {
          Object.assign(allParams, currentParams);
        }

        if (focusedRoute === route) {
          // If this is the focused route, keep the params for later use
          // We save it here since it's been stringified already
          focusedParams = {};

          for (const key in currentParams) {
            let inPattern = false;

            for (const part of parts ?? []) {
              if (part.param === key) {
                inPattern = true;
                break;
              }
            }

            const value = currentParams[key];

            if (!inPattern && value !== undefined && value !== 'undefined') {
              focusedParams[key] = value;
            }
          }
        }
      }

      // If there is no `screens` property or no nested state, we return pattern
      if (!config.screens || route.state == null) {
        hasNext = false;
      } else {
        index =
          typeof route.state.index === 'number'
            ? route.state.index
            : route.state.routes.length - 1;

        const nextRoute: State['routes'][number] | undefined =
          route.state.routes[index];

        if (nextRoute == null) {
          throw new Error(`Couldn't find a route at index ${index}.`);
        }

        const nestedConfig = config.screens;

        // if there is config for next route name, we go deeper
        if (nextRoute.name in nestedConfig) {
          route = nextRoute;
          currentOptions = nestedConfig;
        } else {
          // If not, there is no sense in going deeper in config
          hasNext = false;
        }
      }
    }

    if (currentOptions[route.name] != null) {
      if (parts) {
        let index = 0;

        for (const { segment, param, optional } of parts) {
          if (index > 0) {
            path += '/';
          }

          index++;

          // We don't know what to show for wildcard patterns
          // Showing the route name seems ok, though whatever we show here will be incorrect
          // Since the page doesn't actually exist
          if (segment === '*') {
            path += route.name;
            continue;
          }

          // If the path has a pattern for a param, put the param in the path
          if (param) {
            const value = allParams[param];

            if (value === undefined && optional) {
              // Optional params without value assigned in route.params should be ignored
              continue;
            }

            // Valid characters according to
            // https://datatracker.ietf.org/doc/html/rfc3986#section-3.3 (see pchar definition)
            path += encodePathParam(String(value));
            continue;
          }

          path += encodeURIComponent(segment);
        }
      }
    } else {
      path += encodeURIComponent(route.name);
    }

    if (!focusedParams && focusedRoute.params) {
      focusedParams = {};

      const params = focusedRoute.params as Record<string, unknown>;

      for (const key in params) {
        const value = String(params[key]);

        if (value !== 'undefined') {
          focusedParams[key] = value;
        }
      }
    }

    if (route.state) {
      path += '/';
    } else if (focusedParams) {
      const query = queryString.stringify(focusedParams, { sort: false });

      if (query) {
        path += `?${query}`;
      }
    }

    current = route.state;
  }

  // Include the root path if specified
  if (options?.path) {
    path = `${options.path}/${path}`;
  }

  // Remove multiple as well as trailing slashes
  path = path.replace(/\/+/g, '/');
  path = path.length > 1 ? path.replace(/\/$/, '') : path;

  // If path doesn't start with a slash, add it
  // This makes sure that history.pushState will update the path correctly instead of appending
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return path;
}

const createConfigItem = (
  config: PathConfig<{}> | string,
  parentParts?: PatternPart[]
): ConfigItem => {
  if (typeof config === 'string') {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    const parts = getPatternParts(config);

    if (parentParts) {
      return { parts: [...parentParts, ...parts] };
    }

    return { parts };
  }

  if (config.exact && config.path === undefined) {
    throw new Error(
      "A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`."
    );
  }

  // If an object is specified as the value (e.g. Foo: { ... }),
  // It can have `path` property and `screens` prop which has nested configs
  const parts =
    config.exact !== true
      ? [
          ...(parentParts || []),
          ...(config.path ? getPatternParts(config.path) : []),
        ]
      : config.path
        ? getPatternParts(config.path)
        : undefined;

  const screens =
    'screens' in config && config.screens
      ? createNormalizedConfigs(config.screens, parts)
      : undefined;

  return {
    parts,
    stringify: config.stringify,
    screens,
  };
};

const createNormalizedConfigs = (
  options: PathConfigMap<object>,
  parts?: PatternPart[]
): Record<string, ConfigItem> => {
  const configs: Record<string, ConfigItem> = {};
  const screens = options as Record<string, PathConfig<{}> | string>;

  for (const name in screens) {
    const config = screens[name];

    if (config !== undefined) {
      configs[name] = createConfigItem(config, parts);
    }
  }

  return configs;
};
