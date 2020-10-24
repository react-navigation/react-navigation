import type {
  Route,
  PartialRoute,
  NavigationState,
  PartialState,
} from '@react-navigation/routers';
import type { PathConfig, PathConfigMap, NestedNavigateParams } from './types';

type ConfigItem = {
  initialRouteName?: string;
  screens?: Record<string, ConfigItem>;
};

type Options = { initialRouteName?: string; screens: PathConfigMap };

type NavigateAction<State extends NavigationState> = {
  type: 'NAVIGATE';
  payload: {
    name: string;
    params?: NestedNavigateParams<State>;
  };
};

export default function getActionFromState(
  state: PartialState<NavigationState>,
  options?: Options
): NavigateAction<NavigationState> | undefined {
  // Create a normalized configs object which will be easier to use
  const normalizedConfig = options ? createNormalizedConfigItem(options) : {};

  let payload;
  let current: PartialState<NavigationState> | undefined = state;
  let config: ConfigItem | undefined = normalizedConfig;
  let params: NestedNavigateParams<NavigationState> = {};

  while (current) {
    if (current.routes.length === 0) {
      return undefined;
    }

    const route: Route<string> | PartialRoute<Route<string>> =
      current.routes[current.routes.length - 1];

    if (current.routes.length === 1) {
      params.initial = true;
      params.screen = route.name;
      params.state = undefined; // Explicitly set to override existing value when merging params
    } else if (
      current.routes.length === 2 &&
      current.routes[0].key === undefined &&
      current.routes[0].name === config?.initialRouteName
    ) {
      params.initial = false;
      params.screen = route.name;
      params.state = undefined;
    } else {
      params.initial = undefined;
      params.screen = undefined;
      params.params = undefined;
      params.state = current;
      break;
    }

    if (route.state) {
      params.params = { ...route.params };
      params = params.params;
    } else {
      params.params = route.params;
    }

    current = route.state;
    config = config?.screens?.[route.name];

    if (!payload) {
      payload = {
        name: route.name,
        params,
      };
    }
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

const createNormalizedConfigItem = (config: PathConfig | string) =>
  typeof config === 'object' && config != null
    ? {
        initialRouteName: config.initialRouteName,
        screens:
          config.screens != null
            ? createNormalizedConfigs(config.screens)
            : undefined,
      }
    : {};

const createNormalizedConfigs = (options: PathConfigMap) =>
  Object.entries(options).reduce<Record<string, ConfigItem>>((acc, [k, v]) => {
    acc[k] = createNormalizedConfigItem(v);
    return acc;
  }, {});
