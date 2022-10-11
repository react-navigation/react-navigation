import {
  getStateFromPath,
  NavigationHelpersContext,
} from '@react-navigation/core';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';

import extractPathFromURL from './extractPathFromURL';
import LinkingContext from './LinkingContext';

function useConditionalLinking() {
  const navigation = React.useContext(NavigationHelpersContext);
  const linking = React.useContext(LinkingContext);

  const { options, getLastLinkingUrl } = linking;

  // TODO: clear this mess
  if (!options) return;

  const { config, prefixes } = options;

  if (!config || !prefixes) return;

  const url = getLastLinkingUrl?.();

  if (!url) return;

  const path = extractPathFromURL(prefixes, url);

  // First we parse the URL to get the desired state
  const getStateFromPathHelper = options?.getStateFromPath ?? getStateFromPath;

  if (!path) return;

  const rootState = getStateFromPathHelper(path, config);

  if (!rootState) return;

  const { routes } = rootState;

  const routesWithKey = routes.map((route) => ({
    ...route,
    key: `${route.name}-${nanoid()}`,
  }));

  const state = navigation?.getState();

  // Then we traverse the root state and find the part of the state that corresponds to this navigator
  const nextState = {
    ...state,
    routes: routesWithKey,
  };

  // Once we have the state, we can tell React Navigation to use it for next route names change (conditional rendering logic change)
  // @ts-ignore
  navigation?.setStateForNextRouteNamesChange(nextState);
}

export default useConditionalLinking;
