import { SwitchRouter, NavigationActions } from '@react-navigation/core';
import DrawerActions from './DrawerActions';

function withDefaultValue(obj, key, defaultValue) {
  if (obj.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
    return obj;
  }

  obj[key] = defaultValue;
  return obj;
}

const getActiveRouteKey = route => {
  if (route.routes && route.routes[route.index]) {
    return getActiveRouteKey(route.routes[route.index]);
  }
  return route.key;
};

export default (routeConfigs, config = {}) => {
  config = { ...config };
  config = withDefaultValue(
    config,
    'resetOnBlur',
    config.unmountInactiveRoutes ? true : !!config.resetOnBlur
  );
  config = withDefaultValue(config, 'backBehavior', 'initialRoute');

  const switchRouter = SwitchRouter(routeConfigs, config);

  let __id = -1;
  const genId = () => {
    __id++;
    return __id;
  };

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

    getStateForAction(action, state) {
      // Set up the initial state if needed
      if (!state) {
        return {
          ...switchRouter.getStateForAction(action, undefined),
          isDrawerOpen: false,
          isDrawerIdle: true,
          drawerMovementDirection: null,
          openId: genId(),
          closeId: genId(),
          toggleId: genId(),
        };
      }

      const isRouterTargeted = action.key == null || action.key === state.key;

      if (isRouterTargeted) {
        // Only handle actions that are meant for this drawer, as specified by action.key.

        if (action.type === DrawerActions.DRAWER_CLOSED) {
          return {
            ...state,
            isDrawerOpen: false,
            isDrawerIdle: true,
            drawerMovementDirection: null,
          };
        }

        if (action.type === DrawerActions.DRAWER_OPENED) {
          return {
            ...state,
            isDrawerOpen: true,
            isDrawerIdle: true,
            drawerMovementDirection: null,
          };
        }

        if (action.type === DrawerActions.CLOSE_DRAWER) {
          return {
            ...state,
            closeId: genId(),
          };
        }

        if (action.type === DrawerActions.MARK_DRAWER_SETTLING) {
          return {
            ...state,
            isDrawerIdle: false,
            drawerMovementDirection: action.willShow ? 'opening' : 'closing',
          };
        }

        if (action.type === DrawerActions.MARK_DRAWER_ACTIVE) {
          return {
            ...state,
            isDrawerIdle: false,
            drawerMovementDirection: null,
          };
        }

        if (action.type === DrawerActions.MARK_DRAWER_IDLE) {
          return {
            ...state,
            isDrawerIdle: true,
            drawerMovementDirection: null,
          };
        }

        if (
          action.type === NavigationActions.BACK &&
          (state.isDrawerOpen || !state.isDrawerIdle) &&
          state.drawerMovementDirection !== 'closing'
        ) {
          return {
            ...state,
            closeId: genId(),
          };
        }

        if (action.type === DrawerActions.OPEN_DRAWER) {
          return {
            ...state,
            openId: genId(),
          };
        }

        if (action.type === DrawerActions.TOGGLE_DRAWER) {
          return {
            ...state,
            toggleId: genId(),
          };
        }
      }

      // Fall back on switch router for screen switching logic, and handling of child routers
      const switchedState = switchRouter.getStateForAction(action, state);

      if (switchedState === null) {
        // The switch router or a child router is attempting to swallow this action. We return null to allow this.
        return null;
      }

      // Has the switch router changed the state?
      if (switchedState !== state) {
        // If any navigation has happened, and the drawer is maybe open, make sure to close it
        if (
          getActiveRouteKey(switchedState) !== getActiveRouteKey(state) &&
          (state.isDrawerOpen || state.drawerMovementDirection !== 'closing')
        ) {
          return {
            ...switchedState,
            closeId: genId(),
          };
        }

        // At this point, return the state as defined by the switch router.
        // The active route key hasn't changed, so this most likely means that a child router has returned
        // a new state like a param change, but the same key is still active and the drawer will remain open
        return switchedState;
      }

      return state;
    },
  };
};
