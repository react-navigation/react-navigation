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
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
export function useLinkBuilder() {
  const linking = React.useContext(LinkingContext);

  const focusedRouteState = useStateForPath();

  const buildHref = React.useCallback(
    (name: string, params?: object) => {
      const { options } = linking;

      if (options?.enabled === false) {
        return undefined;
      }

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

      const getPathFromStateHelper =
        options?.getPathFromState ?? getPathFromState;

      const state = addStateToInnermostRoute(focusedRouteState);
      const path = getPathFromStateHelper(state, options?.config);

      return path;
    },
    [focusedRouteState, linking]
  );

  const buildAction = React.useCallback(
    (href: string) => {
      if (!href.startsWith('/')) {
        throw new Error(`The href must start with '/' (${href}).`);
      }

      const { options } = linking;

      const state = options?.getStateFromPath
        ? options.getStateFromPath(href, options.config)
        : getStateFromPath(href, options?.config);

      if (state) {
        const action = getActionFromState(state, options?.config);

        return action ?? CommonActions.reset(state);
      } else {
        throw new Error('Failed to parse the href to a navigation state.');
      }
    },
    [linking]
  );

  return {
    buildHref,
    buildAction,
  };
}
