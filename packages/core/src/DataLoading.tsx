import type { NavigationState, PartialState } from '@react-navigation/routers';

import {
  initializeLoaderContext,
  type LoaderContext,
  type LoaderContextInitializer,
} from './createLoaderContext';
import { getStateFromRouteParams } from './getStateFromRouteParams';
import type { TreeForPathConfig } from './StaticNavigation';

type Loader = (options?: {
  context?: LoaderContextInitializer | undefined;
}) => Promise<void>;

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
): Loader | undefined {
  return getLoaderForStateChange(tree, state, undefined, undefined);
}

export function getLoaderForStateChange(
  tree: TreeForPathConfig,
  state: PartialState<NavigationState> | NavigationState | undefined,
  previousState: PartialState<NavigationState> | NavigationState | undefined,
  consumedParams: WeakMap<object, true> | undefined
): Loader | undefined {
  const loader = getLoaderForStateChangeInternal(
    tree,
    state,
    previousState,
    consumedParams
  );

  if (loader === undefined) {
    return undefined;
  }

  return async (options) => {
    const context = initializeLoaderContext(options?.context);

    await loader(context);
  };
}

function getLoaderForStateChangeInternal(
  tree: TreeForPathConfig,
  state: PartialState<NavigationState> | NavigationState | undefined,
  previousState: PartialState<NavigationState> | NavigationState | undefined,
  consumedParams: WeakMap<object, true> | undefined
): ((context: LoaderContext) => Promise<void>) | undefined {
  const focusedRoute = state?.routes[state.index ?? state.routes.length - 1];
  const previousFocusedRoute =
    previousState?.routes[
      previousState.index ?? previousState.routes.length - 1
    ];

  if (!focusedRoute) {
    return undefined;
  }

  const isNewlyFocused =
    previousState === undefined ||
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

  const loaders: ((context: LoaderContext) => Promise<void>)[] = [];

  if (
    isNewlyFocused &&
    'UNSTABLE_loader' in item &&
    typeof item.UNSTABLE_loader === 'function'
  ) {
    const loader = item.UNSTABLE_loader;

    loaders.push((context) =>
      loader({ name: focusedRoute.name, params }, context)
    );
  }

  const nested =
    'config' in item
      ? item
      : 'screen' in item &&
          // Nested navigators cannot be defined as a getter
          Object.getOwnPropertyDescriptor(item, 'screen')?.get == null &&
          'config' in item.screen
        ? item.screen
        : undefined;

  if (nested) {
    const initialRouteName = findInitialRouteName(nested.config);

    const stateFromParams =
      focusedRoute.params != null && consumedParams?.has(focusedRoute.params)
        ? undefined
        : getStateFromRouteParams(params);

    let childState =
      previousState !== undefined && stateFromParams != null
        ? stateFromParams
        : (focusedRoute.state ?? stateFromParams);

    if (childState == null && initialRouteName != null) {
      childState = { routes: [{ name: initialRouteName }] };
    }

    let previousChildState:
      | PartialState<NavigationState>
      | NavigationState
      | undefined;

    if (!isNewlyFocused) {
      const previousRouteParams = previousFocusedRoute?.params;
      const previousParams =
        initialParams != null || previousRouteParams != null
          ? { ...initialParams, ...previousRouteParams }
          : undefined;
      const previousStateFromParams =
        previousRouteParams != null && consumedParams?.has(previousRouteParams)
          ? undefined
          : getStateFromRouteParams(previousParams);

      previousChildState =
        previousFocusedRoute?.state ?? previousStateFromParams;

      if (previousChildState == null && initialRouteName != null) {
        previousChildState = { routes: [{ name: initialRouteName }] };
      }
    }

    const childLoader = getLoaderForStateChangeInternal(
      nested,
      childState,
      previousState === undefined
        ? undefined
        : (previousChildState ?? { routes: [] }),
      consumedParams
    );

    if (childLoader) {
      loaders.push(childLoader);
    }
  }

  if (loaders.length === 0) {
    return undefined;
  }

  return async (context) => {
    await Promise.all(loaders.map((l) => l(context)));
  };
}
