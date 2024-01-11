import {
  getStateFromPath,
  NavigationContext,
  type NavigationState,
  type PartialState,
} from '@react-navigation/core';
import React from 'react';
import useLatestCallback from 'use-latest-callback';

import { LinkingContext } from './LinkingContext';
import { UnhandledLinkingContext } from './UnhandledLinkingContext';

// FIXME: don't rely on depth only to get the navigator state
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

export function UNSTABLE_useUnhandledLinking() {
  const navigation = React.useContext(NavigationContext);
  const linking = React.useContext(LinkingContext);
  const { setLastUnhandledLink, lastUnhandledLink } = React.useContext(
    UnhandledLinkingContext
  );

  const { options } = linking;

  const getStateForRouteNamesChange = (
    currentState: NavigationState
  ): PartialState<NavigationState> | undefined => {
    if (lastUnhandledLink == null) {
      // noop, nothing to handle
      return;
    }

    // at web, the path is already extracted
    const path = lastUnhandledLink;
    if (!lastUnhandledLink) {
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

  const clearUnhandledLink = useLatestCallback(() => {
    setLastUnhandledLink(undefined);
  });

  return {
    lastUnhandledLink,
    getStateForRouteNamesChange,
    clearUnhandledLink,
  };
}
