import * as React from 'react';

import { NavigationFocusedRouteStateContext } from './NavigationFocusedRouteStateContext';
import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
import {
  NamedRouteContextListContext,
  NavigationContext,
  NavigationRouteContext,
} from './NavigationProvider';
import { IsFocusedContext } from './useIsFocused';
import { NamedNavigationStateListenerListContext } from './useNavigationState';

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
    <NamedNavigationStateListenerListContext.Provider value={undefined}>
      <NamedRouteContextListContext.Provider value={undefined}>
        <NavigationRouteContext.Provider value={undefined}>
          <NavigationContext.Provider value={undefined}>
            <NavigationFocusedRouteStateContext.Provider value={undefined}>
              <IsFocusedContext.Provider value={undefined}>
                <NavigationIndependentTreeContext.Provider value={true}>
                  {children}
                </NavigationIndependentTreeContext.Provider>
              </IsFocusedContext.Provider>
            </NavigationFocusedRouteStateContext.Provider>
          </NavigationContext.Provider>
        </NavigationRouteContext.Provider>
      </NamedRouteContextListContext.Provider>
    </NamedNavigationStateListenerListContext.Provider>
  );
}
