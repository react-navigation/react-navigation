import shortid from 'shortid';
import { CommonAction, NavigationState } from './types';

const BaseRouter = {
  getStateForAction(state: NavigationState, action: CommonAction) {
    switch (action.type) {
      case 'REPLACE': {
        return {
          ...state,
          routes: state.routes.map((route, i) =>
            i === state.index
              ? {
                  key: `${action.payload.name}-${shortid()}`,
                  name: action.payload.name,
                  params: action.payload.params,
                }
              : route
          ),
        };
      }

      case 'SET_PARAMS':
        return {
          ...state,
          routes: state.routes.map(r =>
            r.key === action.payload.key || r.name === action.payload.name
              ? { ...r, params: { ...r.params, ...action.payload.params } }
              : r
          ),
        };

      case 'RESET':
        if (
          action.payload.key === undefined ||
          action.payload.key === state.key
        ) {
          return {
            ...action.payload,
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
    return action.type === 'NAVIGATE' || action.type === 'RESET';
  },

  shouldActionChangeFocus(action: CommonAction) {
    return action.type === 'NAVIGATE';
  },
};

export default BaseRouter;
