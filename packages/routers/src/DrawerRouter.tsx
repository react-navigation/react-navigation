import shortid from 'shortid';
import { CommonAction, Router } from '@react-navigation/core';
import TabRouter, {
  TabActions,
  TabActionType,
  TabRouterOptions,
  TabNavigationState,
} from './TabRouter';

export type DrawerActionType =
  | TabActionType
  | {
      type: 'OPEN_DRAWER' | 'CLOSE_DRAWER' | 'TOGGLE_DRAWER';
      source?: string;
      target?: string;
    };

export type DrawerRouterOptions = TabRouterOptions;

export type DrawerNavigationState = Omit<TabNavigationState, 'type'> & {
  /**
   * Type of the router, in this case, it's drawer.
   */
  type: 'drawer';
  /**
   * Whether the drawer is open or closed.
   */
  isDrawerOpen: boolean;
};

export const DrawerActions = {
  ...TabActions,
  openDrawer(): DrawerActionType {
    return { type: 'OPEN_DRAWER' };
  },
  closeDrawer(): DrawerActionType {
    return { type: 'CLOSE_DRAWER' };
  },
  toggleDrawer(): DrawerActionType {
    return { type: 'TOGGLE_DRAWER' };
  },
};

export default function DrawerRouter(
  options: DrawerRouterOptions
): Router<DrawerNavigationState, DrawerActionType | CommonAction> {
  const router = (TabRouter(options) as unknown) as Router<
    DrawerNavigationState,
    TabActionType | CommonAction
  >;

  return {
    ...router,

    type: 'drawer',

    getInitialState({ routeNames, routeParamList }) {
      const index =
        options.initialRouteName === undefined
          ? 0
          : routeNames.indexOf(options.initialRouteName);

      return {
        stale: false,
        type: 'drawer',
        key: `drawer-${shortid()}`,
        index,
        routeNames,
        routeKeyHistory: [],
        routes: routeNames.map(name => ({
          name,
          key: `${name}-${shortid()}`,
          params: routeParamList[name],
        })),
        isDrawerOpen: false,
      };
    },

    getRehydratedState(partialState, { routeNames, routeParamList }) {
      if (partialState.stale === false) {
        return partialState;
      }

      const state = router.getRehydratedState(partialState, {
        routeNames,
        routeParamList,
      });

      return {
        ...state,
        type: 'drawer',
        key: `drawer-${shortid()}`,
        isDrawerOpen:
          typeof partialState.isDrawerOpen === 'boolean'
            ? partialState.isDrawerOpen
            : false,
      };
    },

    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex(r => r.key === key);

      const result =
        index === -1 || index === state.index
          ? state
          : router.getStateForRouteFocus(state, key);

      if (result.isDrawerOpen) {
        return {
          ...result,
          isDrawerOpen: false,
        };
      }

      return result;
    },

    getStateForAction(state, action) {
      switch (action.type) {
        case 'OPEN_DRAWER':
          if (state.isDrawerOpen) {
            return state;
          }

          return {
            ...state,
            isDrawerOpen: true,
          };

        case 'CLOSE_DRAWER':
          if (!state.isDrawerOpen) {
            return state;
          }

          return {
            ...state,
            isDrawerOpen: false,
          };

        case 'TOGGLE_DRAWER':
          return {
            ...state,
            isDrawerOpen: !state.isDrawerOpen,
          };

        case 'NAVIGATE':
          return router.getStateForAction(
            {
              ...state,
              isDrawerOpen: false,
            },
            action
          );

        default:
          return router.getStateForAction(state, action);
      }
    },

    actionCreators: DrawerActions,
  };
}
