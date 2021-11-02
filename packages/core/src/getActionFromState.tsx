import type {
  CommonActions,
  NavigationState,
  ParamListBase,
  PartialRoute,
  PartialState,
  Route,
} from '@react-navigation/routers';

import type { NavigatorScreenParams, PathConfig, PathConfigMap } from './types';

type ConfigItem = {
  initialRouteName?: string;
  screens?: Record<string, ConfigItem>;
};

type Options = {
  initialRouteName?: string;
  screens: PathConfigMap<object>;
};

type NavigateAction<State extends NavigationState> = {
  type: 'NAVIGATE';
  payload: {
    name: string;
    params?: NavigatorScreenParams<State>;
    path?: string;
  };
};

export default function getActionFromState(
  state: PartialState<NavigationState>,
  options?: Options
): NavigateAction<NavigationState> | CommonActions.Action | undefined {
  // Create a normalized configs object which will be easier to use
  const normalizedConfig = options
    ? createNormalizedConfigItem(options as PathConfig<object> | string)
    : {};

  const routes =
    state.index != null ? state.routes.slice(0, state.index + 1) : state.routes;

  if (routes.length === 0) {
    return undefined;
  }

  if (
    !(
      (routes.length === 1 && routes[0].key === undefined) ||
      (routes.length === 2 &&
        routes[0].key === undefined &&
        routes[0].name === normalizedConfig?.initialRouteName &&
        routes[1].key === undefined)
    )
  ) {
    return {
      type: 'RESET',
      payload: state,
    };
  }

  const route = state.routes[state.index ?? state.routes.length - 1];

  let current: PartialState<NavigationState> | undefined = route?.state;
  let config: ConfigItem | undefined = normalizedConfig?.screens?.[route?.name];
  let params = { ...route.params } as NavigatorScreenParams<
    ParamListBase,
    NavigationState
  >;

  let payload = route
    ? { name: route.name, path: route.path, params }
    : undefined;

  while (current) {
    if (current.routes.length === 0) {
      return undefined;
    }

    const routes =
      current.index != null
        ? current.routes.slice(0, current.index + 1)
        : current.routes;

    const route: Route<string> | PartialRoute<Route<string>> =
      routes[routes.length - 1];

    // Explicitly set to override existing value when merging params
    Object.assign(params, {
      initial: undefined,
      screen: undefined,
      params: undefined,
      state: undefined,
    });

    if (routes.length === 1 && routes[0].key === undefined) {
      params.initial = true;
      params.screen = route.name;
    } else if (
      routes.length === 2 &&
      routes[0].key === undefined &&
      routes[0].name === config?.initialRouteName &&
      routes[1].key === undefined
    ) {
      params.initial = false;
      params.screen = route.name;
    } else {
      params.state = current;
      break;
    }

    if (route.state) {
      params.params = { ...route.params };
      params = params.params as NavigatorScreenParams<
        ParamListBase,
        NavigationState
      >;
    } else {
      params.path = route.path;
      params.params = route.params;
    }

    current = route.state;
    config = config?.screens?.[route.name];
  }

  if (!payload) {
    return;
  }

  // Try to construct payload for a `NAVIGATE` action from the state
  // This lets us preserve the navigation state and not lose it
  return {
    type: 'NAVIGATE',
    payload,
  };
}

const createNormalizedConfigItem = (config: PathConfig<object> | string) =>
  typeof config === 'object' && config != null
    ? {
        initialRouteName: config.initialRouteName,
        screens:
          config.screens != null
            ? createNormalizedConfigs(config.screens)
            : undefined,
      }
    : {};

const createNormalizedConfigs = (options: PathConfigMap<object>) =>
  Object.entries(options).reduce<Record<string, ConfigItem>>((acc, [k, v]) => {
    acc[k] = createNormalizedConfigItem(v);
    return acc;
  }, {});
