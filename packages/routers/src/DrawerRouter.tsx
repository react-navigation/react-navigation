import { nanoid } from 'nanoid/non-secure';

import TabRouter, {
  TabActionHelpers,
  TabActions,
  TabActionType,
  TabNavigationState,
  TabRouterOptions,
} from './TabRouter';
import type {
  CommonNavigationAction,
  ParamListBase,
  PartialState,
  Router,
} from './types';

export type DrawerActionType =
  | TabActionType
  | {
      type: 'OPEN_DRAWER' | 'CLOSE_DRAWER' | 'TOGGLE_DRAWER';
      source?: string;
      target?: string;
    };

export type DrawerRouterOptions = TabRouterOptions & {
  defaultStatus?: 'open' | 'closed';
};

export type DrawerNavigationState<ParamList extends ParamListBase> = Omit<
  TabNavigationState<ParamList>,
  'type' | 'history'
> & {
  /**
   * Type of the router, in this case, it's drawer.
   */
  type: 'drawer';
  /**
   * List of previously visited route keys and drawer open status.
   */
  history: (
    | { type: 'route'; key: string }
    | { type: 'drawer'; status: 'open' }
  )[];
};

export type DrawerActionHelpers<ParamList extends ParamListBase> =
  TabActionHelpers<ParamList> & {
    /**
     * Open the drawer sidebar.
     */
    openDrawer(): void;

    /**
     * Close the drawer sidebar.
     */
    closeDrawer(): void;

    /**
     * Open the drawer sidebar if closed, or close if opened.
     */
    toggleDrawer(): void;
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

const isDrawerOpen = (
  state:
    | DrawerNavigationState<ParamListBase>
    | PartialState<DrawerNavigationState<ParamListBase>>
) => Boolean(state.history?.some((it) => it.type === 'drawer'));

const openDrawer = (
  state: DrawerNavigationState<ParamListBase>
): DrawerNavigationState<ParamListBase> => {
  if (isDrawerOpen(state)) {
    return state;
  }

  return {
    ...state,
    history: [...state.history, { type: 'drawer', status: 'open' }],
  };
};

const closeDrawer = (
  state: DrawerNavigationState<ParamListBase>
): DrawerNavigationState<ParamListBase> => {
  if (!isDrawerOpen(state)) {
    return state;
  }

  return {
    ...state,
    history: state.history.filter((it) => it.type !== 'drawer'),
  };
};

export default function DrawerRouter({
  defaultStatus,
  ...rest
}: DrawerRouterOptions): Router<
  DrawerNavigationState<ParamListBase>,
  DrawerActionType | CommonNavigationAction
> {
  const router = TabRouter(rest) as unknown as Router<
    DrawerNavigationState<ParamListBase>,
    TabActionType | CommonNavigationAction
  >;

  return {
    ...router,

    type: 'drawer',

    getInitialState({ routeNames, routeParamList, routeGetIdList }) {
      let state = router.getInitialState({
        routeNames,
        routeParamList,
        routeGetIdList,
      });

      if (defaultStatus === 'open') {
        state = openDrawer(state);
      }

      return {
        ...state,
        stale: false,
        type: 'drawer',
        key: `drawer-${nanoid()}`,
      };
    },

    getRehydratedState(
      partialState,
      { routeNames, routeParamList, routeGetIdList }
    ) {
      if (partialState.stale === false) {
        return partialState;
      }

      let state = router.getRehydratedState(partialState, {
        routeNames,
        routeParamList,
        routeGetIdList,
      });

      if (isDrawerOpen(partialState)) {
        state = openDrawer(state);
      }

      return {
        ...state,
        type: 'drawer',
        key: `drawer-${nanoid()}`,
      };
    },

    getStateForRouteFocus(state, key) {
      const result = router.getStateForRouteFocus(state, key);

      if (defaultStatus === 'open') {
        return openDrawer(result);
      }

      return closeDrawer(result);
    },

    getStateForAction(state, action, options) {
      switch (action.type) {
        case 'OPEN_DRAWER':
          return openDrawer(state);

        case 'CLOSE_DRAWER':
          return closeDrawer(state);

        case 'TOGGLE_DRAWER':
          if (isDrawerOpen(state)) {
            return closeDrawer(state);
          }

          return openDrawer(state);

        case 'GO_BACK':
          if (defaultStatus === 'open') {
            if (!isDrawerOpen(state)) {
              return openDrawer(state);
            }
          } else {
            if (isDrawerOpen(state)) {
              return closeDrawer(state);
            }
          }

          return router.getStateForAction(state, action, options);

        default:
          return router.getStateForAction(state, action, options);
      }
    },

    actionCreators: DrawerActions,
  };
}
