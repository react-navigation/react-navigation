import type { NavigationState, PartialState } from '@react-navigation/routers';

import { getStateFromRouteParams } from './getStateFromRouteParams';
import type {
  StaticScreenPathConfig,
  TreeForPathConfig,
} from './StaticNavigation';

function findScreenInConfig(
  config: TreeForPathConfig['config'],
  name: string
): StaticScreenPathConfig | undefined {
  const screens = config.screens;

  if (screens?.[name] != null) {
    return screens[name];
  }

  if (config.groups) {
    for (const group of Object.values(config.groups)) {
      if (group.screens[name] != null) {
        return group.screens[name];
      }
    }
  }

  return undefined;
}

function findInitialRouteName(
  config: TreeForPathConfig['config']
): string | undefined {
  if (config.initialRouteName != null) {
    return config.initialRouteName;
  }

  for (const key in config) {
    if (key === 'screens' && config.screens) {
      const name = Object.keys(config.screens)[0];

      if (name != null) {
        return name;
      }
    }

    if (key === 'groups' && config.groups) {
      for (const group of Object.values(config.groups)) {
        const name = Object.keys(group.screens)[0];

        if (name != null) {
          return name;
        }
      }
    }
  }

  return undefined;
}

/**
 * Returns a loader function for the focused route in a static navigation config and navigation state.
 *
 * @param tree The static navigation config.
 * @param state The navigation state to extract the focused route path from.
 * @returns A function that returns a `Promise<void>`, or `undefined` if no loaders are found.
 *
 * @example
 * ```js
 * const loader = UNSTABLE_getLoaderForState(RootStack, {
 *   index: 0,
 *   routes: [{ name: 'Home' }],
 * });
 * await loader?.();
 * ```
 */
export function UNSTABLE_getLoaderForState(
  tree: TreeForPathConfig,
  state: PartialState<NavigationState> | NavigationState | undefined
): (() => Promise<void>) | undefined {
  const focusedRoute = state?.routes[state.index ?? 0];

  if (!focusedRoute) {
    return undefined;
  }

  const item = findScreenInConfig(tree.config, focusedRoute.name);

  if (item == null) {
    return undefined;
  }

  const initialParams =
    typeof item === 'object' && 'initialParams' in item
      ? item.initialParams
      : undefined;

  const params =
    initialParams != null || focusedRoute.params != null
      ? { ...initialParams, ...focusedRoute.params }
      : undefined;

  const loaders: (() => Promise<void>)[] = [];

  if ('UNSTABLE_loader' in item && typeof item.UNSTABLE_loader === 'function') {
    const loader = item.UNSTABLE_loader;

    loaders.push(() =>
      loader({
        name: focusedRoute.name,
        params,
      })
    );
  }

  const nested =
    'config' in item
      ? item
      : 'screen' in item && 'config' in item.screen
        ? item.screen
        : undefined;

  if (nested) {
    const initialRouteName = findInitialRouteName(nested.config);

    let childState = focusedRoute.state ?? getStateFromRouteParams(params);

    if (childState == null && initialRouteName != null) {
      childState = { routes: [{ name: initialRouteName }] };
    }

    const childLoader = UNSTABLE_getLoaderForState(nested, childState);

    if (childLoader) {
      loaders.push(childLoader);
    }
  }

  if (loaders.length === 0) {
    return undefined;
  }

  return async () => {
    await Promise.all(loaders.map((l) => l()));
  };
}
