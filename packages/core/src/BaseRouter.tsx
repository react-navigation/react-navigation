import shortid from 'shortid';
import { CommonAction, NavigationState } from './types';

/**
 * Base router object that can be used when writing custom routers.
 * This provides few helper methods to handle common actions such as `RESET`.
 */
const BaseRouter = {
  getStateForAction<State extends NavigationState>(
    state: State,
    action: CommonAction
  ): State | null {
    switch (action.type) {
      case 'REPLACE': {
        const index = action.source
          ? state.routes.findIndex(r => r.key === action.source)
          : state.index;

        if (index === -1) {
          return null;
        }

        return {
          ...state,
          routes: state.routes.map((route, i) =>
            i === index
              ? {
                  key: `${action.payload.name}-${shortid()}`,
                  name: action.payload.name,
                  params: action.payload.params,
                }
              : route
          ),
        };
      }

      case 'SET_PARAMS': {
        const index =
          action.payload.key || action.source
            ? state.routes.findIndex(
                r => r.key === action.payload.key || r.key === action.source
              )
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

      case 'RESET':
        if (
          action.payload.key === undefined ||
          action.payload.key === state.key
        ) {
          return {
            ...(action.payload as any),
            key: state.key,
            routeNames: state.routeNames,
          };
        }

        return null;

      default:
        return null;
    }
  },

  shouldActionPropagateToChildren(action: CommonAction) {
    return (
      action.type === 'NAVIGATE' ||
      action.type === 'REPLACE' ||
      action.type === 'SET_PARAMS' ||
      action.type === 'RESET'
    );
  },

  shouldActionChangeFocus(action: CommonAction) {
    return action.type === 'NAVIGATE';
  },
};

export default BaseRouter;
