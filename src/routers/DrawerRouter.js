import invariant from '../utils/invariant';
import TabRouter from './TabRouter';

import NavigationActions from '../NavigationActions';

export default (routeConfigs, config = {}) => {
  const tabRouter = TabRouter(routeConfigs, config);
  return {
    ...tabRouter,

    getStateForAction(action, lastState) {
      const state = lastState || {
        ...tabRouter.getStateForAction(action, undefined),
        isDrawerOpen: false,
      };

      // Handle explicit drawer actions
      if (
        state.isDrawerOpen &&
        action.type === NavigationActions.CLOSE_DRAWER
      ) {
        return {
          ...state,
          isDrawerOpen: false,
        };
      }
      if (
        !state.isDrawerOpen &&
        action.type === NavigationActions.OPEN_DRAWER
      ) {
        return {
          ...state,
          isDrawerOpen: true,
        };
      }
      if (action.type === NavigationActions.TOGGLE_DRAWER) {
        return {
          ...state,
          isDrawerOpen: !state.isDrawerOpen,
        };
      }

      // Fall back on tab router for screen switching logic
      const tabState = tabRouter.getStateForAction(action, state);
      if (tabState !== null && tabState !== state) {
        // If the tabs have changed, make sure to close the drawer
        return {
          ...tabState,
          isDrawerOpen: false,
        };
      }
      return state;
    },
  };
};
