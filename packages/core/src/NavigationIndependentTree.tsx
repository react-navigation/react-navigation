import * as React from 'react';

import { NavigationBuilderContext } from './NavigationBuilderContext';
import { NavigationContainerRefContext } from './NavigationContainerRefContext';
import { NavigationFocusedRouteStateContext } from './NavigationFocusedRouteStateContext';
import { NavigationHelpersContext } from './NavigationHelpersContext';
import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
import { NavigationMetaContext } from './NavigationMetaContext';
import {
  IsScreenContext,
  NamedRouteContextListContext,
  NavigationContext,
  NavigationRouteContext,
} from './NavigationProvider';
import { NavigationRootContext } from './NavigationRootContext';
import { PreventRemoveContext } from './PreventRemoveContext';
import { StaticTreeContext } from './StaticTreeContext';
import { FocusedRouteKeyContext, IsFocusedContext } from './useIsFocused';
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
    <NavigationIndependentTreeContext.Provider value={true}>
      <NavigationContainerRefContext.Provider value={undefined}>
        <NavigationRootContext.Provider value={undefined}>
          <NavigationBuilderContext.Provider value={undefined}>
            <StaticTreeContext.Provider value={undefined}>
              <NavigationMetaContext.Provider value={undefined}>
                <NavigationHelpersContext.Provider value={undefined}>
                  <NavigationStateListenerContext.Provider value={undefined}>
                    <FocusedRouteKeyContext.Provider value={undefined}>
                      <PreventRemoveContext.Provider value={undefined}>
                        <NamedNavigationStateListenerListContext.Provider
                          value={undefined}
                        >
                          <NamedRouteContextListContext.Provider
                            value={undefined}
                          >
                            <NavigationRouteContext.Provider value={undefined}>
                              <NavigationContext.Provider value={undefined}>
                                <IsFocusedContext.Provider value={undefined}>
                                  <IsScreenContext.Provider value={false}>
                                    <NavigationFocusedRouteStateContext.Provider
                                      value={undefined}
                                    >
                                      {children}
                                    </NavigationFocusedRouteStateContext.Provider>
                                  </IsScreenContext.Provider>
                                </IsFocusedContext.Provider>
                              </NavigationContext.Provider>
                            </NavigationRouteContext.Provider>
                          </NamedRouteContextListContext.Provider>
                        </NamedNavigationStateListenerListContext.Provider>
                      </PreventRemoveContext.Provider>
                    </FocusedRouteKeyContext.Provider>
                  </NavigationStateListenerContext.Provider>
                </NavigationHelpersContext.Provider>
              </NavigationMetaContext.Provider>
            </StaticTreeContext.Provider>
          </NavigationBuilderContext.Provider>
        </NavigationRootContext.Provider>
      </NavigationContainerRefContext.Provider>
    </NavigationIndependentTreeContext.Provider>
  );
}
