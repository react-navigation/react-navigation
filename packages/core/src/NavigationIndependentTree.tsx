import * as React from 'react';

import { NavigationContainerRefContext } from './NavigationContainerRefContext';
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
                <NavigationContainerRefContext.Provider value={undefined}>
                  <NavigationFocusedRouteStateContext.Provider
                    value={undefined}
                  >
                    <IsFocusedContext.Provider value={undefined}>
                      <IsScreenContext.Provider value={false}>
                        <NavigationIndependentTreeContext.Provider value={true}>
                          {children}
                        </NavigationIndependentTreeContext.Provider>
                      </IsScreenContext.Provider>
                    </IsFocusedContext.Provider>
                  </NavigationFocusedRouteStateContext.Provider>
                </NavigationContainerRefContext.Provider>
              </NavigationRootContext.Provider>
            </NavigationContext.Provider>
          </NavigationRouteContext.Provider>
        </NamedRouteContextListContext.Provider>
      </NamedNavigationStateListenerListContext.Provider>
    </NavigationStateListenerContext.Provider>
  );
}
