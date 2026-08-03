import * as React from 'react';

import { NavigationFocusedRouteStateContext } from './NavigationFocusedRouteStateContext';
import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
import {
  IsScreenContext,
  NamedRouteContextListContext,
  NavigationContext,
  NavigationRouteContext,
} from './NavigationProvider';
import { NavigationRootContext } from './NavigationRootContext';
import { IsFocusedContext } from './useIsFocused';
import {
  NamedNavigationStateListenerListContext,
  NavigationStateListenerContext,
} from './useNavigationState';

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
    <NavigationStateListenerContext.Provider value={undefined}>
      <NamedNavigationStateListenerListContext.Provider value={undefined}>
        <NamedRouteContextListContext.Provider value={undefined}>
          <NavigationRouteContext.Provider value={undefined}>
            <NavigationContext.Provider value={undefined}>
              <NavigationRootContext.Provider value={undefined}>
                <NavigationFocusedRouteStateContext.Provider value={undefined}>
                  <IsFocusedContext.Provider value={undefined}>
                    <NavigationIndependentTreeContext.Provider value={true}>
                      <IsScreenContext.Provider value={false}>
                        {children}
                      </IsScreenContext.Provider>
                    </NavigationIndependentTreeContext.Provider>
                  </IsFocusedContext.Provider>
                </NavigationFocusedRouteStateContext.Provider>
              </NavigationRootContext.Provider>
            </NavigationContext.Provider>
          </NavigationRouteContext.Provider>
        </NamedRouteContextListContext.Provider>
      </NamedNavigationStateListenerListContext.Provider>
    </NavigationStateListenerContext.Provider>
  );
}
