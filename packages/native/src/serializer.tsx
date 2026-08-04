import type {
  InitialState,
  NavigationState,
  PathConfig,
} from '@react-navigation/core';

const INVALID_STATE_ERROR =
  'Invalid navigation state. Expected an object with a routes array.';

const INVALID_PARSER_ERROR =
  'Invalid parser. Expected a function or a Standard Schema V1 object.';

type ParseConfig = NonNullable<PathConfig<Record<string, unknown>>['parse']>;

type StringifyConfig = NonNullable<
  PathConfig<Record<string, never>>['stringify']
>;

type ScreenConfig = {
  parse?: ParseConfig | undefined;
  screens?: Screens | undefined;
  stringify?: StringifyConfig | undefined;
};

type Screens = Record<string, ScreenConfig | string | undefined>;

type Config = { screens: Screens };

const getScreenConfig = (screens: Screens | undefined, name: string) => {
  const config = screens?.[name];

  return typeof config === 'string' ? undefined : config;
};

const isSerializable = (
  value: unknown,
  shallow = false,
  ancestors?: Set<object>
): boolean => {
  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'string'
  ) {
    return true;
  }

  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    !Object.is(value, -0)
  ) {
    return true;
  }

  const array = Array.isArray(value);

  if (typeof value !== 'object' || ancestors?.has(value)) {
    return false;
  }

  if (
    typeof Reflect.get(value, 'toJSON') === 'function' ||
    Object.getPrototypeOf(value) !==
      (array ? Array.prototype : Object.prototype)
  ) {
    return false;
  }

  const keys = array ? [] : Object.keys(value);

  if (
    Reflect.ownKeys(value).length !== (array ? value.length + 1 : keys.length)
  ) {
    return false;
  }

  if (shallow) {
    return true;
  }

  ancestors ??= new Set<object>();
  ancestors.add(value);

  if (array) {
    for (const item of value) {
      if (!isSerializable(item, false, ancestors)) {
        ancestors.delete(value);
        return false;
      }
    }
  } else {
    for (const key of keys) {
      const child = Reflect.get(value, key);

      if (!isSerializable(child, false, ancestors)) {
        ancestors.delete(value);
        return false;
      }
    }
  }

  ancestors.delete(value);

  return true;
};

const transformParams = (
  params: unknown,
  config: ParseConfig | StringifyConfig | undefined
) => {
  if (params !== undefined && (params === null || typeof params !== 'object')) {
    throw new Error(INVALID_STATE_ERROR);
  }

  if (config === undefined) {
    return params;
  }

  if (params !== undefined && !isSerializable(params, true)) {
    throw new Error('Non-serializable value in navigation state.');
  }

  let result: Record<string, unknown> | undefined =
    params === undefined ? undefined : { ...params };

  for (const name in config) {
    const transformer = config[name];
    const hasParam = params !== undefined && Object.hasOwn(params, name);

    if (transformer === undefined) {
      continue;
    }

    const hasStandardSchema =
      transformer !== null &&
      (typeof transformer === 'object' || typeof transformer === 'function') &&
      '~standard' in transformer;
    const schema = hasStandardSchema ? transformer['~standard'] : undefined;

    let value: unknown;

    if (!hasStandardSchema) {
      if (typeof transformer !== 'function') {
        throw new Error(INVALID_PARSER_ERROR);
      }

      if (!hasParam) {
        continue;
      }

      value = Reflect.apply(transformer, undefined, [result?.[name]]);
    } else {
      if (
        schema === null ||
        typeof schema !== 'object' ||
        schema.version !== 1 ||
        typeof schema.validate !== 'function'
      ) {
        throw new Error(INVALID_PARSER_ERROR);
      }

      const validation: unknown = Reflect.apply(schema.validate, schema, [
        result?.[name],
      ]);

      if (
        validation === null ||
        typeof validation !== 'object' ||
        (!('value' in validation) &&
          (!('issues' in validation) || !Array.isArray(validation.issues)))
      ) {
        throw new Error(
          'Invalid validation result from schema. It should be an object with either "value" or "issues" property and cannot be asynchronous.'
        );
      }

      if ('issues' in validation && Array.isArray(validation.issues)) {
        throw new Error('Failed to validate persisted navigation state.');
      }

      value = 'value' in validation ? validation.value : undefined;
    }

    if (value === undefined && !hasParam) {
      continue;
    }

    (result ??= {})[name] = value;
  }

  return result;
};

const transformStateHistory = (
  state: InitialState,
  screens: Screens | undefined,
  type: 'parse' | 'stringify'
) => {
  const history = state.history;

  if (history === undefined) {
    return history;
  }

  let result: unknown[] | undefined;

  for (const [index, entry] of history.entries()) {
    if (
      entry === null ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      !('type' in entry) ||
      entry.type !== 'route' ||
      !('key' in entry) ||
      typeof entry.key !== 'string'
    ) {
      continue;
    }

    const route = state.routes.find(
      (route) => 'key' in route && route.key === entry.key
    );
    const config =
      route === undefined
        ? undefined
        : getScreenConfig(screens, route.name)?.[type];

    const params = Reflect.get(entry, 'params');
    const transformedParams = transformParams(params, config);

    if (
      transformedParams === params &&
      (params !== undefined || !Object.hasOwn(entry, 'params'))
    ) {
      continue;
    }

    result ??= history.slice();
    const transformedEntry = { ...entry };

    if (transformedParams === undefined) {
      Reflect.deleteProperty(transformedEntry, 'params');
    } else {
      Reflect.set(transformedEntry, 'params', transformedParams);
    }

    result[index] = transformedEntry;
  }

  return result ?? history;
};

function stringifyState(
  state: NavigationState,
  screens: Screens | undefined,
  ancestors?: Set<object>
): NavigationState;
function stringifyState(
  state: InitialState,
  screens: Screens | undefined,
  ancestors?: Set<object>
): InitialState;
function stringifyState(
  state: InitialState,
  screens: Screens | undefined,
  ancestors = new Set<object>()
): object {
  if (ancestors.has(state)) {
    throw new Error('Non-serializable value: Circular reference.');
  }

  ancestors.add(state);

  const routes = state.routes.map((route) => {
    const screenConfig = getScreenConfig(screens, route.name);
    const childScreens = screenConfig?.screens;
    const stringifyConfig = screenConfig?.stringify;

    const { history, params, path, state: childState, ...rest } = route;
    const transformedHistory = history?.map((entry) => {
      const { params, ...rest } = entry;
      const transformedParams = transformParams(params, stringifyConfig);

      if (
        transformedParams === params &&
        (params !== undefined || !Object.hasOwn(entry, 'params'))
      ) {
        return entry;
      }

      return {
        ...rest,
        ...(transformedParams === undefined
          ? {}
          : { params: transformedParams }),
      };
    });
    const transformedParams = transformParams(params, stringifyConfig);
    const transformedState =
      childState === undefined
        ? undefined
        : stringifyState(childState, childScreens, ancestors);

    return {
      ...rest,
      ...(transformedHistory === undefined
        ? {}
        : { history: transformedHistory }),
      ...(transformedParams === undefined ? {} : { params: transformedParams }),
      ...(path === undefined ? {} : { path }),
      ...(transformedState === undefined ? {} : { state: transformedState }),
    };
  });

  ancestors.delete(state);

  const history = transformStateHistory(state, screens, 'stringify');
  const { history: _history, routes: _routes, ...rest } = state;

  return {
    ...rest,
    ...(history === undefined ? {} : { history }),
    routes,
  };
}

const parseState = (
  value: InitialState,
  screens: Screens | undefined,
  ancestors = new Set<object>()
): InitialState => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    !Array.isArray(value.routes)
  ) {
    throw new Error(INVALID_STATE_ERROR);
  }

  if (ancestors.has(value)) {
    throw new Error('Non-serializable value: Circular reference.');
  }

  ancestors.add(value);

  const routes: InitialState['routes'] = value.routes.map((route) => {
    if (
      route === null ||
      typeof route !== 'object' ||
      Array.isArray(route) ||
      typeof route.name !== 'string'
    ) {
      throw new Error(INVALID_STATE_ERROR);
    }

    const screenConfig = getScreenConfig(screens, route.name);
    const { history, params, state, ...rest } = route;

    if (history !== undefined && !Array.isArray(history)) {
      throw new Error(INVALID_STATE_ERROR);
    }

    const transformedHistory = history?.map((entry) => {
      if (
        entry === null ||
        typeof entry !== 'object' ||
        Array.isArray(entry) ||
        entry.type !== 'params'
      ) {
        throw new Error(INVALID_STATE_ERROR);
      }

      const transformedParams = transformParams(
        entry.params,
        screenConfig?.parse
      );

      if (
        transformedParams === entry.params &&
        (entry.params !== undefined || !Object.hasOwn(entry, 'params'))
      ) {
        return entry;
      }

      return {
        ...entry,
        ...(transformedParams === undefined
          ? {}
          : { params: transformedParams }),
      };
    });
    const transformedParams = transformParams(params, screenConfig?.parse);
    const transformedState =
      state === undefined
        ? undefined
        : parseState(state, screenConfig?.screens, ancestors);

    return {
      ...rest,
      ...(transformedHistory === undefined
        ? {}
        : { history: transformedHistory }),
      ...(transformedParams === undefined ? {} : { params: transformedParams }),
      ...(transformedState === undefined ? {} : { state: transformedState }),
    };
  });

  ancestors.delete(value);

  const history = transformStateHistory(value, screens, 'parse');
  const { history: _history, routes: _routes, ...rest } = value;

  return {
    ...rest,
    ...(history === undefined ? {} : { history }),
    routes,
  };
};

export function stringify(
  state: NavigationState | undefined,
  config: Config | undefined,
  stringifyValue?:
    | ((state: NavigationState | undefined) => string | undefined)
    | undefined
) {
  const serializedState =
    state === undefined ? undefined : stringifyState(state, config?.screens);

  if (serializedState !== undefined && !isSerializable(serializedState)) {
    throw new Error('Non-serializable value in navigation state.');
  }

  return stringifyValue === undefined
    ? JSON.stringify(serializedState)
    : stringifyValue(serializedState);
}

export function parse(
  value: string | undefined,
  config: Config | undefined,
  parseValue?:
    | ((value: string | undefined) => InitialState | undefined)
    | undefined
) {
  const state: InitialState | undefined =
    parseValue === undefined
      ? value === undefined
        ? undefined
        : JSON.parse(value)
      : parseValue(value);

  return state === undefined ? undefined : parseState(state, config?.screens);
}
