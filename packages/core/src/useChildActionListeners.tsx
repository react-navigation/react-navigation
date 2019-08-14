import * as React from 'react';
import { ChildActionListener } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add action listeners.
 */
export default function useChildActionListeners() {
  const { current: listeners } = React.useRef<ChildActionListener[]>([]);

  const addListener = React.useCallback(
    (listener: ChildActionListener) => {
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
