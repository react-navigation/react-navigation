import * as React from 'react';
import { Dimensions } from 'react-native';

import { getResponsiveValue, type ResponsiveValue } from './responsiveValue';

const subscribe = (callback: () => void) => {
  const subscription = Dimensions.addEventListener('change', callback);

  return () => {
    subscription.remove();
  };
};

/**
 * Resolve a responsive value based on the current dimensions of the window.
 */
export function useResponsiveValue<T extends string | number | boolean>(
  value: ResponsiveValue<T>
): T {
  return React.useSyncExternalStore(
    subscribe,
    () => getResponsiveValue(value, Dimensions.get('window')),
    () => getResponsiveValue(value, null)
  );
}
