import * as React from 'react';
import type { FocusedNavigationListener } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add listeners to be called for focused navigators.
 */
export default function useFocusedListeners() {
  const { current: listeners } = React.useRef<FocusedNavigationListener[]>([]);

  const addListener = React.useCallback(
    (listener: FocusedNavigationListener) => {
      listeners.push(listener);

      return () => {
        const index = listeners.indexOf(listener);

        listeners.splice(index, 1);
      };
    },
    [listeners]
  );

  return {
    listeners,
    addListener,
  };
}
