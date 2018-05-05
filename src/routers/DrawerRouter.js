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
        openDrawer: () => DrawerActions.openDrawer({ key: navStateKey }),
        closeDrawer: () => DrawerActions.closeDrawer({ key: navStateKey }),
        toggleDrawer: () => DrawerActions.toggleDrawer({ key: navStateKey }),
        ...switchRouter.getActionCreators(route, navStateKey),
      };
    },

    getStateForAction(action, lastState) {
      const state = lastState || {
        ...switchRouter.getStateForAction(action, undefined),
        isDrawerOpen: false,
      };

      const isRouterTargeted = action.key == null || action.key === state.key;

      if (isRouterTargeted) {
        // Only handle actions that are meant for this drawer, as specified by action.key.

        if (action.type === DrawerActions.CLOSE_DRAWER && state.isDrawerOpen) {
          return {
            ...state,
            isDrawerOpen: false,
          };
        }

        if (action.type === DrawerActions.OPEN_DRAWER && !state.isDrawerOpen) {
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
      }

      // Fall back on switch router for screen switching logic, and handling of child routers
      const switchedState = switchRouter.getStateForAction(action, state);

      if (switchedState === null) {
        // The switch router or a child router is attempting to swallow this action. We return null to allow this.
        return null;
      }

      if (switchedState !== state) {
        if (switchedState.index !== state.index) {
          // If the tabs have changed, make sure to close the drawer
          return {
            ...switchedState,
            isDrawerOpen: false,
          };
        }
        // Return the state new state, as returned by the switch router.
        // The index hasn't changed, so this most likely means that a child router has returned a new state
        return switchedState;
      }

      return state;
    },
  };
};
