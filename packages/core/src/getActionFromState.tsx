import type {
  CommonActions,
  NavigationState,
  ParamListBase,
  PartialState,
} from '@react-navigation/routers';

import type { NavigatorScreenParams, PathConfig, PathConfigMap } from './types';

type ConfigItem = {
  initialRouteName?: string | undefined;
  screens?: Record<string, ConfigItem> | undefined;
};

type Options = {
  initialRouteName?: string | undefined;
  screens: PathConfigMap<object>;
};

type NavigateAction<State extends NavigationState> = {
  type: 'NAVIGATE';
  payload: {
    name: string;
    params?: NavigatorScreenParams<State> | undefined;
    path?: string | undefined;
  };
};

// Cache the normalized config across calls for the same `options` reference,
// so we don't re-walk the config tree on every action conversion.
const cachedNormalizedConfig = new WeakMap<Options, ConfigItem>();

export function getActionFromState(
  state: PartialState<NavigationState>,
  options?: Options
): NavigateAction<NavigationState> | CommonActions.Action | undefined {
  let normalizedConfig;

  if (options) {
    const cached = cachedNormalizedConfig.get(options);

    if (cached) {
      normalizedConfig = cached;
    } else {
      normalizedConfig = createNormalizedConfigItem(
        options as PathConfig<object> | string
      );
      cachedNormalizedConfig.set(options, normalizedConfig as ConfigItem);
    }
  } else {
    normalizedConfig = {};
  }

  const routesLength =
    state.index == null || state.index >= state.routes.length
      ? state.routes.length
      : state.index + 1;

  if (routesLength === 0) {
    return undefined;
  }

  const firstRoute = state.routes[0];

  if (firstRoute == null) {
    return undefined;
  }

  const secondRoute = state.routes[1];

  if (
    !(
      (routesLength === 1 && firstRoute.key == null) ||
      (routesLength === 2 &&
        firstRoute.key == null &&
        firstRoute.name === normalizedConfig?.initialRouteName &&
        secondRoute?.key == null)
    )
  ) {
    return {
      type: 'RESET',
      payload: state,
    };
  }

  const route = state.routes[state.index ?? state.routes.length - 1];

  if (route == null) {
    return undefined;
  }

  let current: PartialState<NavigationState> | undefined = route.state;
  let config: ConfigItem | undefined = normalizedConfig?.screens?.[route.name];
  let params = { ...route.params } as NavigatorScreenParams<ParamListBase>;

  const payload: {
    name: string;
    params: NavigatorScreenParams<ParamListBase>;
    path?: string | undefined;
    pop?: boolean | undefined;
  } = { name: route.name, path: route.path, params };

  // If the screen contains a navigator, pop other screens to navigate to it
  // This avoid pushing multiple instances of navigators onto a stack
  //
  // For example:
  // - RootStack
  //   - BottomTabs
  //   - SomeScreen
  //
  // In this case, if deep linking to `BottomTabs`, we should pop `SomeScreen`
  // Otherwise, we'll end up with 2 instances of `BottomTabs` in the stack
  //
  // There are 2 ways we can detect if a screen contains a navigator:
  // - The route contains nested state in `route.state`
  // - Nested screens are defined in the config
  if (config?.screens && Object.keys(config.screens).length) {
    payload.pop = true;
  }

  while (current) {
    if (current.routes.length === 0) {
      return undefined;
    }

    const routesLength =
      current.index == null || current.index >= current.routes.length
        ? current.routes.length
        : current.index + 1;

    const route = current.routes[routesLength - 1];

    if (route == null) {
      return undefined;
    }

    const firstRoute = current.routes[0];

    if (firstRoute == null) {
      return undefined;
    }

    const secondRoute = current.routes[1];

    // Explicitly set to override existing value when merging params
    Object.assign(params, {
      initial: undefined,
      screen: undefined,
      params: undefined,
      state: undefined,
    });

    if (routesLength === 1 && firstRoute.key == null) {
      params.initial = true;
      params.screen = route.name;
    } else if (
      routesLength === 2 &&
      firstRoute.key == null &&
      firstRoute.name === config?.initialRouteName &&
      secondRoute?.key == null
    ) {
      params.initial = false;
      params.screen = route.name;
    } else {
      params.state = current;
      break;
    }

    if (route.state) {
      params.params = { ...route.params };
      params.pop = true;
      params = params.params as NavigatorScreenParams<ParamListBase>;
    } else {
      params.path = route.path;
      params.params = route.params;
    }

    current = route.state;
    config = config?.screens?.[route.name];

    if (config?.screens && Object.keys(config.screens).length) {
      params.pop = true;
    }
  }

  if (payload.params.screen || payload.params.state) {
    payload.pop = true;
  }

  // Try to construct payload for a `NAVIGATE` action from the state
  // This lets us preserve the navigation state and not lose it
  return {
    type: 'NAVIGATE',
    payload,
  };
}

const createNormalizedConfigItem = (
  config: PathConfig<object> | string
): ConfigItem =>
  typeof config === 'object' && config != null
    ? {
        initialRouteName:
          'initialRouteName' in config &&
          typeof config.initialRouteName === 'string'
            ? config.initialRouteName
            : undefined,
        screens:
          'screens' in config && config.screens != null
            ? createNormalizedConfigs(config.screens)
            : undefined,
      }
    : {};

const createNormalizedConfigs = (options: PathConfigMap<object>) =>
  Object.entries(options).reduce<Record<string, ConfigItem>>((acc, [k, v]) => {
    acc[k] = createNormalizedConfigItem(v);
    return acc;
  }, {});
