import type {
  InitialState,
  NavigationState,
  ParamListBase,
  PartialState,
} from '@react-navigation/routers';
import escape from 'escape-string-regexp';
import * as queryString from 'query-string';

import { arrayStartsWith } from './arrayStartsWith';
import { findFocusedRoute } from './findFocusedRoute';
import { getPatternParts, type PatternPart } from './getPatternParts';
import { isArrayEqual } from './isArrayEqual';
import type { PathConfig, PathConfigMap } from './types';
import { validatePathConfig } from './validatePathConfig';

type Options<ParamList extends {}> = {
  path?: string;
  initialRouteName?: string;
  screens: PathConfigMap<ParamList>;
};

type ParseConfig = Record<string, (value: string) => unknown>;

type RouteConfig = {
  screen: string;
  regex?: RegExp;
  segments: string[];
  params: {
    screen: string;
    name: string;
    index: number;
    regex?: RegExp;
  }[];
  routeNames: string[];
  parse?: ParseConfig;
  explicitParamNames?: Set<string>;
  pathParamNames: Set<string>;
  hasNestedScreens: boolean;
};

type InitialRouteConfig = {
  initialRouteName: string;
  parentScreens: string[];
};

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

type ParsedRoute = {
  name: string;
  path?: string;
  params?: Record<string, unknown> | undefined;
};

type ConfigResources = {
  initialRoutes: InitialRouteConfig[];
  configs: RouteConfig[];
  configsByScreen: Record<string, RouteConfig[]>;
  prefixRegex?: RegExp;
};

const NESTED_SCREEN_PARAM_NAMES = [
  'screen',
  'params',
  'initial',
  'path',
  'merge',
  'pop',
];

const getStaticSegmentPattern = (segment: string) =>
  Array.from(segment, (char) => {
    const encoded = encodeURIComponent(char);
    const percentEncoded =
      encoded === char
        ? `%${char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()}`
        : encoded;

    return `(?:${escape(char)}|${escape(percentEncoded)})`;
  }).join('');

const getExplicitParamNames = (parse?: ParseConfig) => {
  const names = Object.entries(parse ?? {}).map(([name]) => name);

  return names.length ? new Set(names) : undefined;
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
  options?: Options<ParamList>
): ResultState | undefined {
  const { initialRoutes, configs, configsByScreen, prefixRegex } =
    getConfigResources(options);

  const screens = options?.screens;

  let remaining = path
    .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
    .replace(/^\//, '') // Remove extra leading slash
    .replace(/\?.*$/, '') // Remove query params which we will handle later
    .replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());

  // Make sure there is a trailing slash
  remaining = remaining.endsWith('/') ? remaining : `${remaining}/`;

  if (prefixRegex) {
    const prefixMatch = remaining.match(prefixRegex);

    if (prefixMatch == null) {
      return undefined;
    }

    remaining = remaining.slice(prefixMatch[0].length);
  }

  if (screens === undefined) {
    // When no config is specified, use the path segments as route names
    const routes: ParsedRoute[] = [];

    for (const segment of remaining.split('/')) {
      if (!segment) {
        continue;
      }

      try {
        routes.push({ name: decodeURIComponent(segment) });
      } catch {
        return undefined;
      }
    }

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
      return createNestedStateObject(
        path,
        match.routeNames.map((name) => ({ name })),
        initialRoutes,
        match
      );
    }

    return undefined;
  }

  // We match the whole path against the regex instead of segments
  // This makes sure matches such as wildcard will catch any unmatched routes, even if nested
  const firstRawSegment = remaining.split('/')[0];

  let firstDecodedSegment: string | undefined;

  try {
    firstDecodedSegment =
      firstRawSegment != null ? decodeURIComponent(firstRawSegment) : undefined;
  } catch {
    firstDecodedSegment = undefined;
  }

  const { routes, config } = matchAgainstConfigs(
    remaining,
    firstDecodedSegment,
    firstRawSegment,
    configs,
    configsByScreen
  );

  if (routes === undefined || config === undefined) {
    return undefined;
  }

  return createNestedStateObject(path, routes, initialRoutes, config);
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
  if (process.env.NODE_ENV !== 'production' && options) {
    validatePathConfig(options);
  }

  const initialRoutes = getInitialRoutes(options);
  const configs = getSortedNormalizedConfigs(initialRoutes, options?.screens);
  const prefix = options?.path?.replace(/^\//, '');

  let prefixRegex: RegExp | undefined;

  if (prefix) {
    const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    const prefixPattern = normalizedPrefix
      .split('/')
      .map(getStaticSegmentPattern)
      .join('/');

    prefixRegex = new RegExp(`^${prefixPattern}`);
  }

  const configsByScreen: Record<string, RouteConfig[]> = {};
  const configsByPattern = new Map<string, RouteConfig>();

  for (const c of configs) {
    (configsByScreen[c.screen] ??= []).push(c);

    const pattern = c.segments.join('/');
    const existing = configsByPattern.get(pattern);

    checkForDuplicatedConfigs(existing, c, pattern);
    configsByPattern.set(pattern, c);
  }

  return {
    initialRoutes,
    configs,
    configsByScreen,
    prefixRegex,
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
  screens: Record<string, string | PathConfig<ParamListBase>> = {}
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
        if (
          a.routeNames.length > b.routeNames.length &&
          arrayStartsWith(a.routeNames, b.routeNames)
        ) {
          return -1;
        }

        if (
          b.routeNames.length > a.routeNames.length &&
          arrayStartsWith(b.routeNames, a.routeNames)
        ) {
          return 1;
        }

        return a.routeNames.length - b.routeNames.length || a.order - b.order;
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
        // if b is longer, b gets higher priority
        if (a.segments[i] == null) {
          return 1;
        }

        // if a is longer, a gets higher priority
        if (b.segments[i] == null) {
          return -1;
        }

        const aWildCard = a.segments[i] === '*';
        const bWildCard = b.segments[i] === '*';
        const aParam = a.segments[i].startsWith(':');
        const bParam = b.segments[i].startsWith(':');
        const aRegex = aParam && a.segments[i].includes('(');
        const bRegex = bParam && b.segments[i].includes('(');

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

// Throw if two configs resolve to the same pattern but conflicting screens
function checkForDuplicatedConfigs(
  existing: RouteConfig | undefined,
  config: RouteConfig,
  pattern: string
) {
  if (!existing) {
    return;
  }

  const a = existing.routeNames;
  const b = config.routeNames;

  // It's not a problem if the path string omitted from a inner most screen
  // For example, it's ok if a path resolves to `A > B > C` or `A > B`
  const intersects =
    a.length > b.length ? arrayStartsWith(a, b) : arrayStartsWith(b, a);

  if (!intersects) {
    throw new Error(
      `Found conflicting screens with the same pattern. The pattern '${
        pattern
      }' resolves to both '${a.join(' > ')}' and '${b.join(
        ' > '
      )}'. Patterns must be unique and cannot resolve to more than one screen.`
    );
  }
}

const matchAgainstConfigs = (
  remaining: string,
  firstDecodedSegment: string | undefined,
  firstRawSegment: string | undefined,
  configs: RouteConfig[],
  configsByScreen: Record<string, RouteConfig[]>
) => {
  let routes: ParsedRoute[] | undefined;
  let remainingPath = remaining;
  let matchingConfig: RouteConfig | undefined;

  // Go through all configs, and see if the next path segment matches our regex
  for (const config of configs) {
    if (!config.regex) {
      continue;
    }

    if (
      !canMatchFirstSegment(
        config.segments[0],
        firstDecodedSegment,
        firstRawSegment
      )
    ) {
      continue;
    }

    const match = remainingPath.match(config.regex);

    // If our regex matches, we need to extract params from the path
    if (match) {
      const matchedRoutes: ParsedRoute[] = [];
      let hasInvalidParam = false;

      for (const routeName of config.routeNames) {
        // Check matching name AND pattern in case same screen is used at different levels in config
        const routeConfig = configsByScreen[routeName]?.find((c) =>
          arrayStartsWith(config.segments, c.segments)
        );

        let params: Record<string, unknown> | undefined;

        if (routeConfig && match.groups) {
          const paramEntries: [string, unknown][] = [];

          for (const param of routeConfig.params) {
            if (param.screen !== routeName) {
              continue;
            }

            const value = match.groups[`param_${param.index}`];

            if (value == null) {
              paramEntries.push([param.name, undefined]);
              continue;
            }

            let decoded: string;

            try {
              decoded = decodeURIComponent(value);
            } catch {
              hasInvalidParam = true;
              break;
            }

            if (
              param.regex &&
              value !== decoded &&
              !param.regex.test(decoded)
            ) {
              hasInvalidParam = true;
              break;
            }

            const parser = routeConfig.parse?.[param.name];

            paramEntries.push([param.name, parser ? parser(decoded) : decoded]);
          }

          if (hasInvalidParam) {
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

      if (hasInvalidParam) {
        continue;
      }

      routes = matchedRoutes;
      matchingConfig = config;
      remainingPath = remainingPath.replace(match[0], '');

      break;
    }
  }

  return { routes, remainingPath, config: matchingConfig };
};

const canMatchFirstSegment = (
  configSegment: string | undefined,
  decodedSegment: string | undefined,
  rawSegment: string | undefined
) => {
  if (decodedSegment === undefined) {
    return true;
  }

  if (configSegment === undefined) {
    return false;
  }

  if (configSegment === '*' || configSegment.startsWith(':')) {
    return true;
  }

  return configSegment === decodedSegment || configSegment === rawSegment;
};

const createNormalizedConfigs = (
  screen: string,
  routeConfig: Record<string, string | PathConfig<ParamListBase>>,
  initials: InitialRouteConfig[],
  paths: { screen: string; path: string }[],
  parentScreens: string[],
  routeNames: string[]
): RouteConfig[] => {
  const configs: RouteConfig[] = [];

  routeNames.push(screen);

  parentScreens.push(screen);

  const config = routeConfig[screen];

  if (typeof config === 'string') {
    paths.push({ screen, path: config });
    configs.push(createConfigItem(screen, [...routeNames], [...paths]));
  } else if (typeof config === 'object') {
    // if an object is specified as the value (e.g. Foo: { ... }),
    // it can have `path` property and
    // it could have `screens` prop which has nested configs
    const nestedScreens = config.screens;
    const hasNestedScreens = !!nestedScreens;

    if (typeof config.path === 'string') {
      if (config.exact && config.path == null) {
        throw new Error(
          `Screen '${screen}' doesn't specify a 'path'. A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. \`path: ''\`.`
        );
      }

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
                [...paths, { screen, path: alias }],
                config.parse,
                hasNestedScreens
              )
            );
          } else if (typeof alias === 'object') {
            aliasConfigs.push(
              createConfigItem(
                screen,
                [...routeNames],
                alias.exact
                  ? [{ screen, path: alias.path }]
                  : [...paths, { screen, path: alias.path }],
                alias.parse,
                hasNestedScreens
              )
            );
          }
        }
      }

      if (config.exact) {
        // If it's an exact path, we don't need to keep track of the parent screens
        // So we can clear it
        paths.length = 0;
      }

      paths.push({ screen, path: config.path });
      configs.push(
        createConfigItem(
          screen,
          [...routeNames],
          [...paths],
          config.parse,
          hasNestedScreens
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

    if (nestedScreens) {
      // property `initialRouteName` without `screens` has no purpose
      if (config.initialRouteName) {
        initials.push({
          initialRouteName: config.initialRouteName,
          parentScreens,
        });
      }

      Object.keys(nestedScreens).forEach((nestedConfig) => {
        const result = createNormalizedConfigs(
          nestedConfig,
          nestedScreens as Record<string, string | PathConfig<ParamListBase>>,
          initials,
          [...paths],
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
  paths: { screen: string; path: string }[],
  parse?: ParseConfig,
  hasNestedScreens = false
): RouteConfig => {
  const parts: (PatternPart & { screen: string })[] = [];

  // Parse the path string into parts for easier matching
  for (const { screen: pathScreen, path } of paths) {
    parts.push(
      ...getPatternParts(path).map((part) => ({ ...part, screen: pathScreen }))
    );
  }

  const regex = parts.length
    ? new RegExp(
        `^(${parts
          .map((it, i) => {
            if (it.param) {
              const reg = it.regex
                ? `(?:${it.regex})|(?=[^/]*%[0-9A-F]{2})[^/]+`
                : '[^/]+';

              return `(((?<param_${i}>${reg})\\/)${it.optional ? '?' : ''})`;
            }

            if (it.segment === '*') {
              return `.*\\/`;
            }

            return `${getStaticSegmentPattern(it.segment)}\\/`;
          })
          .join('')})$`
      )
    : undefined;

  const segments = parts.map((it) => it.segment);
  const params: RouteConfig['params'] = [];
  const pathParamNames = new Set<string>();

  for (const [index, part] of parts.entries()) {
    if (!part.param) {
      continue;
    }

    params.push({
      index,
      screen: part.screen,
      name: part.param,
      regex: part.regex ? new RegExp(`^(?:${part.regex})$`) : undefined,
    });

    if (part.screen === screen) {
      pathParamNames.add(part.param);
    }
  }

  return {
    screen,
    regex,
    segments,
    params,
    routeNames,
    parse,
    explicitParamNames: getExplicitParamNames(parse),
    pathParamNames,
    hasNestedScreens,
  };
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
        if (parentScreens[i].localeCompare(config.parentScreens[i]) !== 0) {
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
) => {
  let route = routes.shift() as ParsedRoute;
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

    while (nextRoute) {
      route = nextRoute;
      initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);

      const nestedStateIndex =
        nestedState.index || nestedState.routes.length - 1;

      nestedState.routes[nestedStateIndex].state = createStateObject(
        initialRoute,
        route,
        routes.length === 0
      );

      if (routes.length > 0) {
        nestedState = nestedState.routes[nestedStateIndex]
          .state as InitialState;
      }

      parentScreens.push(route.name);
      nextRoute = routes.shift();
    }
  }

  route = findFocusedRoute(state) as ParsedRoute;
  route.path = path.replace(/\/$/, '');

  const params = parseQueryParams(
    path,
    routeConfig?.parse,
    routeConfig?.pathParamNames,
    routeConfig?.explicitParamNames,
    routeConfig?.hasNestedScreens,
    route.params
  );

  if (params) {
    route.params = { ...route.params, ...params };
  }

  return state;
};

const parseQueryParams = (
  path: string,
  parseConfig?: ParseConfig,
  pathParamNames: Set<string> = new Set(),
  explicitParamNames?: Set<string>,
  hasNestedScreens = false,
  routeParams?: Record<string, unknown>
) => {
  const queryIndex = path.indexOf('?');
  const query = queryIndex === -1 ? undefined : path.slice(queryIndex + 1);
  const params: Record<string, unknown> = query ? queryString.parse(query) : {};

  for (const name of pathParamNames) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete params[name];
  }

  if (parseConfig) {
    Object.keys(params).forEach((name) => {
      if (
        Object.hasOwnProperty.call(parseConfig, name) &&
        typeof params[name] === 'string'
      ) {
        params[name] = parseConfig[name](params[name]);
      }
    });
  }

  if (
    hasNestedScreens &&
    !explicitParamNames?.has('screen') &&
    (typeof params.screen === 'string' ||
      typeof routeParams?.screen === 'string')
  ) {
    for (const name of NESTED_SCREEN_PARAM_NAMES) {
      if (!explicitParamNames?.has(name)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[name];
      }
    }
  }

  return Object.keys(params).length ? params : undefined;
};
