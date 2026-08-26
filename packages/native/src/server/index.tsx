import {
  findFocusedRoute,
  type FocusedRouteState,
  type NavigationState,
  type PartialState,
} from '@react-navigation/core';
import {
  ServerStateContext,
  type ServerStateRecord,
} from '@react-navigation/core/internal';
import isEqual from 'fast-deep-equal';
import * as React from 'react';

import { ServerContext } from './ServerContext';

export type ServerRedirect = {
  href: string;
};

export type ServerHandle = {
  /**
   * Get the redirect for the rendered navigation state if needed.
   *
   * A redirect is needed when the requested URL doesn't match the URL
   * for the navigation state that was actually rendered on the server,
   * e.g. when the URL is for a screen that's conditionally not rendered.
   * This includes URLs that don't match any screen, such as the root URL
   * when no screen is mapped to the empty path, which redirect to the URL
   * for the initial screen, same as the URL update on the client.
   *
   * The result should be checked in `onShellReady` or later.
   * When the URL is for a screen that's suspended at that point,
   * no redirect is returned until the screen has rendered.
   * When the URL doesn't match any screen, a redirect returned while
   * screens are suspended may point to a partially rendered state,
   * and needs another redirect on the next request to converge.
   * Check in `onAllReady` instead when the final URL is required.
   *
   * The `getPathFromState` from the linking options is called with a
   * minimal state for the focused route, in the same shape as the state
   * from `useStateForPath`, and not with the full navigation state as on
   * the client. This is only observable in a custom implementation that
   * reads more than the focused route from the state.
   *
   * Navigators rendered inside a `Suspense` fallback take part in the
   * detection, and their screens may remain part of the result even
   * after the fallback is replaced by the suspended content.
   * So avoid rendering navigators inside `Suspense` fallbacks.
   *
   * @returns Object with the `href` to redirect to, or `undefined`.
   */
  getRedirect(): ServerRedirect | undefined;
};

export type ServerContainerProps = {
  location: URL;
  handle?: ServerHandle | undefined;
  children: React.ReactNode;
};

type HandleRecord = ServerStateRecord & {
  location?: URL | undefined;
};

const records = new WeakMap<ServerHandle, HandleRecord>();

type StateLike = {
  index?: number;
  routes: { name: string; state?: StateLike | undefined }[];
};

/**
 * Get the route names for the focused route chain in the state.
 */
const getFocusedRouteNames = (state: StateLike | undefined): string[] => {
  const names: string[] = [];

  let current = state;

  while (current != null) {
    const route = current.routes[current.index ?? current.routes.length - 1];

    if (route == null) {
      break;
    }

    names.push(route.name);
    current = route.state;
  }

  return names;
};

/**
 * Get the path for the focused route state based on the linking options.
 *
 * If the focused route has a `path` from the original URL that still
 * matches the route, it's preserved, same as `useLinking` does on the
 * client when it syncs the URL after render.
 */
const getPathForFocusedState = (
  focusedState: FocusedRouteState,
  linking: NonNullable<ServerStateRecord['linking']>
): string => {
  const route = findFocusedRoute(focusedState);

  // Also skip an empty `path` here, same as the check on the client
  if (route?.path) {
    let stateForPath: PartialState<NavigationState> | undefined;

    try {
      stateForPath = linking.getStateFromPath(route.path, linking.config);
    } catch (e) {
      console.error(e);

      stateForPath = undefined;
    }

    if (stateForPath != null) {
      const focusedRoute = findFocusedRoute(stateForPath);

      if (
        focusedRoute != null &&
        focusedRoute.name === route.name &&
        isEqual(focusedRoute.params, route.params)
      ) {
        return route.path;
      }
    }
  }

  return linking.getPathFromState(focusedState, linking.config);
};

/**
 * Create a handle to get results out of server rendering,
 * such as a redirect when the URL doesn't match the rendered state.
 *
 * A handle must only be used for a single render.
 *
 * Pass the handle to `ServerContainer` and query it after the shell
 * has rendered, e.g. in `onShellReady` of `renderToPipeableStream`:
 *
 * ```js
 * const handle = createServerHandle();
 *
 * const { pipe, abort } = renderToPipeableStream(
 *   <ServerContainer location={location} handle={handle}>
 *     <App />
 *   </ServerContainer>,
 *   {
 *     onShellReady() {
 *       const redirect = handle.getRedirect();
 *
 *       if (redirect) {
 *         response.writeHead(302, { Location: redirect.href });
 *         response.end();
 *         abort();
 *         return;
 *       }
 *
 *       response.statusCode = 200;
 *       response.setHeader('Content-Type', 'text/html');
 *       pipe(response);
 *     },
 *   }
 * );
 * ```
 */
export function createServerHandle(): ServerHandle {
  const record: HandleRecord = {};

  const handle: ServerHandle = {
    getRedirect() {
      const { location, focusedState, linking } = record;

      if (location == null || focusedState == null || linking == null) {
        return undefined;
      }

      const requestedPath = location.pathname + location.search;
      const renderedPath = getPathForFocusedState(focusedState, linking);

      if (renderedPath === requestedPath) {
        return undefined;
      }

      let requestedState: PartialState<NavigationState> | undefined;

      try {
        requestedState = linking.getStateFromPath(
          requestedPath,
          linking.config
        );
      } catch (e) {
        console.error(e);

        requestedState = undefined;
      }

      // When the URL doesn't match any screen, the prefix check is skipped
      // Then a redirect may be based on a partially rendered tree and needs
      // another redirect on the next request, but it converges to a stable URL
      if (requestedState != null) {
        const renderedNames = getFocusedRouteNames(focusedState);
        const requestedNames = getFocusedRouteNames(requestedState);

        // If the rendered routes are a prefix of the routes for the URL,
        // then deeper screens may not have rendered yet, e.g. when lazy
        // screens are suspended, so it's too early to decide on a redirect
        if (
          renderedNames.length < requestedNames.length &&
          renderedNames.every((name, i) => requestedNames[i] === name)
        ) {
          return undefined;
        }
      }

      return { href: renderedPath };
    },
  };

  records.set(handle, record);

  return handle;
}

/**
 * Provider for request-scoped server navigation state.
 */
export function ServerContainer({
  location,
  handle,
  children,
}: ServerContainerProps) {
  const record = handle != null ? records.get(handle) : undefined;

  if (handle != null && record == null) {
    throw new Error(
      "The 'handle' prop must be an object created with 'createServerHandle()'. This error can also occur if the bundle contains multiple copies of '@react-navigation/native'."
    );
  }

  if (record != null) {
    record.location = location;
  }

  const value = React.useMemo(() => ({ location }), [location]);

  return (
    <ServerStateContext.Provider value={record}>
      <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
    </ServerStateContext.Provider>
  );
}
