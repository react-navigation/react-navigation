import type { NavigationState, PartialState } from '@react-navigation/routers';

import { getStateFromRouteParams } from './getStateFromRouteParams';
import type { TreeForPathConfig } from './StaticNavigation';

type StateRoute = (
  | PartialState<NavigationState>
  | NavigationState
)['routes'][number];

function findScreenInConfig(config: TreeForPathConfig['config'], name: string) {
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
 * Get loader for the focused route in a static config tree with given navigation state.
 *
 * @param tree The static navigation config.
 * @param state The navigation state to extract the focused route path from.
 * @returns A function that returns a `Promise<void>`, or `undefined` if no loaders are found.
 *
 * @example
 * ```js
 * const loader = getLoaderForState(RootStack, {
 *   index: 0,
 *   routes: [{ name: 'Home' }],
 * });
 * await loader?.();
 * ```
 */
export function getLoaderForState(
  tree: TreeForPathConfig,
  state: PartialState<NavigationState> | NavigationState | undefined
): (() => Promise<void>) | undefined {
  return getLoaderForStateChange(tree, state, undefined, undefined);
}

export function getLoaderForStateChange(
  tree: TreeForPathConfig,
  state: PartialState<NavigationState> | NavigationState | undefined,
  previousState: PartialState<NavigationState> | NavigationState | undefined,
  consumedParams: WeakMap<object, true> | undefined,
  addedRoutesOnly: boolean = false
): (() => Promise<void>) | undefined {
  if (state == null) {
    return undefined;
  }

  const focusedIndex = state.index ?? state.routes.length - 1;
  const focusedRoute = state.routes[focusedIndex];
  const previousFocusedRoute =
    previousState?.routes[
      previousState.index ?? previousState.routes.length - 1
    ];

  if (!focusedRoute) {
    return undefined;
  }

  const isNewlyFocused =
    previousFocusedRoute == null ||
    focusedRoute.name !== previousFocusedRoute.name ||
    (focusedRoute.key != null &&
      previousFocusedRoute.key != null &&
      focusedRoute.key !== previousFocusedRoute.key);

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

  let previousRouteForFocusedRoute: StateRoute | undefined;

  if ((!isNewlyFocused || addedRoutesOnly) && previousState) {
    const previousRouteIndicesByKey = new Map<string, number>();

    previousState.routes.forEach((previousRoute, previousIndex) => {
      if (previousRoute.key != null) {
        previousRouteIndicesByKey.set(previousRoute.key, previousIndex);
      }
    });

    const matchedPreviousRoutes = new Map<number, StateRoute>();
    const matchedPreviousRouteIndices = new Set<number>();

    state.routes.forEach((route, index) => {
      if (route.key == null) {
        return;
      }

      const previousRouteIndex = previousRouteIndicesByKey.get(route.key);
      const previousRoute =
        previousRouteIndex != null
          ? previousState.routes[previousRouteIndex]
          : undefined;

      if (previousRouteIndex != null && previousRoute?.name === route.name) {
        matchedPreviousRoutes.set(index, previousRoute);
        matchedPreviousRouteIndices.add(previousRouteIndex);
      }
    });

    state.routes.forEach((route, index) => {
      if (matchedPreviousRoutes.has(index)) {
        return;
      }

      const previousRouteIndex = previousState.routes.findIndex(
        (previousRoute, previousIndex) =>
          !matchedPreviousRouteIndices.has(previousIndex) &&
          route.name === previousRoute.name &&
          (route.key == null || previousRoute.key == null)
      );

      if (previousRouteIndex !== -1) {
        const previousRoute = previousState.routes[previousRouteIndex];

        if (previousRoute != null) {
          matchedPreviousRoutes.set(index, previousRoute);
          matchedPreviousRouteIndices.add(previousRouteIndex);
        }
      }
    });

    state.routes.forEach((route, index) => {
      const previousRoute = matchedPreviousRoutes.get(index);

      if (index === focusedIndex) {
        previousRouteForFocusedRoute = previousRoute;

        return;
      }

      const loader = getLoaderForStateChange(
        tree,
        { index: 0, routes: [route] },
        previousRoute != null
          ? { index: 0, routes: [previousRoute] }
          : undefined,
        consumedParams,
        previousRoute != null
      );

      if (loader) {
        loaders.push(loader);
      }
    });
  }

  if (
    previousRouteForFocusedRoute == null &&
    'UNSTABLE_loader' in item &&
    typeof item.UNSTABLE_loader === 'function'
  ) {
    const loader = item.UNSTABLE_loader;

    loaders.push(() =>
      loader({
        name: focusedRoute.name,
        params,
      })
    );
  }

  let nested: TreeForPathConfig | undefined;

  if ('config' in item) {
    nested = item;
  } else if (
    'screen' in item &&
    // Nested navigators cannot be defined as a getter
    Object.getOwnPropertyDescriptor(item, 'screen')?.get == null &&
    'config' in item.screen
  ) {
    nested = item.screen;
  }

  if (nested) {
    const initialRouteName = findInitialRouteName(nested.config);
    const initialChildState =
      initialRouteName != null
        ? { routes: [{ name: initialRouteName }] }
        : undefined;

    const stateFromParams =
      focusedRoute.params != null && consumedParams?.has(focusedRoute.params)
        ? undefined
        : getStateFromRouteParams(params);

    const childState =
      (previousState === undefined
        ? (focusedRoute.state ?? stateFromParams)
        : (stateFromParams ?? focusedRoute.state)) ?? initialChildState;

    let previousChildState:
      | PartialState<NavigationState>
      | NavigationState
      | undefined;

    if (previousRouteForFocusedRoute != null) {
      const previousRouteParams = previousRouteForFocusedRoute.params;
      const previousParams =
        initialParams != null || previousRouteParams != null
          ? { ...initialParams, ...previousRouteParams }
          : undefined;
      const previousStateFromParams =
        previousRouteParams != null && consumedParams?.has(previousRouteParams)
          ? undefined
          : getStateFromRouteParams(previousParams);

      previousChildState =
        previousRouteForFocusedRoute.state ??
        previousStateFromParams ??
        initialChildState;
    }

    const childLoader = getLoaderForStateChange(
      nested,
      childState,
      previousState === undefined
        ? undefined
        : (previousChildState ?? { routes: [] }),
      consumedParams,
      addedRoutesOnly && previousRouteForFocusedRoute != null
    );

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
