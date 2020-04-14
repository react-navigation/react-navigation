import * as React from 'react';
import {
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  EventMapBase,
  getPathFromState,
} from '@react-navigation/core';
import LinkingContext from './LinkingContext';

type NavigationObject =
  | NavigationHelpers<ParamListBase>
  | NavigationProp<ParamListBase>;

type MinimalState = {
  index: number;
  routes: { name: string; params?: object; state?: MinimalState }[];
};

const getRootState = (
  navigation: NavigationObject,
  state: MinimalState
): MinimalState => {
  const parent = navigation.dangerouslyGetParent();

  if (parent) {
    const parentState = parent.dangerouslyGetState();

    return getRootState(parent, {
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
 *
 * @param options.navigation Navigation object for the navigator.
 */
export default function useLinkBuilder({
  navigation,
}: {
  navigation: NavigationHelpers<ParamListBase, EventMapBase>;
}) {
  const linking = React.useContext(LinkingContext);

  const buildLink = React.useCallback(
    (name: string, params?: object) => {
      const { options } = linking;

      const state = getRootState(navigation, {
        index: 0,
        routes: [{ name, params }],
      });

      const path = options?.getPathFromState
        ? options.getPathFromState(state, options?.config)
        : getPathFromState(state, options?.config);

      return path;
    },
    [linking, navigation]
  );

  return buildLink;
}
