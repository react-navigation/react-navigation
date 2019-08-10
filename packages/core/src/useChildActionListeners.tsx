import * as React from 'react';
import { ChildActionListener } from './NavigationBuilderContext';

/**
 * Hook which lets child navigators add action listeners.
 */
export default function useChildActionListeners() {
  const { current: listeners } = React.useRef<ChildActionListener[]>([]);

  const addActionListener = React.useCallback(
    (listener: ChildActionListener) => {
      listeners.push(listener);
    },
    [listeners]
  );

  const removeActionListener = React.useCallback(
    (listener: ChildActionListener) => {
      const index = listeners.indexOf(listener);

      listeners.splice(index, 1);
    },
    [listeners]
  );

  return {
    listeners,
    addActionListener,
    removeActionListener,
  };
}
