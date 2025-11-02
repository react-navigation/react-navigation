import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { NavigationRouteContext } from './NavigationProvider';
import type { RouteForName, RouteProp } from './types';

/**
 * Get all possible route names from a param list and its nested navigators.
 */
type AllRouteNames<RootParamList extends {}> = RouteForName<
  RootParamList,
  string
>['name'];

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
export function useRoute<
  RootParamList extends {} = ReactNavigation.RootParamList,
  RouteName extends AllRouteNames<RootParamList> = AllRouteNames<RootParamList>,
>(name: RouteName): RouteForName<RootParamList, RouteName>;
export function useRoute<
  RootParamList extends {} = ReactNavigation.RootParamList,
>(): RootParamList extends ParamListBase
  ? RouteForName<RootParamList, string>
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
