import * as React from 'react';

import { NavigationContext } from './NavigationContext';
import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
import { NavigationRouteContext } from './NavigationRouteContext';

/**
 * Component to make the child navigation container independent of parent containers.
 */
export function NavigationIndependentTree({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We need to clear any existing contexts for nested independent container to work correctly
    <NavigationRouteContext.Provider value={undefined}>
      <NavigationContext.Provider value={undefined}>
        <NavigationIndependentTreeContext.Provider value>
          {children}
        </NavigationIndependentTreeContext.Provider>
      </NavigationContext.Provider>
    </NavigationRouteContext.Provider>
  );
}
