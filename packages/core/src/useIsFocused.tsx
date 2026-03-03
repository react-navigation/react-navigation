import * as React from 'react';

export const FocusedRouteKeyContext = React.createContext<string | undefined>(
  undefined
);

export const IsFocusedContext = React.createContext<boolean | undefined>(
  undefined
);

/**
 * Hook to get the current focus state of the screen. Returns a `true` if screen is focused, otherwise `false`.
 * This can be used if a component needs to render something based on the focus state.
 */
export function useIsFocused(): boolean {
  const isFocused = React.use(IsFocusedContext);

  if (isFocused === undefined) {
    throw new Error(
      "Couldn't determine focus state. Is your component inside a screen in a navigator?"
    );
  }

  return isFocused;
}
