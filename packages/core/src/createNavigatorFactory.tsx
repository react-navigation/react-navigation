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
  NavigatorTypeBagBase,
  NavigatorTypeBagFor,
  TypedNavigator,
} from './types';
import type { KeysOf } from './utilities';

export type TypedNavigatorFactory<in out TypeBag extends NavigatorTypeBagBase> =
  {
    <const ParamList extends ParamListBase>(): TypedNavigator<
      NavigatorTypeBagFor<TypeBag, ParamList>,
      undefined
    >;
    <
      const Config extends StaticConfig<
        NavigatorTypeBagFor<TypeBag, ParamListBase>
      > &
        // TS only checks for excess properties for non-generic object literal types.
        // Since `Config` is generic, extra keys satisfy the constraint and slip through.
        // So we force any key in `Config` that isn't a known key to have the type `never`,
        // Thus causing an error for any extra key.
        Record<
          Exclude<
            keyof Config,
            KeysOf<StaticConfig<NavigatorTypeBagFor<TypeBag, ParamListBase>>>
          >,
          never
        >,
    >(
      config: Config
    ): TypedNavigator<
      NavigatorTypeBagFor<TypeBag, StaticParamList<{ config: Config }>>,
      Config
    >;
  };

/**
 * Higher order function to create a navigator factory
 * A navigator factory creates a navigator:
 * - `Navigator` and `Screen` pairs for dynamic configuration
 * - Static navigator object for static configuration
 *
 * @param Navigator The navigator component to wrap.
 * @returns Factory method to create a navigator
 */
export function createNavigatorFactory<TypeBag extends NavigatorTypeBagBase>(
  Navigator: React.ComponentType<any>
): TypedNavigatorFactory<TypeBag> {
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
