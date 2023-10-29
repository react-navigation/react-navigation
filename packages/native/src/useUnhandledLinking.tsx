import {
  getStateFromPath,
  NavigationContainerRefContext,
  NavigationContext,
  NavigationProp,
  NavigationRootStateContext,
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
  useNavigation,
} from '@react-navigation/core';
import React from 'react';
import useLatestCallback from 'use-latest-callback';

import { LinkingContext } from './LinkingContext';

function extractNavigatorSpecificState(
  _: NavigationState,
  pathState: PartialState<NavigationState>,
  depth: number
) {
  let partialPathState: PartialState<NavigationState> | undefined = pathState;

  let currentDepth = depth;
  while (currentDepth) {
    if (!partialPathState) {
      return undefined;
    }
    partialPathState =
      partialPathState.routes[partialPathState.routes.length - 1].state;
    currentDepth--;
  }
  return partialPathState;
}

export function useUnhandledLinking() {
  const navigation = React.useContext(NavigationContext);
  const linking = React.useContext(LinkingContext);

  const { options, lastUnhandledLinking } = linking;

  /*
   * Function to handle last unhandled URL. This function has to be called when the conditional
   * rendering of the navigator is about to happen e.g. in the `onPress` of a log in button.
   */
  const handleOnNextRouteNamesChange = () => {
    if (lastUnhandledLinking?.current == null) {
      // noop, nothing to handle
      return;
    }

    // at web, the path is already extracted
    const path = lastUnhandledLinking.current;
    if (!lastUnhandledLinking.current) {
      return;
    }

    // First, we parse the URL to get the desired state
    const getStateFromPathHelper =
      options?.getStateFromPath ?? getStateFromPath;

    const pathState = getStateFromPathHelper(path, options?.config);

    if (!pathState) {
      return;
    }
    // const state = extractNavigatorSpecificState(navigation.gepathState);

    // if (!state) {
    //   return;
    // }

    // Once we have the state, we can tell React Navigation to use it for next route names change (conditional rendering logic change)
    // @ts-expect-error: this is ok
    navigation.setStateForNextRouteNamesChange(state);

    // Finally, we clear unhandled link after it was handled
    lastUnhandledLinking.current = undefined;
  };

  const getStateForRouteNamesChange = (
    currentState: NavigationState
  ): PartialState<NavigationState> | undefined => {
    if (lastUnhandledLinking?.current == null) {
      // noop, nothing to handle
      return;
    }

    // at web, the path is already extracted
    const path = lastUnhandledLinking.current;
    if (!lastUnhandledLinking.current) {
      return;
    }

    // First, we parse the URL to get the desired state
    const getStateFromPathHelper =
      options?.getStateFromPath ?? getStateFromPath;

    const pathState = getStateFromPathHelper(path, options?.config);

    if (!pathState) {
      return;
    }

    let depth = 0;
    let parent = navigation;
    while (parent) {
      depth++;
      parent = parent.getParent();
    }

    const state = extractNavigatorSpecificState(currentState, pathState, depth);

    if (!state) {
      return;
    }

    return state;
  };

  const getUnhandledLink = useLatestCallback(
    () => lastUnhandledLinking.current
  );

  const clearUnhandledLink = useLatestCallback(() => {
    lastUnhandledLinking.current = undefined;
  });

  return {
    getUnhandledLink,
    getStateForRouteNamesChange,
    clearUnhandledLink,
  };
}
