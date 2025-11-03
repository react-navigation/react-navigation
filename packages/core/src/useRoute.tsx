import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { NavigationRouteContext } from './NavigationProvider';
import type { RootParamList, RouteForName, RouteProp } from './types';

/**
 * Get all possible route names from a param list and its nested navigators.
 */
type AllRouteNames<ParamList extends {}> = RouteForName<
  ParamList,
  string
>['name'];

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
export function useRoute<
  const ParamList extends {} = RootParamList,
  const RouteName extends AllRouteNames<ParamList> = AllRouteNames<ParamList>,
>(name: RouteName): RouteForName<ParamList, RouteName>;
export function useRoute<
  const ParamList extends {} = RootParamList,
>(): ParamList extends ParamListBase
  ? RouteForName<ParamList, string>
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
