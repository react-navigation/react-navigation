import {
  CommonActions,
  getActionFromState,
  getPathFromState,
  IsScreenContext,
  NavigationContainerRefContext,
  useStateForPath,
} from '@react-navigation/core';
import * as React from 'react';

import { getStateFromHref } from './getStateFromHref';
import { LinkingContext } from './LinkingContext';

type MinimalState = {
  routes: [
    {
      name: string;
      params?: object | undefined;
      state?: MinimalState | undefined;
    },
  ];
};

/**
 * Helper to build a href for a screen based on the linking options.
 */
export function useBuildHref() {
  const isScreen = React.use(IsScreenContext);

  const { options } = React.use(LinkingContext);

  const focusedRouteState = useStateForPath();

  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState;

  const buildHref = React.useCallback(
    (name: string, params?: object) => {
      if (options?.enabled === false) {
        return undefined;
      }

      const stateForRoute: MinimalState = {
        routes: [{ name, params }],
      };

      const constructState = (
        state: MinimalState | undefined
      ): MinimalState => {
        if (state) {
          const route = state.routes[0];

          // If we're inside a screen and at the innermost route
          // We need to replace the state with the provided one
          // This assumes that we're navigating to a sibling route
          if (isScreen && !route.state) {
            return stateForRoute;
          }

          // Otherwise, dive into the nested state of the route
          return {
            routes: [
              {
                ...route,
                state: constructState(route.state),
              },
            ],
          };
        }

        // Once there is no more nested state, we're at the innermost route
        // We can add a state based on provided parameters
        // This assumes that we're navigating to a child of this route
        // In this case, the helper is used in a navigator for its routes
        return stateForRoute;
      };

      const state = constructState(focusedRouteState);
      const path = getPathFromStateHelper(state, options?.config);

      return path;
    },
    [
      options?.enabled,
      options?.config,
      isScreen,
      focusedRouteState,
      getPathFromStateHelper,
    ]
  );

  return buildHref;
}

/**
 * Helper to build a navigation action from a href based on the linking options.
 */
export function useBuildAction() {
  const navigation = React.use(NavigationContainerRefContext);

  if (navigation === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }

  const { options } = React.use(LinkingContext);

  const getActionFromStateHelper =
    options?.getActionFromState ?? getActionFromState;

  const buildAction = React.useCallback(
    (href: string) => {
      const state = getStateFromHref(href, options, navigation.getRootState());

      if (state) {
        const action = getActionFromStateHelper(state, options?.config);

        return action ?? CommonActions.reset(state);
      } else {
        throw new Error(
          `Failed to parse href '${href}' to a navigation state.`
        );
      }
    },
    [navigation, options, getActionFromStateHelper]
  );

  return buildAction;
}

/**
 * Helpers to build href or action based on the linking options.
 *
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
export function useLinkBuilder() {
  const buildHref = useBuildHref();
  const buildAction = useBuildAction();

  return {
    buildHref,
    buildAction,
  };
}
