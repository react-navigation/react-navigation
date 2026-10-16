import * as React from 'react';

import { NavigationBuilderContext } from './NavigationBuilderContext';
import { NavigationContainerRefContext } from './NavigationContainerRefContext';
import { NavigationContext } from './NavigationContext';
import { NavigationFocusedRouteStateContext } from './NavigationFocusedRouteStateContext';
import { NavigationHelpersContext } from './NavigationHelpersContext';
import { NavigationIndependentTreeContext } from './NavigationIndependentTreeContext';
// eslint-disable-next-line import-x/no-deprecated
import { NavigationMetaContext } from './NavigationMetaContext';
import {
  NamedRouteContextListContext,
  NavigationRouteContext,
} from './NavigationProvider';
import { PreventRemoveContext } from './PreventRemoveContext';
import { FocusedRouteKeyContext, IsFocusedContext } from './useIsFocused';
import { NavigationStateListenerContext } from './useNavigationState';

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
    <NavigationIndependentTreeContext.Provider value>
      <NavigationContainerRefContext.Provider value={undefined}>
        <NavigationBuilderContext.Provider value={undefined}>
          <NavigationMetaContext.Provider value={undefined}>
            <NavigationHelpersContext.Provider value={undefined}>
              <NavigationStateListenerContext.Provider value={undefined}>
                <FocusedRouteKeyContext.Provider value={undefined}>
                  <PreventRemoveContext.Provider value={undefined}>
                    <NamedRouteContextListContext.Provider value={undefined}>
                      <NavigationRouteContext.Provider value={undefined}>
                        <NavigationContext.Provider value={undefined}>
                          <IsFocusedContext.Provider value={undefined}>
                            <NavigationFocusedRouteStateContext.Provider
                              value={undefined}
                            >
                              {children}
                            </NavigationFocusedRouteStateContext.Provider>
                          </IsFocusedContext.Provider>
                        </NavigationContext.Provider>
                      </NavigationRouteContext.Provider>
                    </NamedRouteContextListContext.Provider>
                  </PreventRemoveContext.Provider>
                </FocusedRouteKeyContext.Provider>
              </NavigationStateListenerContext.Provider>
            </NavigationHelpersContext.Provider>
          </NavigationMetaContext.Provider>
        </NavigationBuilderContext.Provider>
      </NavigationContainerRefContext.Provider>
    </NavigationIndependentTreeContext.Provider>
  );
}
