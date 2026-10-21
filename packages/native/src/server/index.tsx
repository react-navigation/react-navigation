import * as React from 'react';

import { ServerContext, type ServerContextType } from './ServerContext';

export type ServerContainerRef = {
  /**
   * Get the location to redirect to if the rendered navigation state doesn't match the requested location.
   * e.g. when the screen for the location isn't rendered due to a condition, or the path isn't canonical.
   *
   * This only includes navigators that have rendered so far.
   * So call it in `onShellReady` or `onAllReady` before sending the response.
   *
   * @returns URL to redirect to, or `undefined` if no redirect is needed.
   */
  getRedirect(): URL | undefined;
};

export type ServerContainerProps = {
  location: URL;
  children: React.ReactNode;
  ref?: React.Ref<ServerContainerRef> | undefined;
};

/**
 * Provider for request-scoped server navigation state.
 */
export function ServerContainer({
  location,
  children,
  ref,
}: ServerContainerProps) {
  const value = React.useMemo<ServerContextType>(
    () => ({ location }),
    [location]
  );

  if (ref) {
    const instance: ServerContainerRef = {
      getRedirect() {
        const path = value.getPath?.();

        if (path == null || path === location.pathname + location.search) {
          return undefined;
        }

        // Paths starting with `//` would be treated as protocol-relative URLs
        // So we join it with the origin to avoid redirecting to a different host
        // A custom `getPathFromState` may also return a path without a leading `/`
        return new URL(
          location.origin + (path.startsWith('/') ? path : `/${path}`)
        );
      },
    };

    // We write to the `ref` during render instead of `React.useImperativeHandle`
    // This is because `useImperativeHandle` will update the ref after 'commit',
    // and there's no 'commit' phase during SSR.
    // Mutating ref during render is unsafe in concurrent mode, but we don't care about it for SSR.
    if (typeof ref === 'function') {
      ref(instance);
    } else {
      ref.current = instance;
    }
  }

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
}
