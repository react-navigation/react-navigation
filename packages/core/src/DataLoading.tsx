import type { NavigationState, PartialState } from '@react-navigation/routers';

import { getStateFromRouteParams } from './getStateFromRouteParams';
import type { StaticNavigation, TreeForPathConfig } from './StaticNavigation';

type ScreenConfig = TreeForPathConfig['config']['screens'] extends infer S
  ? S extends Record<string, infer V>
    ? V
    : undefined
  : undefined;

function findScreenInConfig(
  config: TreeForPathConfig['config'],
  name: string
): ScreenConfig {
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
  item: ScreenConfig
): StaticNavigation<any, any, any> | undefined {
  if (item && typeof item === 'object') {
    if ('config' in item && item.config?.screens) {
      return item;
    }

    if (
      'screen' in item &&
      item.screen &&
      typeof item.screen === 'object' &&
      'config' in item.screen &&
      item.screen.config?.screens
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
  tree: StaticNavigation<any, any, any>,
  state: PartialState<NavigationState> | NavigationState | undefined
): (() => Promise<void>) | undefined {
  const config = tree.config;
  const focusedRoute = state?.routes[state.index ?? 0];

  const name =
    focusedRoute?.name ??
    config.initialRouteName ??
    Object.keys(config.screens ?? {})[0] ??
    Object.values(config.groups ?? {}).flatMap((g) =>
      Object.keys(g.screens)
    )[0];

  if (!name) {
    return undefined;
  }

  const item = findScreenInConfig(config, name);

  if (item == null) {
    return undefined;
  }

  const loaders: (() => Promise<void>)[] = [];

  if (
    typeof item === 'object' &&
    'UNSTABLE_loader' in item &&
    typeof item.UNSTABLE_loader === 'function'
  ) {
    const loader = item.UNSTABLE_loader;
    const route = focusedRoute ?? { name };
    loaders.push(() => loader({ route }));
  }

  const nested = getNestedTree(item);

  if (nested) {
    const childState =
      focusedRoute?.state ?? getStateFromRouteParams(focusedRoute?.params);
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
