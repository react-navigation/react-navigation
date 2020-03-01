import { CommonNavigationAction, NavigationState, PartialState } from './types';

/**
 * Base router object that can be used when writing custom routers.
 * This provides few helper methods to handle common actions such as `RESET`.
 */
const BaseRouter = {
  getStateForAction<State extends NavigationState>(
    state: State,
    action: CommonNavigationAction
  ): State | PartialState<State> | null {
    switch (action.type) {
      case 'SET_PARAMS': {
        const index = action.source
          ? state.routes.findIndex(r => r.key === action.source)
          : state.index;

        if (index === -1) {
          return null;
        }

        return {
          ...state,
          routes: state.routes.map((r, i) =>
            i === index
              ? { ...r, params: { ...r.params, ...action.payload.params } }
              : r
          ),
        };
      }

      case 'RESET': {
        const nextState = action.payload as State | PartialState<State>;

        if (nextState.stale === false) {
          if (
            state.routeNames.length !== nextState.routeNames.length ||
            nextState.routeNames.some(name => !state.routeNames.includes(name))
          ) {
            return null;
          }
        }

        if (
          nextState.routes.some(
            (route: { name: string }) => !state.routeNames.includes(route.name)
          )
        ) {
          return null;
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

export default BaseRouter;
