import {
  getStateFromPath,
  NavigationHelpersContext,
  NavigationState,
} from '@react-navigation/core';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';

import extractPathFromURL from './extractPathFromURL';
import LinkingContext from './LinkingContext';

function useLinkingOnConditionalRender() {
  const navigation = React.useContext(NavigationHelpersContext);
  const linking = React.useContext(LinkingContext);

  const { options, lastUnhandledURL } = linking;

  /*
   * Function to handle last unhandled URL.
   * This function has to be called when the conditional rendering of the navigator is about to happen
   * e.g. in the `onPress` of a button
   */
  const handleLastLinkingUrl = () => {
    // TODO: clear this mess
    if (!options) return;

    const { config, prefixes } = options;
    // TODO: clear this very mess
    if (!config || !prefixes || !lastUnhandledURL) return;

    const path = extractPathFromURL(prefixes, lastUnhandledURL?.current ?? '');

    // cleanup
    lastUnhandledURL.current = undefined;

    // First we parse the URL to get the desired state
    const getStateFromPathHelper =
      options?.getStateFromPath ?? getStateFromPath;

    if (!path) return;

    const rootState = getStateFromPathHelper(path, config);

    if (!rootState) return;

    const { routes } = rootState;

    const routesWithKey = routes.map((route) => ({
      ...route,
      key: `${route.name}-${nanoid()}`,
    }));

    if (!navigation) return;

    const state: NavigationState = navigation.getState();

    // Then we traverse the root state and find the part of the state that corresponds to this navigator
    const nextState = {
      ...state,
      routes: routesWithKey,
    };

    // Once we have the state, we can tell React Navigation to use it for next route names change (conditional rendering logic change)
    navigation.setStateForNextRouteNamesChange(nextState);
  };

  return handleLastLinkingUrl;
}

export default useLinkingOnConditionalRender;
