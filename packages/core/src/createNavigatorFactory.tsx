import * as React from 'react';

import { Group } from './Group';
import { Screen } from './Screen';
import { createComponentForStaticConfig } from './StaticNavigation';

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigator component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export function createNavigatorFactory(Navigator: React.ComponentType<any>) {
  const displayName = Navigator.displayName ?? Navigator.name ?? 'Navigator';

  function createNavigator(config?: any): any {
    if (config != null) {
      const NavigatorComponent = createComponentForStaticConfig(
        {
          Navigator,
          Screen,
          Group,
          config,
        },
        displayName
      );

      return {
        config,
        with(
          DecoratorComponent: React.ComponentType<{
            Navigator: React.ComponentType<any>;
          }>
        ) {
          const WithComponent = () => {
            return React.createElement(DecoratorComponent, {
              Navigator: NavigatorComponent,
            });
          };

          WithComponent.displayName = `${displayName}With`;

          return {
            config,
            getComponent: () => WithComponent,
          };
        },
        getComponent() {
          return NavigatorComponent;
        },
      };
    }

    return {
      Navigator,
      Screen,
      Group,
    };
  }

  return createNavigator;
}
