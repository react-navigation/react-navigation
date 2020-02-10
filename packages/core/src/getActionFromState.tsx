import { PartialState, NavigationState } from '@react-navigation/routers';

type NavigateParams = {
  screen?: string;
  params?: NavigateParams;
};

type Action =
  | {
      type: 'NAVIGATE';
      payload: { name: string; params: NavigateParams };
    }
  | {
      type: 'RESET_ROOT';
      payload: PartialState<NavigationState>;
    };

export default function getActionFromState(
  state: PartialState<NavigationState>
): Action {
  let payload: { name: string; params: NavigateParams } | undefined;

  if (state.routes.length === 1) {
    // Try to construct payload for a `NAVIGATE` action from the state
    // This lets us preserve the navigation state and not lose it
    let route = state.routes[0];

    payload = {
      name: route.name,
      params: { ...route.params },
    };

    let current = state.routes[0].state;
    let params = payload.params;

    while (current) {
      if (current.routes.length === 1) {
        route = current.routes[0];
        params.screen = route.name;

        if (route.state) {
          params.params = { ...route.params };
          params = params.params;
        } else {
          params.params = route.params;
        }

        current = route.state;
      } else {
        payload = undefined;
        break;
      }
    }
  }

  if (payload) {
    return {
      type: 'NAVIGATE',
      payload,
    };
  }

  return {
    type: 'RESET_ROOT',
    payload: state,
  };
}
