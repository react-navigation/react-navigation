import type {
  InitialState,
  NavigationState,
  PathConfigMap,
} from '@react-navigation/core';

import { checkSerializable } from './checkSerializable';
import { getStateBreadcrumb } from './getStateBreadcrumb';
import {
  getScreenConfig,
  hasStringify,
  isInitialState,
  isRecord,
  visitState,
} from './visitState';

type LinkingConfig<ParamList extends {}> = {
  screens?: PathConfigMap<ParamList> | undefined;
};

function stringifyParams(
  params: Record<string, unknown>,
  config: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...params };
  let hasStringifiedState = false;
  let hasStringifiedParams = false;

  if (isRecord(config.stringify)) {
    for (const key of Object.keys(config.stringify)) {
      const stringifier = config.stringify[key];

      if (typeof stringifier !== 'function' || !Object.hasOwn(params, key)) {
        continue;
      }

      const value: unknown = stringifier(params[key]);

      if (typeof value !== 'string') {
        throw new Error(
          `The linking stringifier for '${key}' must return a string.`
        );
      }

      result[key] = value;

      if (key === 'state') {
        hasStringifiedState = true;
      } else if (key === 'params') {
        hasStringifiedParams = true;
      }
    }
  }

  if (!isRecord(config.screens)) {
    return result;
  }

  if (isInitialState(params.state)) {
    if (!hasStringifiedState) {
      result.state = stringifyState(params.state, config.screens);
    }
  } else if (
    typeof params.screen === 'string' &&
    isRecord(params.params) &&
    !hasStringifiedParams
  ) {
    const nestedConfig = getScreenConfig(config.screens, params.screen);

    if (nestedConfig != null) {
      result.params = stringifyParams(params.params, nestedConfig);
    }
  }

  return result;
}

function stringifyState(
  state: Record<string, unknown>,
  screens: Record<string, unknown>
): Record<string, unknown> {
  if (!Array.isArray(state.routes)) {
    return state;
  }

  const configsByRouteKey = new Map<string, Record<string, unknown>>();

  const routes = state.routes.map((route) => {
    if (!isRecord(route) || typeof route.name !== 'string') {
      return route;
    }

    const config = getScreenConfig(screens, route.name);

    if (config == null) {
      return route;
    }

    if (typeof route.key === 'string') {
      configsByRouteKey.set(route.key, config);
    }

    const result = { ...route };

    if (isRecord(route.params)) {
      result.params = stringifyParams(route.params, config);
    }

    if (Array.isArray(route.history)) {
      result.history = route.history.map((entry) =>
        isRecord(entry) && entry.type === 'params' && isRecord(entry.params)
          ? { ...entry, params: stringifyParams(entry.params, config) }
          : entry
      );
    }

    if (
      isRecord(route.state) &&
      isRecord(config.screens) &&
      Array.isArray(route.state.routes)
    ) {
      result.state = stringifyState(route.state, config.screens);
    }

    return result;
  });

  const history = Array.isArray(state.history)
    ? state.history.map((entry) => {
        if (
          !isRecord(entry) ||
          entry.type !== 'route' ||
          typeof entry.key !== 'string' ||
          !isRecord(entry.params)
        ) {
          return entry;
        }

        const config = configsByRouteKey.get(entry.key);

        return config == null
          ? entry
          : { ...entry, params: stringifyParams(entry.params, config) };
      })
    : state.history;

  return {
    ...state,
    routes,
    history,
  };
}

const parseParam = (parser: unknown, value: unknown): unknown => {
  if (typeof parser === 'function') {
    return parser(value);
  }

  if (!isRecord(parser) || !isRecord(parser['~standard'])) {
    throw new Error('Invalid parser in the linking config.');
  }

  const schema = parser['~standard'];

  if (schema.version !== 1 || typeof schema.validate !== 'function') {
    throw new Error('Invalid parser in the linking config.');
  }

  const result: unknown = schema.validate(value);

  if (isRecord(result) && Array.isArray(result.issues)) {
    throw new Error('The persisted param did not pass the linking parser.');
  }

  if (isRecord(result) && 'value' in result) {
    return result.value;
  }

  throw new Error('Invalid validation result from the linking parser.');
};

const applyParsers = (
  params: Record<string, unknown>,
  config: Record<string, unknown>
) => {
  if (isRecord(config.parse)) {
    for (const key of Object.keys(config.parse)) {
      if (Object.hasOwn(params, key)) {
        params[key] = parseParam(config.parse[key], params[key]);
      }
    }
  }
};

export const serializer = {
  stringify<ParamList extends {}>(
    state: Readonly<NavigationState> | undefined,
    config?: LinkingConfig<ParamList>
  ): string | undefined {
    if (state === undefined) {
      return undefined;
    }

    const result = checkSerializable(state, config);

    if (!result.serializable) {
      const location = getStateBreadcrumb(state, result.location);

      throw new Error(
        `The navigation state contains a value that cannot be serialized at ${location || 'the root'} (${result.reason}).`
      );
    }

    const screens = config?.screens;

    return JSON.stringify(
      isRecord(screens) && hasStringify(screens)
        ? stringifyState(state, screens)
        : state
    );
  },

  parse<ParamList extends {}>(
    value: string | undefined,
    config?: LinkingConfig<ParamList>
  ): InitialState | undefined {
    if (value === undefined) {
      return undefined;
    }

    const state: unknown = JSON.parse(value);

    if (!isInitialState(state)) {
      throw new Error('The persisted navigation state is invalid.');
    }

    visitState(state, config?.screens, applyParsers);

    return state;
  },
};
