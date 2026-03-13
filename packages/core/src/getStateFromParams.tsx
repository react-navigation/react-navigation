import type { NavigationState, PartialState } from '@react-navigation/routers';

export function getStateFromParams(
  params: Record<string, any> | undefined
): PartialState<NavigationState> | undefined {
  if (params?.state != null) {
    return params.state;
  } else if (typeof params?.screen === 'string' && params?.initial !== false) {
    return {
      routes: [
        {
          name: params.screen,
          params: params.params,
          path: params.path,
        },
      ],
    };
  }

  return undefined;
}
