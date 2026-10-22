import * as React from 'react';

export const CanGoBackRouteKeysContext = React.createContext<
  ReadonlySet<string> | undefined
>(undefined);

export const CanGoBackContext = React.createContext<boolean | undefined>(
  undefined
);

/**
 * Hook to get whether the current screen can go back.
 */
export function useCanGoBack(): boolean {
  const canGoBack = React.use(CanGoBackContext);

  if (canGoBack === undefined) {
    throw new Error(
      "Couldn't determine whether the screen can go back. Is your component inside a screen in a navigator?"
    );
  }

  return canGoBack;
}
