import {
  type SwitchActionType as TabActionType,
  SwitchRouter,
  type SwitchRouterOptions as TabRouterOptions,
} from './SwitchRouter';
import type {
  CommonNavigationAction,
  NavigationState,
  ParamListBase,
  Router,
} from './types';

export type { TabActionType, TabRouterOptions };

export type TabNavigationState<ParamList extends ParamListBase> = Omit<
  NavigationState<ParamList>,
  'history'
> & {
  /**
   * Type of the router, in this case, it's tab.
   */
  type: 'tab';
  /**
   * List of previously visited route keys.
   */
  history: { type: 'route'; key: string; params?: object | undefined }[];
  /**
   * List of routes' key, which are supposed to be preloaded before navigating to.
   */
  preloadedRouteKeys: string[];
};

export type TabActionHelpers<ParamList extends ParamListBase> = {
  /**
   * Jump to an existing tab.
   *
   * @param screen Name of the route to jump to.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends keyof ParamList>(
    ...args: RouteName extends unknown
      ? undefined extends ParamList[RouteName]
        ? [screen: RouteName, params?: ParamList[RouteName]]
        : [screen: RouteName, params: ParamList[RouteName]]
      : never
  ): void;
};

export const TabActions = {
  jumpTo(name: string, params?: object) {
    return {
      type: 'JUMP_TO',
      payload: { name, params },
    } as const satisfies TabActionType;
  },
};

export function TabRouter(
  options: TabRouterOptions
): Router<
  TabNavigationState<ParamListBase>,
  TabActionType | CommonNavigationAction
> {
  const router = SwitchRouter<'tab'>(options);

  return {
    ...router,

    type: 'tab',

    getInitialState(routerOptions) {
      const state = router.getInitialState(routerOptions);

      return {
        ...state,
        type: 'tab',
        key: `tab-${state.key}`,
      };
    },

    getRehydratedState(partialState, routerOptions) {
      if (partialState.stale === false) {
        return partialState;
      }

      const state = router.getRehydratedState(partialState, routerOptions);

      return {
        ...state,
        type: 'tab',
        key: `tab-${state.key}`,
      };
    },

    actionCreators: TabActions,
  };
}
