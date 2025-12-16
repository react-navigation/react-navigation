import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import {
  NamedRouteContextListContext,
  NavigationRouteContext,
} from './NavigationProvider';
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
>(): {} extends ParamList
  ? RouteProp<ParamListBase>
  : ParamList extends ParamListBase
    ? RouteForName<ParamList, string>
    : RouteProp<ParamListBase>;

export function useRoute(name?: string) {
  if (name === undefined) {
    const route = React.use(NavigationRouteContext);

    if (route === undefined) {
      throw new Error(
        "Couldn't find a route object. Is your component inside a screen in a navigator?"
      );
    }

    return route;
  }

  const NamedRouteContextList = React.use(NamedRouteContextListContext);

  if (NamedRouteContextList === undefined) {
    throw new Error(
      "Couldn't find a parent screen. Is your component inside a screen in a navigator?"
    );
  }

  const NamedRouteContext = NamedRouteContextList[name];

  if (NamedRouteContext === undefined) {
    throw new Error(
      `Couldn't find a route named '${name}' in any of the parent screens. Is your component inside the correct screen?`
    );
  }

  const route = React.use(NamedRouteContext);

  return route;
}
