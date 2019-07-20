import { Router } from '../../types';

const MockRouter: Router<{ type: string }> & { key: number } = {
  key: 0,

  getInitialState({
    routeNames,
    initialRouteName = routeNames[0],
    initialParamsList,
  }) {
    const index = routeNames.indexOf(initialRouteName);

    return {
      key: String(MockRouter.key++),
      index,
      routeNames,
      routes: routeNames.map(name => ({
        name,
        key: name,
        params: initialParamsList[name],
      })),
    };
  },

  getRehydratedState({ routeNames, partialState }) {
    let state = partialState;

    if (state.routeNames === undefined || state.key === undefined) {
      state = {
        ...state,
        routeNames,
        key: String(MockRouter.key++),
      };
    }

    return state;
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

  getStateForAction(state, action) {
    switch (action.type) {
      case 'UPDATE':
        return { ...state };

      case 'NOOP':
        return state;

      default:
        return null;
    }
  },

  shouldActionPropagateToChildren() {
    return false;
  },

  shouldActionChangeFocus() {
    return false;
  },

  actionCreators: {},
};

export default MockRouter;
