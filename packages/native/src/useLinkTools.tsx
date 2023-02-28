import {
  CommonActions,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  NavigationHelpers,
  NavigationHelpersContext,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/core';
import * as React from 'react';

import { LinkingContext } from './LinkingContext';

type NavigationObject =
  | NavigationHelpers<ParamListBase>
  | NavigationProp<ParamListBase>;

type MinimalState = {
  index: number;
  routes: { name: string; params?: object; state?: MinimalState }[];
};

const getRootStateForNavigate = (
  navigation: NavigationObject,
  state: MinimalState
): MinimalState => {
  const parent = navigation.getParent();

  if (parent) {
    const parentState = parent.getState();

    return getRootStateForNavigate(parent, {
      index: 0,
      routes: [
        {
          ...parentState.routes[parentState.index],
          state: state,
        },
      ],
    });
  }

  return state;
};

/**
 * Build destination link for a navigate action.
 * Useful for showing anchor tags on the web for buttons that perform navigation.
 */
export function useLinkTools() {
  const navigation = React.useContext(NavigationHelpersContext);
  const linking = React.useContext(LinkingContext);

  const buildHref = React.useCallback(
    (name: string, params?: object) => {
      const { options } = linking;

      if (options?.enabled === false) {
        return undefined;
      }

      const state = navigation
        ? getRootStateForNavigate(navigation, {
            index: 0,
            routes: [{ name, params }],
          })
        : // If we couldn't find a navigation object in context, we're at root
          // So we'll construct a basic state object to use
          {
            index: 0,
            routes: [{ name, params }],
          };

      const path = options?.getPathFromState
        ? options.getPathFromState(state, options?.config)
        : getPathFromState(state, options?.config);

      return path;
    },
    [linking, navigation]
  );

  const buildAction = React.useCallback(
    (href: string) => {
      if (!href.startsWith('/')) {
        throw new Error(`The path must start with '/' (${href}).`);
      }

      const { options } = linking;

      const state = options?.getStateFromPath
        ? options.getStateFromPath(href, options.config)
        : getStateFromPath(href, options?.config);

      if (state) {
        const action = getActionFromState(state, options?.config);

        return action ?? CommonActions.reset(state);
      } else {
        throw new Error('Failed to parse the path to a navigation state.');
      }
    },
    [linking]
  );

  return {
    buildHref,
    buildAction,
  };
}
