import { nanoid } from 'nanoid/non-secure';

import type {
  PushParamsAction,
  ReplaceParamsAction,
  SetParamsAction,
} from './CommonActions';
import type {
  CommonNavigationAction,
  NavigationState,
  PartialState,
  Route,
} from './types';

export function getRouteForParamsAction<T extends Route<string>>(
  route: T,
  action: SetParamsAction | ReplaceParamsAction | PushParamsAction
): T {
  switch (action.type) {
    case 'SET_PARAMS':
      return {
        ...route,
        params: { ...route.params, ...action.payload.params },
      };

    case 'REPLACE_PARAMS':
      return {
        ...route,
        params: action.payload.params,
      };

    case 'PUSH_PARAMS':
      return {
        ...route,
        params: action.payload.params,
        history: [
          ...(route.history ?? []),
          { type: 'params', params: route.params },
        ],
      };
  }
}

/**
 * Base router object that can be used when writing custom routers.
 * This provides few helper methods to handle common actions such as `RESET`.
 */
export const BaseRouter = {
  getStateForAction<State extends NavigationState>(
    state: State,
    action: CommonNavigationAction
  ): State | PartialState<State> | null {
    switch (action.type) {
      case 'SET_PARAMS':
      case 'REPLACE_PARAMS':
      case 'PUSH_PARAMS': {
        const index = action.source
          ? state.routes.findIndex((r) => r.key === action.source)
          : state.index;

        if (index === -1) {
          return null;
        }

        const route = getRouteForParamsAction(state.routes[index], action);

        return {
          ...state,
          routes: state.routes.map((r, i) => (i === index ? route : r)),
        };
      }

      case 'RESET': {
        const nextState = action.payload as State | PartialState<State>;

        if (
          nextState.routes.length === 0 ||
          nextState.routes.some(
            (route: { name: string }) => !state.routeNames.includes(route.name)
          )
        ) {
          return null;
        }

        if (nextState.stale === false) {
          if (
            state.routeNames.length !== nextState.routeNames.length ||
            nextState.routeNames.some(
              (name) => !state.routeNames.includes(name)
            )
          ) {
            return null;
          }

          return {
            ...nextState,
            routes: nextState.routes.map((route) =>
              route.key ? route : { ...route, key: `${route.name}-${nanoid()}` }
            ),
          };
        }

        return nextState;
      }

      default:
        return null;
    }
  },

  shouldActionChangeFocus(action: CommonNavigationAction) {
    return action.type === 'NAVIGATE';
  },
};
