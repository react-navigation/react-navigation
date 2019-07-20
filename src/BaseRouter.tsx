import { CommonAction, Router } from './types';

const BaseRouter: Omit<
  Omit<Router<CommonAction>, 'getInitialState'>,
  'getRehydratedState'
> = {
  getStateForAction(state, action) {
    switch (action.type) {
      case 'SET_PARAMS':
        return {
          ...state,
          routes: state.routes.map(r =>
            r.key === action.payload.key || r.name === action.payload.name
              ? { ...r, params: { ...r.params, ...action.payload.params } }
              : r
          ),
        };
      default:
        return null;
    }
  },

  getStateForRouteNamesChange(state, { routeNames }) {
    return {
      ...state,
      routeNames,
      routes: state.routes.filter(route => routeNames.includes(route.name)),
    };
  },

  getStateForRouteFocus(state, key) {
    const index = state.routes.findIndex(r => r.key === key);

    if (index === -1 || index === state.index) {
      return state;
    }

    return { ...state, index };
  },
  shouldActionPropagateToChildren(action) {
    return action.type === 'NAVIGATE';
  },

  shouldActionChangeFocus(action) {
    return action.type === 'NAVIGATE';
  },
};

export default BaseRouter;
