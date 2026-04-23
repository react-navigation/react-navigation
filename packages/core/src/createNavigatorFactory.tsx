import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { Group } from './Group';
import { Screen } from './Screen';
import {
  createComponentForStaticConfig,
  type StaticConfig,
  type StaticParamList,
} from './StaticNavigation';
import type {
  ApplyNavigatorTypeBagFactory,
  NavigatorTypeBagFactory,
  TypedNavigator,
} from './types';

export type TypedNavigatorCreator<F extends NavigatorTypeBagFactory> = {
  <const ParamList extends ParamListBase>(): TypedNavigator<
    ApplyNavigatorTypeBagFactory<F, ParamList>,
    undefined
  >;
  <
    const Config extends StaticConfig<
      ApplyNavigatorTypeBagFactory<F, ParamListBase>
    >,
  >(
    config: Config
  ): TypedNavigator<
    ApplyNavigatorTypeBagFactory<F, StaticParamList<{ config: Config }>>,
    Config
  >;
};

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigator component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export function createNavigatorFactory<
  F extends NavigatorTypeBagFactory = NavigatorTypeBagFactory,
>(Navigator: React.ComponentType<any>): TypedNavigatorCreator<F> {
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

  return createNavigator as never;
}
