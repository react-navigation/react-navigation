import type { NavigationState, PartialState } from '@react-navigation/routers';

import { getStateFromRouteParams } from './getStateFromRouteParams';
import type {
  StaticNavigation,
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
      const groupScreens = group.screens;

      if (groupScreens[name] != null) {
        return groupScreens[name];
      }
    }
  }

  return undefined;
}

function getNestedTree(
  item: StaticScreenPathConfig
): StaticNavigation<any, any, any> | undefined {
  if (item && typeof item === 'object') {
    if ('config' in item && (item.config?.screens || item.config?.groups)) {
      return item;
    }

    if (
      'screen' in item &&
      item.screen &&
      typeof item.screen === 'object' &&
      'config' in item.screen &&
      (item.screen.config?.screens || item.screen.config?.groups)
    ) {
      return item.screen;
    }
  }

  return undefined;
}

/**
 * Returns a loader function for the focused route in a static navigation config and navigation state.
 *
 * @param tree The static navigation config.
 * @param state The navigation state to extract the focused route path from.
 * @returns A function that takes an `AbortSignal` and returns a `Promise<void>`, or `undefined` if no loaders are found.
 *
 * @example
 * ```js
 * const loader = UNSTABLE_getLoaderForState(RootStack, {
 *   index: 0,
 *   routes: [{ name: 'Home' }],
 * });
 * await loader?.(controller.signal);
 * ```
 */
export function UNSTABLE_getLoaderForState(
  tree: StaticNavigation<any, any, any>,
  state: PartialState<NavigationState> | NavigationState | undefined
): ((signal: AbortSignal) => Promise<void>) | undefined {
  const config = tree.config;
  const focusedRoute = state?.routes[state.index ?? 0];

  if (!focusedRoute) {
    return undefined;
  }

  const { name } = focusedRoute;
  const item = findScreenInConfig(config, name);

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

  const loaders: ((signal: AbortSignal) => Promise<void>)[] = [];

  if (
    typeof item === 'object' &&
    'UNSTABLE_loader' in item &&
    typeof item.UNSTABLE_loader === 'function'
  ) {
    const loader = item.UNSTABLE_loader;
    loaders.push((signal) => loader({ name, params, signal }));
  }

  const nested = getNestedTree(item);

  if (nested) {
    const childState = focusedRoute.state ?? getStateFromRouteParams(params);
    const childLoader = UNSTABLE_getLoaderForState(nested, childState);
    if (childLoader) {
      loaders.push(childLoader);
    }
  }

  if (loaders.length === 0) {
    return undefined;
  }

  return async (signal) => {
    await Promise.all(loaders.map((l) => l(signal)));
  };
}
