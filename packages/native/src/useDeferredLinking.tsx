import {
  getStateFromPath,
  NavigationContext,
  useRoute,
} from '@react-navigation/core';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';

import { extractPathFromURL } from './extractPathFromURL';
import { LinkingContext } from './LinkingContext';

export function useDeferredLinking() {
  const navigation = React.useContext(NavigationContext);
  const linking = React.useContext(LinkingContext);

  const { name: routeName } = useRoute();
  const { options, lastUnhandledURL } = linking;

  if (navigation == null) {
    throw Error(
      "Couldn't find a navigation context. Is your component inside NavigationContainer?"
    );
  }

  if (options == null) {
    console.warn(
      `Looks like you're using 'useLinkingOnConditionalRender' hook inside ${routeName} screen without configured links. This has no effect. Either provide linking configuration to the NavigationContainer or remove this hook to get rid of this warning.`
    );
  }

  /*
   * Function to handle last unhandled URL. This function has to be called when the conditional
   * rendering of the navigator is about to happen e.g. in the `onPress` of a log in button.
   */
  const handleLastLinkingUrl = () => {
    if (options == null || lastUnhandledURL?.current == null) {
      // noop, nothing to handle
      return;
    }

    const { config, prefixes } = options;

    const path = extractPathFromURL(prefixes, lastUnhandledURL.current);

    // First, we parse the URL to get the desired state
    const getStateFromPathHelper =
      options?.getStateFromPath ?? getStateFromPath;

    let rootState = getStateFromPathHelper(path ?? '', config);
    if (!rootState) {
      // is that possible?
      return;
    }

    const parent = navigation.getParent();
    if (parent) {
      // Then, we consider a portion of the state.
      const parentState = navigation.getParent()!.getState();
      const outerRouteName = parentState.routeNames[parentState.index];
      let state: typeof rootState | undefined = rootState;
      while (state?.routes[0].name !== outerRouteName && state) {
        state = state.routes[0].state;
      }
      if (!state) {
        return;
      }
      const innerState = state.routes[0].state;
      if (!innerState) {
        return;
      }
      rootState = innerState;
    }

    // Then we traverse the root state and find the part of the state that corresponds to this navigator
    const routesWithKey =
      rootState?.routes.map((route) => ({
        ...route,
        key: `${route.name}-${nanoid()}`,
      })) ?? [];

    const state = navigation.getState();

    const nextState = {
      ...state,
      routes: routesWithKey,
    };

    // Once we have the state, we can tell React Navigation to use it for next route names change (conditional rendering logic change)
    navigation.setStateForNextRouteNamesChange(nextState);

    // Finally, we clear unhandled link after it was handled
    lastUnhandledURL.current = undefined;
  };

  return handleLastLinkingUrl;
}
