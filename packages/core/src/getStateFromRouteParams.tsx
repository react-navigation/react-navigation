import type { NavigationState, PartialState } from '@react-navigation/routers';

export function getStateFromRouteParams(
  params: object | undefined
): PartialState<NavigationState> | NavigationState | undefined {
  if (params == null || typeof params !== 'object') {
    return undefined;
  }

  if (
    'state' in params &&
    params.state &&
    typeof params.state === 'object' &&
    'routes' in params.state &&
    Array.isArray(params.state.routes) &&
    params.state.routes.every(
      (route) =>
        typeof route === 'object' &&
        route != null &&
        'name' in route &&
        typeof route.name === 'string'
    )
  ) {
    // @ts-expect-error this is fine 🔥
    return params.state;
  }

  if (
    'screen' in params &&
    params.screen &&
    typeof params.screen === 'string'
  ) {
    return {
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
          // @ts-expect-error this is fine 🔥
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
