import shortid from 'shortid';
import { CommonAction, NavigationState, PartialState } from './types';

/**
 * Base router object that can be used when writing custom routers.
 * This provides few helper methods to handle common actions such as `RESET`.
 */
const BaseRouter = {
  getStateForAction<State extends NavigationState>(
    state: State,
    action: CommonAction
  ): State | PartialState<State> | null {
    switch (action.type) {
      case 'REPLACE': {
        const index = action.source
          ? state.routes.findIndex(r => r.key === action.source)
          : state.index;

        if (index === -1) {
          return null;
        }

        const { name, key, params } = action.payload;

        if (!state.routeNames.includes(name)) {
          return null;
        }

        return {
          ...state,
          routes: state.routes.map((route, i) =>
            i === index
              ? {
                  key: key !== undefined ? key : `${name}-${shortid()}`,
                  name,
                  params,
                }
              : route
          ),
        };
      }

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

      case 'RESET':
        return action.payload as PartialState<State>;

      default:
        return null;
    }
  },

  shouldActionChangeFocus(action: CommonAction) {
    return action.type === 'NAVIGATE';
  },
};

export default BaseRouter;
