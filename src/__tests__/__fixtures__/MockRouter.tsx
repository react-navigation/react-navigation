import BaseRouter from '../../BaseRouter';
import {
  Router,
  CommonAction,
  NavigationState,
  DefaultRouterOptions,
} from '../../types';

export type MockActions = CommonAction & {
  type: 'NOOP' | 'REVERSE' | 'UPDATE';
};

export const MockRouterKey = { current: 0 };

export default function MockRouter(options: DefaultRouterOptions) {
  const router: Router<NavigationState, MockActions> = {
    getInitialState({ routeNames, routeParamList }) {
      const index =
        options.initialRouteName === undefined
          ? 0
          : routeNames.indexOf(options.initialRouteName);

      return {
        key: String(MockRouterKey.current++),
        index,
        routeNames,
        routes: routeNames.map(name => ({
          name,
          key: name,
          params: routeParamList[name],
        })),
      };
    },

    getRehydratedState({ routeNames, partialState }) {
      let state = partialState;

      if (state.stale) {
        state = {
          ...state,
          stale: false,
          routeNames,
          key: String(MockRouterKey.current++),
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
          return BaseRouter.getStateForAction(state, action);
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

  return router;
}
