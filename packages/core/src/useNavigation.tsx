import * as React from 'react';

import { NavigationContainerRefContext } from './NavigationContainerRefContext';
import { NavigationContext } from './NavigationProvider';
import type {
  GenericNavigation,
  NavigationListForNavigator,
  NavigationListForNested,
  RootNavigator,
  RootParamList,
} from './types';

type RootNavigation = GenericNavigation<RootParamList>;

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * If the route name of the current or one of the parents is specified,
 * the navigation prop for that route is returned.
 *
 * @returns Navigation prop of the parent screen.
 */
export function useNavigation(): RootNavigation;
export function useNavigation<
  const Navigator = RootNavigator,
>(): NavigationListForNavigator<Navigator>[keyof NavigationListForNavigator<Navigator>];
export function useNavigation<
  const Navigator = RootNavigator,
  const RouteName extends keyof NavigationListForNested<Navigator> =
    keyof NavigationListForNested<Navigator>,
>(name: RouteName): NavigationListForNested<Navigator>[RouteName];
export function useNavigation(name?: string): unknown {
  const root = React.use(NavigationContainerRefContext);
  const navigation = React.use(NavigationContext);

  if (name === undefined) {
    if (navigation === undefined && root === undefined) {
      throw new Error(
        "Couldn't find a navigation object. Is your component inside NavigationContainer?"
      );
    }

    return navigation ?? root;
  }

  const parent = navigation?.getParent(name);

  if (parent === undefined) {
    throw new Error(
      `Couldn't find a navigation object for '${name}' in current or any parent screens. Is your component inside the correct screen?`
    );
  }

  return parent;
}
