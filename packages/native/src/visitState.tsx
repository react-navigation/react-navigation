import type { InitialState } from '@react-navigation/core';

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const isInitialState = (value: unknown): value is InitialState =>
  isRecord(value) &&
  Array.isArray(value.routes) &&
  value.routes.every(
    (route) => isRecord(route) && typeof route.name === 'string'
  );

export const getScreenConfig = (screens: unknown, name: string) => {
  if (!isRecord(screens)) {
    return undefined;
  }

  const config = screens[name];

  return isRecord(config) ? config : undefined;
};

const configsWithStringify = new WeakMap<object, boolean>();

export const hasStringify = (screens: Record<string, unknown>): boolean => {
  let result = configsWithStringify.get(screens);

  if (result == null) {
    result = Object.values(screens).some(
      (config) =>
        isRecord(config) &&
        ((isRecord(config.stringify) &&
          Object.values(config.stringify).some(
            (value) => typeof value === 'function'
          )) ||
          (isRecord(config.screens) && hasStringify(config.screens)))
    );

    configsWithStringify.set(screens, result);
  }

  return result;
};

type VisitParams = (
  params: Record<string, unknown>,
  config: Record<string, unknown>
) => void;

type Visited = WeakMap<object, WeakSet<object>>;

const markVisited = (visited: Visited, target: object, config: object) => {
  let configs = visited.get(target);

  if (configs == null) {
    configs = new WeakSet();
    visited.set(target, configs);
  }

  if (configs.has(config)) {
    return false;
  }

  configs.add(config);

  return true;
};

function visitParams(
  params: Record<string, unknown>,
  config: Record<string, unknown>,
  visit: VisitParams,
  visited: Visited
): void {
  if (!markVisited(visited, params, config)) {
    return;
  }

  visit(params, config);

  const screens = config.screens;

  if (!isRecord(screens)) {
    return;
  }

  if (isInitialState(params.state)) {
    visitState(params.state, screens, visit, visited);
  } else if (typeof params.screen === 'string') {
    const nestedConfig = getScreenConfig(screens, params.screen);

    if (nestedConfig != null && isRecord(params.params)) {
      visitParams(params.params, nestedConfig, visit, visited);
    }
  }
}

export function visitState(
  state: unknown,
  screens: unknown,
  visit: VisitParams,
  visited: Visited = new WeakMap()
): void {
  if (
    !isRecord(state) ||
    !isRecord(screens) ||
    !markVisited(visited, state, screens) ||
    !Array.isArray(state.routes)
  ) {
    return;
  }

  const configsByRouteKey = new Map<string, Record<string, unknown>>();

  for (const route of state.routes) {
    if (!isRecord(route) || typeof route.name !== 'string') {
      continue;
    }

    const config = getScreenConfig(screens, route.name);

    if (config == null) {
      continue;
    }

    if (typeof route.key === 'string') {
      configsByRouteKey.set(route.key, config);
    }

    if (isRecord(route.params)) {
      visitParams(route.params, config, visit, visited);
    }

    if (Array.isArray(route.history)) {
      for (const entry of route.history) {
        if (
          isRecord(entry) &&
          entry.type === 'params' &&
          isRecord(entry.params)
        ) {
          visitParams(entry.params, config, visit, visited);
        }
      }
    }

    visitState(route.state, config.screens, visit, visited);
  }

  if (Array.isArray(state.history)) {
    for (const entry of state.history) {
      if (
        isRecord(entry) &&
        entry.type === 'route' &&
        typeof entry.key === 'string' &&
        isRecord(entry.params)
      ) {
        const config = configsByRouteKey.get(entry.key);

        if (config != null) {
          visitParams(entry.params, config, visit, visited);
        }
      }
    }
  }
}
