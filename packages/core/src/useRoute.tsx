import type { ParamListBase, Route } from '@react-navigation/routers';
import * as React from 'react';

import { NavigationRouteContext } from './NavigationRouteContext';
import type { ParamListRoute, ParamsForRoute, RouteProp } from './types';

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
export function useRoute<
  RootParamList extends {} = ReactNavigation.RootParamList,
  RouteName extends AllRouteNames<RootParamList> = AllRouteNames<RootParamList>,
>(
  name: RouteName
): Route<
  RouteName,
  RootParamList extends ParamListBase
    ? ParamsForRoute<RootParamList, RouteName>
    : undefined
>;
export function useRoute<
  RootParamList extends {} = ReactNavigation.RootParamList,
>(): RootParamList extends ParamListBase
  ? ParamListRoute<RootParamList>
  : RouteProp<ParamListBase>;
export function useRoute(name?: string) {
  const route = React.useContext(NavigationRouteContext);

  if (route === undefined) {
    throw new Error(
      "Couldn't find a route object. Is your component inside a screen in a navigator?"
    );
  }

  if (name !== undefined && route.name !== name) {
    throw new Error(
      `The provided route name ('${name}') doesn't match the current route's name ('${route.name}'). It must be used in the '${name}' screen.`
    );
  }

  return route;
}

/**
 * Get all possible route names from a param list and its nested navigators.
 */
type AllRouteNames<RootParamList extends {}> =
  RootParamList extends ParamListBase
    ? ParamListRoute<RootParamList>['name']
    : string;
