import * as React from 'react';

/**
 * This is unused, and currently does nothing.
 * But left as an export to avoid breaking consumers who might be using it.
 *
 * @deprecated
 */
export const UnhandledLinkingContext = React.createContext<{
  lastUnhandledLink: string | undefined;
  setLastUnhandledLink: (lastUnhandledUrl: string | undefined) => void;
}>({
  lastUnhandledLink: undefined,
  setLastUnhandledLink: () => {},
});

UnhandledLinkingContext.displayName = 'UnhandledLinkingContext';
