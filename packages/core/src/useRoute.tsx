import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import {
  NamedRouteContextListContext,
  NavigationRouteContext,
} from './NavigationProvider';
import type {
  NestedParamLists,
  RootParamList,
  RouteForName,
  RouteProp,
} from './types';
import type { KeyOf } from './utilities';

/**
 * Get all possible route names from a param list and its nested navigators.
 * Recurses into the param lists directly instead of using `RouteForName`,
 * So the route objects don't need to be built just to get the names.
 */
type AllRouteNames<ParamList extends {}> =
  | KeyOf<ParamList>
  | AllNestedRouteNames<NestedParamLists<ParamList>>;

// Distributes over the union of nested param lists
type AllNestedRouteNames<ParamLists> =
  ParamLists extends infer ParamList extends {}
    ? AllRouteNames<ParamList>
    : never;

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
export function useRoute<
  const ParamList extends {} = RootParamList,
  const RouteName extends string = string,
>(
  // `NoInfer` so `RouteName` is inferred from the name as a literal,
  // instead of TS matching it against the union and inferring nothing
  name: RouteName & NoInfer<AllRouteNames<ParamList>>
): RouteForName<ParamList, RouteName>;
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
