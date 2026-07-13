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

type SerializedParamValue = string | string[] | null;

type ConfigItem = {
  parts?: PatternPart[] | undefined;
  ownParts: PatternPart[];
  stringify?: StringifyConfig | undefined;
  screens?: Record<string, ConfigItem> | undefined;
};

const serializeParamValue = (value: unknown): SerializedParamValue =>
  value === null
    ? null
    : Array.isArray(value)
      ? value.map(String)
      : String(value);

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
  state: State,
  configs: Record<string, ConfigItem> | undefined,
  getRouteState: (
    route: State['routes'][number],
    config: ConfigItem | undefined
  ) => State | undefined
): { name: string; params?: object | undefined } => {
  const route =
    typeof state.index === 'number'
      ? state.routes[state.index]
      : state.routes[state.routes.length - 1];

  if (route == null) {
    throw new Error(`Couldn't find the active route.`);
  }

  const config = configs?.[route.name];
  const routeState = getRouteState(route, config);

  if (routeState) {
    return getActiveRoute(routeState, config?.screens, getRouteState);
  }

  return route;
};

const cachedNormalizedConfigs = new WeakMap<
  Options<{}>,
  Record<string, ConfigItem>
>();

const getNormalizedConfigs = (options?: Options<{}>) => {
  if (!options) {
    return {};
  }

  const cached = cachedNormalizedConfigs.get(options);

  if (cached) {
    return cached;
  }

  validatePathConfig(options);

  const normalizedConfigs = createNormalizedConfigs(options.screens);

  cachedNormalizedConfigs.set(options, normalizedConfigs);

  return normalizedConfigs;
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
    throw new Error(
      `Got '${String(state)}' for the navigation state. You must pass a valid state object.`
    );
  }

  const configs = getNormalizedConfigs(options);
  const cachedRouteStates = new Map<object, State | undefined>();

  const getRouteState = (
    route: State['routes'][number],
    config: ConfigItem | undefined
  ) => {
    if (route.state) {
      return route.state;
    }

    const hasScreenParams =
      route.params &&
      'screen' in route.params &&
      typeof route.params.screen === 'string' &&
      config?.screens?.[route.params.screen];

    const hasStateParams =
      route.params && 'state' in route.params && config?.screens;

    if (
      !route.params ||
      !config?.screens ||
      (!hasScreenParams && !hasStateParams)
    ) {
      return undefined;
    }

    if (!cachedRouteStates.has(route)) {
      cachedRouteStates.set(route, getStateFromRouteParams(route.params));
    }

    return cachedRouteStates.get(route);
  };

  const focusedRoute = getActiveRoute(state, configs, getRouteState);

  let path = '/';
  let current: State | undefined = state;

  while (current) {
    let index: number = typeof current.index === 'number' ? current.index : 0;

    const initialRoute: State['routes'][number] | undefined =
      current.routes[index];

    if (initialRoute == null) {
      throw new Error(`Couldn't find a route at index ${index}.`);
    }

    let route: State['routes'][number] = initialRoute;

    let parts: PatternPart[] | undefined;

    // Values for each pattern part object, so the same param name
    // at different nesting levels gets the value from its own level
    const partValues = new Map<PatternPart, SerializedParamValue | undefined>();

    let focusedParams: Record<string, SerializedParamValue> | undefined;
    let currentOptions = configs;

    // Keep all the route names that appeared during going deeper in config in case the pattern is resolved to undefined
    const nestedRouteNames = [];

    let hasNext = true;

    while (hasNext) {
      const config = currentOptions[route.name];

      if (config == null) {
        break;
      }

      parts = config.parts;

      const ownParts = config.ownParts;

      nestedRouteNames.push(route.name);

      if (route.params) {
        const options = config;
        const params = route.params as Record<string, unknown>;
        const currentParams: Record<string, SerializedParamValue> = {};

        for (const key in params) {
          const value = params[key];

          if (value === undefined) {
            let optional = false;

            for (const part of ownParts) {
              if (part.param === key) {
                optional = part.optional === true;
                break;
              }
            }

            if (optional) {
              continue;
            }
          }

          const stringify = options.stringify?.[key];

          currentParams[key] = stringify
            ? stringify(value)
            : serializeParamValue(value);
        }

        const claimedParams = new Set<string>();

        for (const part of ownParts) {
          if (part.param && part.param in currentParams) {
            const value = currentParams[part.param];

            if (value !== undefined) {
              partValues.set(part, value);
              claimedParams.add(part.param);
            }
          }
        }

        if (focusedRoute === route) {
          // If this is the focused route, keep the params for later use
          // We save it here since it's been stringified already
          // Params claimed by the pattern shouldn't be repeated in the query string
          focusedParams = {};

          for (const key in currentParams) {
            const value = currentParams[key];

            if (
              !claimedParams.has(key) &&
              value !== undefined &&
              value !== 'undefined'
            ) {
              focusedParams[key] = value;
            }
          }
        }
      }

      for (const part of ownParts) {
        if (part.param && !partValues.has(part)) {
          partValues.set(part, undefined);
        }
      }

      // If there is no `screens` property or no nested state, we return pattern
      const routeState = getRouteState(route, config);

      if (!config.screens || routeState == null) {
        hasNext = false;
      } else {
        index =
          typeof routeState.index === 'number'
            ? routeState.index
            : routeState.routes.length - 1;

        const nextRoute: State['routes'][number] | undefined =
          routeState.routes[index];

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

    const routeState = getRouteState(route, currentOptions[route.name]);

    if (currentOptions[route.name] != null) {
      if (parts) {
        let index = 0;

        for (const part of parts) {
          const { segment, param, optional } = part;

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
            const value = partValues.get(part);

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
        const value = serializeParamValue(params[key]);

        if (value !== 'undefined') {
          focusedParams[key] = value;
        }
      }
    }

    if (routeState) {
      path += '/';
    } else if (focusedParams) {
      const query = queryString.stringify(focusedParams, { sort: false });

      if (query) {
        path += `?${query}`;
      }
    }

    current = routeState;
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
    const ownParts = getPatternParts(config);

    if (parentParts) {
      return { parts: [...parentParts, ...ownParts], ownParts };
    }

    return { parts: ownParts, ownParts };
  }

  if (config.exact && config.path === undefined) {
    throw new Error(
      "A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`."
    );
  }

  // If an object is specified as the value (e.g. Foo: { ... }),
  // It can have `path` property and `screens` prop which has nested configs
  const ownParts = config.path ? getPatternParts(config.path) : [];
  const parts =
    config.exact !== true
      ? [...(parentParts || []), ...ownParts]
      : ownParts.length
        ? ownParts
        : undefined;

  const screens =
    'screens' in config && config.screens
      ? createNormalizedConfigs(config.screens, parts)
      : undefined;

  return {
    parts,
    ownParts,
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
