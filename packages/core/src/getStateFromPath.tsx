import type {
  InitialState,
  NavigationState,
  PartialState,
} from '@react-navigation/routers';
import escape from 'escape-string-regexp';
import queryString from 'query-string';

import { arrayStartsWith } from './arrayStartsWith';
import { findFocusedRoute } from './findFocusedRoute';
import {
  combinePatternParts,
  getPatternParts,
  type PatternPart,
} from './getPatternParts';
import { isArrayEqual } from './isArrayEqual';
import type { PathConfig, PathConfigMap } from './types';
import type {
  StandardSchemaV1,
  StandardSchemaValidationResult,
} from './utilities';
import { validatePathConfig } from './validatePathConfig';

type Options<ParamList extends {}> = {
  path?: string | undefined;
  initialRouteName?: string | undefined;
  screens: PathConfigMap<ParamList>;
};

type ParseConfigValue =
  | ((value: string) => unknown)
  | StandardSchemaV1<unknown, unknown>;

type ParseConfig = Record<string, ParseConfigValue | undefined>;

type RouteConfig = {
  screen: string;
  order: number;
  regex?: RegExp | undefined;
  segments: string[];
  params: { screen: string; name?: string | undefined; index: number }[];
  routeNames: string[];
  parse?: ParseConfig | undefined;
  explicitParamNames?: Set<string> | undefined;
  hasNestedScreens: boolean;
  shared: boolean;
};

type InitialRouteConfig = {
  initialRouteName: string;
  parentScreens: string[];
};

type ResultState = PartialState<NavigationState> & {
  state?: ResultState | undefined;
};

type ParsedRoute = {
  name: string;
  path?: string | undefined;
  params?: Record<string, unknown> | undefined;
};

type RoutePatternPart = PatternPart & { screen: string };

type ConfigResources = {
  initialRoutes: InitialRouteConfig[];
  configs: RouteConfig[];
  configsByScreen: Record<string, RouteConfig[]>;
  configsByPattern: Record<string, RouteConfig[]>;
};

const INVALID_SCHEMA_RESULT_ERROR =
  'Invalid validation result from schema. It should be an object with either "value" or "issues" property and cannot be asynchronous.';

const INVALID_PARSER_ERROR =
  'Invalid parser. Expected a function or a Standard Schema V1 object.';

const PARAM_GROUP_PREFIX = 'param_';

const NESTED_SCREEN_PARAM_NAMES = [
  'screen',
  'params',
  'initial',
  'path',
  'merge',
  'pop',
];

const getExplicitParamNames = (parse?: ParseConfig) => {
  const names = Object.entries(parse ?? {})
    .filter(([, parser]) => parser != null)
    .map(([name]) => name);

  return names.length ? new Set(names) : undefined;
};

const getStandardSchema = (parser: ParseConfigValue) => {
  if (
    '~standard' in parser &&
    typeof parser['~standard'] === 'object' &&
    parser['~standard'] !== null &&
    'version' in parser['~standard'] &&
    parser['~standard'].version === 1 &&
    'validate' in parser['~standard'] &&
    typeof parser['~standard'].validate === 'function'
  ) {
    return parser['~standard'];
  }

  return undefined;
};

const getValidationResult = (
  schema: StandardSchemaV1<unknown, unknown>['~standard'],
  value: unknown
): StandardSchemaValidationResult<unknown> => {
  const result = schema.validate(value);

  if (
    result != null &&
    typeof result === 'object' &&
    ('value' in result || ('issues' in result && Array.isArray(result.issues)))
  ) {
    return result;
  }

  throw new Error(INVALID_SCHEMA_RESULT_ERROR);
};

/**
 * Utility to parse a path string to initial state object accepted by the container.
 * This is useful for deep linking when we need to handle the incoming URL.
 *
 * @example
 * ```js
 * getStateFromPath(
 *   '/chat/jane/42',
 *   {
 *     screens: {
 *       Chat: {
 *         path: 'chat/:author/:id',
 *         parse: { id: Number }
 *       }
 *     }
 *   }
 * )
 * ```
 * @param path Path string to parse and convert, e.g. /foo/bar?count=42.
 * @param options Extra options to fine-tune how to parse the path.
 */
export function getStateFromPath<ParamList extends {}>(
  path: string,
  options?: Options<ParamList>,
  previous?: NavigationState
): ResultState | undefined {
  const { initialRoutes, configs, configsByScreen, configsByPattern } =
    getConfigResources(options);

  const screens = options?.screens;

  // When a matched config is shared, the same pattern can resolve to multiple branches
  // pick the one that best matches the current navigation state
  const resolveSharedConfig = (config: RouteConfig) => {
    if (config.shared) {
      const candidates = configsByPattern[config.segments.join('/')];

      if (candidates) {
        return selectSharedConfig(config, candidates, previous, initialRoutes);
      }
    }

    return config;
  };

  let remaining = path
    .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
    .replace(/^\//, '') // Remove extra leading slash
    .replace(/\?.*$/, ''); // Remove query params which we will handle later

  // Make sure there is a trailing slash
  remaining = remaining.endsWith('/') ? remaining : `${remaining}/`;

  const prefix = options?.path?.replace(/^\//, ''); // Remove extra leading slash

  if (prefix) {
    // Make sure there is a trailing slash
    const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

    // If the path doesn't start with the prefix, it's not a match
    if (!remaining.startsWith(normalizedPrefix)) {
      return undefined;
    }

    // Remove the prefix from the path
    remaining = remaining.replace(normalizedPrefix, '');
  }

  const decodedSegments: string[] = [];

  for (const segment of remaining.split('/')) {
    if (!segment) {
      continue;
    }

    try {
      decodedSegments.push(decodeURIComponent(segment));
    } catch {
      return undefined;
    }
  }

  if (screens === undefined) {
    // When no config is specified, use the path segments as route names
    const routes = decodedSegments.map((name) => ({ name }));

    if (routes.length) {
      return createNestedStateObject(path, routes, initialRoutes);
    }

    return undefined;
  }

  if (remaining === '/') {
    // We need to add special handling of empty path so navigation to empty path also works
    // When handling empty path, we should only look at the root level config
    const match = configs.find((config) => config.segments.join('/') === '');

    if (match) {
      const config = resolveSharedConfig(match);

      return createNestedStateObject(
        path,
        config.routeNames.map((name) => ({ name })),
        initialRoutes,
        config
      );
    }

    return undefined;
  }

  // We match the whole path against the regex instead of segments
  // This makes sure matches such as wildcard will catch any unmatched routes, even if nested
  for (const config of configs) {
    const routes = matchAgainstConfig(remaining, config, configsByScreen);

    if (routes === undefined) {
      continue;
    }

    let selectedConfig = resolveSharedConfig(config);
    let selectedRoutes = routes;

    if (selectedConfig !== config) {
      const rematchedRoutes = matchAgainstConfig(
        remaining,
        selectedConfig,
        configsByScreen
      );

      if (rematchedRoutes === undefined) {
        selectedConfig = config;
      } else {
        selectedRoutes = rematchedRoutes;
      }
    }

    const state = createNestedStateObject(
      path,
      selectedRoutes,
      initialRoutes,
      selectedConfig
    );

    if (state !== undefined) {
      return state;
    }
  }

  return undefined;
}

/**
 * Reference to the last used config resources. This is used to avoid recomputing the config resources when the options are the same.
 */
const cachedConfigResources = new WeakMap<Options<{}>, ConfigResources>();

function getConfigResources<ParamList extends {}>(
  options: Options<ParamList> | undefined
) {
  if (!options) return prepareConfigResources();

  const cached = cachedConfigResources.get(options);

  if (cached) return cached;

  const resources = prepareConfigResources(options);

  cachedConfigResources.set(options, resources);

  return resources;
}

function prepareConfigResources(options?: Options<{}>) {
  if (options) {
    validatePathConfig(options);
  }

  const initialRoutes = getInitialRoutes(options);
  const configs = getSortedNormalizedConfigs(initialRoutes, options?.screens);

  checkForDuplicatedConfigs(configs);

  const configsByScreen: Record<string, RouteConfig[]> = {};
  const configsByPattern: Record<string, RouteConfig[]> = {};

  for (const c of configs) {
    (configsByScreen[c.screen] ??= []).push(c);
    (configsByPattern[c.segments.join('/')] ??= []).push(c);
  }

  return {
    initialRoutes,
    configs,
    configsByScreen,
    configsByPattern,
  };
}

function getInitialRoutes(options?: Options<{}>) {
  const initialRoutes: InitialRouteConfig[] = [];

  if (options?.initialRouteName) {
    initialRoutes.push({
      initialRouteName: options.initialRouteName,
      parentScreens: [],
    });
  }

  return initialRoutes;
}

function getSortedNormalizedConfigs(
  initialRoutes: InitialRouteConfig[],
  screens: Record<string, string | PathConfig<{}>> = {}
) {
  // Create a normalized configs array which will be easier to use
  return ([] as RouteConfig[])
    .concat(
      ...Object.keys(screens).map((key) =>
        createNormalizedConfigs(key, screens, initialRoutes, [], [], [])
      )
    )
    .map((config, order) => ({ ...config, order }))
    .sort((a, b) => {
      // Sort config from most specific to least specific:
      // - more segments
      // - static segments
      // - params with regex
      // - regular params
      // - wildcard

      // If 2 patterns are same, move the one with less route names up
      // This is an error state, so it's only useful for consistent error messages
      if (isArrayEqual(a.segments, b.segments)) {
        return b.routeNames.join('>').localeCompare(a.routeNames.join('>'));
      }

      // If one of the patterns starts with the other, it's more exhaustive
      // So move it up
      if (arrayStartsWith(a.segments, b.segments)) {
        return -1;
      }

      if (arrayStartsWith(b.segments, a.segments)) {
        return 1;
      }

      for (let i = 0; i < Math.max(a.segments.length, b.segments.length); i++) {
        const aSegment = a.segments[i];
        const bSegment = b.segments[i];

        // if b is longer, b gets higher priority
        if (aSegment == null) {
          return 1;
        }

        // if a is longer, a gets higher priority
        if (bSegment == null) {
          return -1;
        }

        const aWildCard = aSegment === '*';
        const bWildCard = bSegment === '*';
        const aParam = aSegment.startsWith(':');
        const bParam = bSegment.startsWith(':');
        const aRegex = aParam && aSegment.includes('(');
        const bRegex = bParam && bSegment.includes('(');

        // if both are wildcard or regex, we compare next component
        if ((aWildCard && bWildCard) || (aRegex && bRegex)) {
          continue;
        }

        // if only a is wildcard, b gets higher priority
        if (aWildCard && !bWildCard) {
          return 1;
        }

        // if only b is wildcard, a gets higher priority
        if (bWildCard && !aWildCard) {
          return -1;
        }

        // If only a has a param, b gets higher priority
        if (aParam && !bParam) {
          return 1;
        }

        // If only b has a param, a gets higher priority
        if (bParam && !aParam) {
          return -1;
        }

        // if only a has regex, a gets higher priority
        if (aRegex && !bRegex) {
          return -1;
        }

        // if only b has regex, b gets higher priority
        if (bRegex && !aRegex) {
          return 1;
        }
      }

      return a.segments.length - b.segments.length;
    });
}

function checkForDuplicatedConfigs(configs: RouteConfig[]) {
  // Check for duplicate patterns in the config
  configs.reduce<Record<string, RouteConfig>>((acc, config) => {
    const pattern = config.segments.join('/');

    if (acc[pattern]) {
      const a = acc[pattern].routeNames;
      const b = config.routeNames;

      // It's not a problem if the path string omitted from a inner most screen
      // For example, it's ok if a path resolves to `A > B > C` or `A > B`
      const intersects =
        a.length > b.length
          ? b.every((it, i) => a[i] === it)
          : a.every((it, i) => b[i] === it);

      if (!intersects && (!acc[pattern].shared || !config.shared)) {
        throw new Error(
          `Found conflicting screens with the same pattern. The pattern '${
            pattern
          }' resolves to both '${a.join(' > ')}' and '${b.join(
            ' > '
          )}'. Patterns must be unique and cannot resolve to more than one screen unless shared: true is specified.`
        );
      }
    }

    return Object.assign(acc, {
      [pattern]: config,
    });
  }, {});
}

const matchAgainstConfig = (
  remaining: string,
  config: RouteConfig,
  configsByScreen: Record<string, RouteConfig[]>
) => {
  if (!config.regex) {
    return undefined;
  }

  const match = remaining.match(config.regex);

  if (!match) {
    return undefined;
  }

  let validationFailed = false;
  const matchedRoutes: ParsedRoute[] = [];

  for (const [index, routeName] of config.routeNames.entries()) {
    // Check matching name, route names and pattern in case same screen is used
    // at different levels or branches in config
    const routeConfig = configsByScreen[routeName]?.find(
      (c) =>
        index === c.routeNames.length - 1 &&
        arrayStartsWith(config.routeNames, c.routeNames) &&
        arrayStartsWith(config.segments, c.segments)
    );

    let params: Record<string, unknown> | undefined;

    if (routeConfig && match.groups) {
      const paramEntries: [string, unknown][] = [];

      for (const [key, value] of Object.entries(match.groups)) {
        const index = Number(key.replace(PARAM_GROUP_PREFIX, ''));
        const param = routeConfig.params.find((it) => it.index === index);

        if (param?.screen !== routeName || !param.name) {
          continue;
        }

        if (value == null) {
          paramEntries.push([param.name, undefined]);
          continue;
        }

        let decoded: string;

        try {
          decoded = decodeURIComponent(value);
        } catch {
          return undefined;
        }

        const parser = routeConfig.parse?.[param.name];

        if (!parser) {
          paramEntries.push([param.name, decoded]);
          continue;
        }

        const schema = getStandardSchema(parser);

        if (schema) {
          const result = getValidationResult(schema, decoded);

          if (result.issues) {
            validationFailed = true;
            break;
          }

          paramEntries.push([param.name, result.value]);
          continue;
        }

        if (typeof parser === 'function') {
          paramEntries.push([param.name, parser(decoded)]);
          continue;
        }

        throw new Error(INVALID_PARSER_ERROR);
      }

      if (validationFailed) {
        // A failed param validation invalidates the whole nested route chain for this config.
        break;
      }

      if (paramEntries.length) {
        params = Object.fromEntries(paramEntries);
      }
    }

    if (params && Object.keys(params).length) {
      matchedRoutes.push({ name: routeName, params });
    } else {
      matchedRoutes.push({ name: routeName });
    }
  }

  if (validationFailed) {
    return undefined;
  }

  return matchedRoutes;
};

const createNormalizedConfigs = (
  screen: string,
  routeConfig: Record<string, string | PathConfig<{}>>,
  initials: InitialRouteConfig[],
  parts: RoutePatternPart[],
  parentScreens: string[],
  routeNames: string[]
): RouteConfig[] => {
  const configs: RouteConfig[] = [];

  routeNames.push(screen);

  parentScreens.push(screen);

  const config = routeConfig[screen];

  if (typeof config === 'string') {
    const configParts = combinePatternParts(
      parts,
      getPatternParts(config).map((part) => ({ ...part, screen }))
    );

    configs.push(createConfigItem(screen, [...routeNames], configParts));
  } else if (typeof config === 'object') {
    // if an object is specified as the value (e.g. Foo: { ... }),
    // it can have `path` property and
    // it could have `screens` prop which has nested configs
    const nestedScreens = 'screens' in config ? config.screens : undefined;
    const hasNestedScreens = !!nestedScreens;
    const currentParts =
      typeof config.path === 'string'
        ? combinePatternParts(
            parts,
            getPatternParts(config.path).map((part) => ({ ...part, screen })),
            config.exact
          )
        : parts;

    if (typeof config.path === 'string') {
      // We should add alias configs after the main config
      // So unless they are more specific, main config will be matched first
      const aliasConfigs = [];

      if (config.alias) {
        for (const alias of config.alias) {
          if (typeof alias === 'string') {
            aliasConfigs.push(
              createConfigItem(
                screen,
                [...routeNames],
                combinePatternParts(
                  parts,
                  getPatternParts(alias).map((part) => ({ ...part, screen }))
                ),
                config.parse,
                hasNestedScreens,
                false
              )
            );
          } else if (typeof alias === 'object') {
            aliasConfigs.push(
              createConfigItem(
                screen,
                [...routeNames],
                combinePatternParts(
                  parts,
                  getPatternParts(alias.path).map((part) => ({
                    ...part,
                    screen,
                  })),
                  alias.exact
                ),
                alias.parse,
                hasNestedScreens,
                alias.shared === true
              )
            );
          }
        }
      }

      configs.push(
        createConfigItem(
          screen,
          [...routeNames],
          currentParts,
          config.parse,
          hasNestedScreens,
          config.shared === true
        )
      );

      configs.push(...aliasConfigs);
    }

    if (
      typeof config !== 'string' &&
      typeof config.path !== 'string' &&
      config.alias?.length
    ) {
      throw new Error(
        `Screen '${screen}' doesn't specify a 'path'. A 'path' needs to be specified in order to use 'alias'.`
      );
    }

    if (hasNestedScreens) {
      // property `initialRouteName` without `screens` has no purpose
      if (
        'initialRouteName' in config &&
        typeof config.initialRouteName === 'string'
      ) {
        initials.push({
          initialRouteName: config.initialRouteName,
          parentScreens,
        });
      }

      Object.keys(nestedScreens).forEach((nestedConfig) => {
        const result = createNormalizedConfigs(
          nestedConfig,
          nestedScreens as Record<string, string | PathConfig<{}>>,
          initials,
          currentParts,
          [...parentScreens],
          routeNames
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
  parts: RoutePatternPart[],
  parse?: ParseConfig,
  hasNestedScreens = false,
  shared = false
): RouteConfig => {
  const regex = parts.length
    ? new RegExp(
        `^(${parts
          .map((it, i) => {
            if (it.param) {
              const reg = it.regex || '[^/]+';

              return `(((?<${PARAM_GROUP_PREFIX}${i}>${reg})\\/)${it.optional ? '?' : ''})`;
            }

            return `${it.segment === '*' ? '.*' : escape(it.segment)}\\/`;
          })
          .join('')})$`
      )
    : undefined;

  const segments = parts.map((it) => it.segment);
  const params = parts
    .map((it, i) =>
      it.param
        ? {
            index: i,
            screen: it.screen,
            name: it.param,
          }
        : null
    )
    .filter((it) => it != null);

  return {
    screen,
    order: 0,
    regex,
    segments,
    params,
    routeNames,
    parse,
    explicitParamNames: getExplicitParamNames(parse),
    hasNestedScreens,
    shared,
  };
};

const selectSharedConfig = (
  match: RouteConfig,
  candidates: RouteConfig[],
  previous: NavigationState | PartialState<NavigationState> | undefined,
  initialRoutes: InitialRouteConfig[]
) => {
  // Walk the previous state down to the focused leaf to get the active route path
  const focusedRouteNames: string[] = [];

  let current = previous;

  while (current?.routes.length) {
    const index =
      typeof current.index === 'number'
        ? current.index
        : current.routes.length - 1;

    const route = current.routes[index];

    if (route == null) {
      break;
    }

    focusedRouteNames.push(route.name);
    current = route.state;
  }

  // Rank a candidate by how far it aligns with the focused path, then by
  // how many of its levels match a configured initial route
  const score = (routeNames: string[]) => {
    let focused = 0;

    while (
      routeNames[focused] !== undefined &&
      routeNames[focused] === focusedRouteNames[focused]
    ) {
      focused++;
    }

    let initial = 0;

    for (const config of initialRoutes) {
      if (
        arrayStartsWith(routeNames, config.parentScreens) &&
        routeNames[config.parentScreens.length] === config.initialRouteName
      ) {
        initial++;
      }
    }

    return { focused, initial };
  };

  let selected = match;
  let best = { focused: -1, initial: -1 };

  for (const candidate of candidates) {
    if (!candidate.shared) {
      continue;
    }

    const { focused, initial } = score(candidate.routeNames);

    const better =
      focused !== best.focused
        ? focused > best.focused
        : initial !== best.initial
          ? initial > best.initial
          : candidate.order < selected.order;

    if (better) {
      selected = candidate;
      best = { focused, initial };
    }
  }

  return selected;
};

// Try to find an initial route connected with the one passed
const findInitialRoute = (
  routeName: string,
  parentScreens: string[],
  initialRoutes: InitialRouteConfig[]
): string | undefined => {
  for (const config of initialRoutes) {
    if (parentScreens.length === config.parentScreens.length) {
      let sameParents = true;
      for (let i = 0; i < parentScreens.length; i++) {
        const parentScreen = parentScreens[i];
        const configParentScreen = config.parentScreens[i];

        if (
          parentScreen == null ||
          configParentScreen == null ||
          parentScreen.localeCompare(configParentScreen) !== 0
        ) {
          sameParents = false;
          break;
        }
      }
      if (sameParents) {
        return routeName !== config.initialRouteName
          ? config.initialRouteName
          : undefined;
      }
    }
  }
  return undefined;
};

// returns state object with values depending on whether
// it is the end of state and if there is initialRoute for this level
const createStateObject = (
  initialRoute: string | undefined,
  route: ParsedRoute,
  isEmpty: boolean
): InitialState => {
  if (isEmpty) {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{ name: initialRoute }, route],
      };
    } else {
      return {
        routes: [route],
      };
    }
  } else {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{ name: initialRoute }, { ...route, state: { routes: [] } }],
      };
    } else {
      return {
        routes: [{ ...route, state: { routes: [] } }],
      };
    }
  }
};

const createNestedStateObject = (
  path: string,
  routes: ParsedRoute[],
  initialRoutes: InitialRouteConfig[],
  routeConfig?: RouteConfig
): InitialState | undefined => {
  let route = routes.shift();

  if (route == null) {
    return undefined;
  }

  const parentScreens: string[] = [];

  let initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);

  parentScreens.push(route.name);

  const state: InitialState = createStateObject(
    initialRoute,
    route,
    routes.length === 0
  );

  if (routes.length > 0) {
    let nestedState = state;

    let nextRoute = routes.shift();

    while (nextRoute != null) {
      route = nextRoute;
      initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);

      const nestedStateIndex =
        nestedState.index || nestedState.routes.length - 1;
      const nestedRoute = nestedState.routes[nestedStateIndex];

      if (nestedRoute == null) {
        throw new Error(`Couldn't find a route at index ${nestedStateIndex}.`);
      }

      nestedRoute.state = createStateObject(
        initialRoute,
        route,
        routes.length === 0
      );

      if (routes.length > 0) {
        if (nestedRoute.state == null) {
          throw new Error(
            `Couldn't find nested state for route '${route.name}'.`
          );
        }

        nestedState = nestedRoute.state;
      }

      parentScreens.push(route.name);
      nextRoute = routes.shift();
    }
  }

  const focusedRoute = findFocusedRoute(state);

  if (focusedRoute == null) {
    return undefined;
  }

  focusedRoute.path = path.replace(/\/$/, '');

  const pathParamNames = new Set(
    routeConfig?.params
      .filter(
        (param): param is { screen: string; name: string; index: number } =>
          param.screen === routeConfig.screen && typeof param.name === 'string'
      )
      .map((param) => param.name)
  );

  const queryParams = parseQueryParams(
    path,
    routeConfig?.parse,
    pathParamNames,
    routeConfig?.explicitParamNames,
    routeConfig?.hasNestedScreens,
    focusedRoute.params
  );

  if (!queryParams.valid) {
    return undefined;
  }

  if (queryParams.params) {
    focusedRoute.params = { ...focusedRoute.params, ...queryParams.params };
  }

  return state;
};

const parseQueryParams = (
  path: string,
  parseConfig?: ParseConfig,
  pathParamNames: Set<string> = new Set(),
  explicitParamNames?: Set<string>,
  hasNestedScreens = false,
  routeParams?: object
):
  | { valid: true; params?: Record<string, unknown> | undefined }
  | { valid: false } => {
  const query = path.split('?')[1];
  const params: Record<string, unknown> = query ? queryString.parse(query) : {};

  // Path params should always win over same-named query params.
  for (const name of pathParamNames) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete params[name];
  }

  if (parseConfig) {
    for (const [name, parser] of Object.entries(parseConfig)) {
      if (!parser || pathParamNames.has(name)) {
        continue;
      }

      const schema = getStandardSchema(parser);

      if (!Object.hasOwn(params, name)) {
        if (!schema) {
          continue;
        }

        const result = getValidationResult(schema, undefined);

        if (result.issues) {
          return { valid: false };
        }

        if (result.value !== undefined) {
          params[name] = result.value;
        }

        continue;
      }

      if (schema) {
        const result = getValidationResult(schema, params[name]);

        if (result.issues) {
          return { valid: false };
        }

        params[name] = result.value;
        continue;
      }

      const value = Array.isArray(params[name])
        ? params[name][0]
        : params[name];

      if (typeof value !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[name];
        continue;
      }

      if (typeof parser === 'function') {
        params[name] = parser(value);
        continue;
      }

      throw new Error(INVALID_PARSER_ERROR);
    }
  }

  if (
    hasNestedScreens &&
    !explicitParamNames?.has('screen') &&
    (typeof params.screen === 'string' ||
      (routeParams != null &&
        'screen' in routeParams &&
        typeof routeParams.screen === 'string'))
  ) {
    for (const name of NESTED_SCREEN_PARAM_NAMES) {
      if (!explicitParamNames?.has(name)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[name];
      }
    }
  }

  return {
    valid: true,
    params: Object.keys(params).length ? params : undefined,
  };
};
