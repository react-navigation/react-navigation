import * as React from 'react';

import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
import {
  NamedRouteContextListContext,
  NavigationContext,
  NavigationRouteContext,
  NavigationRouteNameContext,
} from './NavigationProvider';

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
    <NamedRouteContextListContext.Provider value={undefined}>
      <NavigationRouteContext.Provider value={undefined}>
        <NavigationContext.Provider value={undefined}>
          <NavigationRouteNameContext.Provider value={undefined}>
            <NavigationIndependentTreeContext.Provider value={true}>
              {children}
            </NavigationIndependentTreeContext.Provider>
          </NavigationRouteNameContext.Provider>
        </NavigationContext.Provider>
      </NavigationRouteContext.Provider>
    </NamedRouteContextListContext.Provider>
  );
}
