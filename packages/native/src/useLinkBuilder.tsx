import {
  CommonActions,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  useStateForPath,
} from '@react-navigation/core';
import * as React from 'react';

import { LinkingContext } from './LinkingContext';

type MinimalState = {
  routes: [{ name: string; params?: object; state?: MinimalState }];
};

/**
 * Helpers to build href or action based on the linking options.
 *
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
export function useLinkBuilder() {
  const { options } = React.useContext(LinkingContext);

  const focusedRouteState = useStateForPath();

  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState;
  const getStateFromPathHelper = options?.getStateFromPath ?? getStateFromPath;
  const getActionFromStateHelper =
    options?.getActionFromState ?? getActionFromState;

  const buildHref = React.useCallback(
    (name: string, params?: object) => {
      const addStateToInnermostRoute = (
        state: MinimalState | undefined
      ): MinimalState => {
        const route = state?.routes[0];

        if (route?.state) {
          return {
            routes: [
              {
                ...route,
                state: addStateToInnermostRoute(route.state),
              },
            ],
          };
        }

        return {
          routes: [{ name, params }],
        };
      };

      const state = addStateToInnermostRoute(focusedRouteState);
      const path = getPathFromStateHelper(state, options?.config);

      return path;
    },
    [options?.config, getPathFromStateHelper, focusedRouteState]
  );

  const buildAction = React.useCallback(
    (href: string) => {
      if (!href.startsWith('/')) {
        throw new Error(`The href must start with '/' (${href}).`);
      }

      const state = getStateFromPathHelper(href, options?.config);

      if (state) {
        const action = getActionFromStateHelper(state, options?.config);

        return action ?? CommonActions.reset(state);
      } else {
        throw new Error('Failed to parse the href to a navigation state.');
      }
    },
    [options?.config, getStateFromPathHelper, getActionFromStateHelper]
  );

  return {
    buildHref,
    buildAction,
  };
}
