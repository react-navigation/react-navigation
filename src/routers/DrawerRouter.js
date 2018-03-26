import SwitchRouter from './SwitchRouter';
import NavigationActions from '../NavigationActions';

import invariant from '../utils/invariant';
import withDefaultValue from '../utils/withDefaultValue';

import DrawerActions from './DrawerActions';

export default (routeConfigs, config = {}) => {
  config = { ...config };
  config = withDefaultValue(config, 'resetOnBlur', false);
  config = withDefaultValue(config, 'backBehavior', 'initialRoute');

  const switchRouter = SwitchRouter(routeConfigs, config);

  return {
    ...switchRouter,

    getActionCreators(route, navStateKey) {
      return {
        openDrawer: () => ({ type: DrawerActions.OPEN_DRAWER }),
        closeDrawer: () => ({ type: DrawerActions.CLOSE_DRAWER }),
        toggleDrawer: () => ({ type: DrawerActions.TOGGLE_DRAWER }),
        ...switchRouter.getActionCreators(route, navStateKey),
      };
    },

    getStateForAction(action, lastState) {
      const state = lastState || {
        ...switchRouter.getStateForAction(action, undefined),
        isDrawerOpen: false,
      };

      // Handle explicit drawer actions
      if (state.isDrawerOpen && action.type === DrawerActions.CLOSE_DRAWER) {
        return {
          ...state,
          isDrawerOpen: false,
        };
      }
      if (!state.isDrawerOpen && action.type === DrawerActions.OPEN_DRAWER) {
        return {
          ...state,
          isDrawerOpen: true,
        };
      }
      if (action.type === DrawerActions.TOGGLE_DRAWER) {
        return {
          ...state,
          isDrawerOpen: !state.isDrawerOpen,
        };
      }

      // Fall back on tab router for screen switching logic
      const childState = switchRouter.getStateForAction(action, state);
      if (childState !== null && childState !== state) {
        // If the tabs have changed, make sure to close the drawer
        return {
          ...childState,
          isDrawerOpen: false,
        };
      }
      return state;
    },
  };
};
