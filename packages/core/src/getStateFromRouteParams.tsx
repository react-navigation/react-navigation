import type { NavigationState, PartialState } from '@react-navigation/routers';

const isNavigationState = (
  state: unknown
): state is PartialState<NavigationState> | NavigationState =>
  state != null &&
  typeof state === 'object' &&
  'index' in state &&
  typeof state.index === 'number' &&
  'routes' in state &&
  Array.isArray(state.routes) &&
  state.routes.every(
    (route) =>
      typeof route === 'object' &&
      route != null &&
      'name' in route &&
      typeof route.name === 'string'
  );

export function getStateFromRouteParams(
  params: object | undefined
): PartialState<NavigationState> | NavigationState | undefined {
  if (params == null || typeof params !== 'object') {
    return undefined;
  }

  if ('state' in params && isNavigationState(params.state)) {
    return params.state;
  }

  if (
    'screen' in params &&
    params.screen &&
    typeof params.screen === 'string'
  ) {
    return {
      index: 0,
      routes: [
        {
          name: params.screen,
          params:
            'params' in params &&
            typeof params.params === 'object' &&
            params.params != null
              ? params.params
              : undefined,
          path:
            'path' in params && typeof params.path === 'string'
              ? params.path
              : undefined,
          state:
            'params' in params &&
            typeof params.params === 'object' &&
            params.params != null
              ? getStateFromRouteParams(params.params)
              : undefined,
        },
      ],
    };
  }

  return undefined;
}
