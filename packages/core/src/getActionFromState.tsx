import type { PartialState, NavigationState } from '@react-navigation/routers';

type NavigateParams = {
  screen?: string;
  params?: NavigateParams;
  initial?: boolean;
};

type NavigateAction = {
  type: 'NAVIGATE';
  payload: { name: string; params: NavigateParams };
};

export default function getActionFromState(
  state: PartialState<NavigationState>
): NavigateAction | undefined {
  if (state.routes.length === 0) {
    return undefined;
  }

  // Try to construct payload for a `NAVIGATE` action from the state
  // This lets us preserve the navigation state and not lose it
  let route = state.routes[state.routes.length - 1];

  let payload: { name: string; params: NavigateParams } = {
    name: route.name,
    params: { ...route.params },
  };

  let current = route.state;
  let params = payload.params;

  while (current) {
    if (current.routes.length === 0) {
      return undefined;
    }

    route = current.routes[current.routes.length - 1];
    params.initial = current.routes.length === 1;
    params.screen = route.name;

    if (route.state) {
      params.params = { ...route.params };
      params = params.params;
    } else {
      params.params = route.params;
    }

    current = route.state;
  }

  return {
    type: 'NAVIGATE',
    payload,
  };
}
