import type { NavigationState } from '@react-navigation/routers';
import * as React from 'react';

import { NavigationContainerRefContext } from './NavigationContainerRefContext';
import {
  NavigationContext,
  NavigationRouteNameContext,
} from './NavigationProvider';
import type {
  NavigationListForNavigator,
  NavigationListForNested,
  NavigationProp,
  RootNavigator,
  RootParamList,
} from './types';

/**
 * Use a stripped down NavigationProp if no screen is specified.
 *
 * The hook can be used in `NavigationContainer` directly, not inside of a navigator.
 * So navigator specific methods won't be available.
 */
export type GenericNavigation<ParamList extends {}> = Omit<
  NavigationProp<ParamList>,
  'getState' | 'setParams' | 'replaceParams' | 'pushParams' | 'setOptions'
> & {
  /**
   * Returns the navigator's state.
   *
   * This may return `undefined` if used outside of a navigator,
   * as the navigator may not have rendered yet
   */
  getState(): NavigationState | undefined;

  /**
   * Update the param object for the route.
   * The new params will be shallow merged with the old one.
   *
   * @param params Partial params object for the current route.
   */
  setParams(
    // We don't know which route to set params for
    params: unknown
  ): void;

  /**
   * Replace the param object for the route
   *
   * @param params Params object for the current route.
   */
  replaceParams(
    // We don't know which route to replace params for
    params: unknown
  ): void;

  /**
   * Push new params for the route.
   * The params are not merged with previous params.
   * This adds an entry to navigation history.
   *
   * @param params Params object for the current route.
   */
  pushParams(
    // We don't know which route to push params for
    params: unknown
  ): void;

  /**
   * Update the options for the route.
   * The options object will be shallow merged with default options object.
   *
   * @param options Partial options object for the current screen.
   */
  setOptions(
    // We don't know which navigator to set options for
    options: unknown
  ): void;
};

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * If the route name of the current or one of the parents is specified,
 * the navigation prop for that route is returned.
 *
 * @returns Navigation prop of the parent screen.
 */
export function useNavigation(): GenericNavigation<RootParamList>;
export function useNavigation<
  const Navigator = RootNavigator,
>(): NavigationListForNavigator<Navigator>[keyof NavigationListForNavigator<Navigator>];
export function useNavigation<
  const Navigator = RootNavigator,
  const RouteName extends
    keyof NavigationListForNested<Navigator> = keyof NavigationListForNested<Navigator>,
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

  const routeName = React.use(NavigationRouteNameContext);

  // Generally, this condition isn't needed as `getParent(name)` works for current screen
  // However, it'll throw if the hook is used in a preloaded screen
  if (routeName === name) {
    if (navigation === undefined) {
      throw new Error(
        `Couldn't find a navigation object for '${name}'. This is not expected.`
      );
    }

    return navigation;
  }

  // We get parent first so that `getParent(name)` is not called in preloaded screens
  // It's ok since `getParent` also works for current screen, so parent is not skipped
  const parent = navigation?.getParent()?.getParent(name);

  if (parent === undefined) {
    throw new Error(
      `Couldn't find a navigation object for '${name}' in current or any parent screens. Is your component inside the correct screen?`
    );
  }

  return parent;
}
