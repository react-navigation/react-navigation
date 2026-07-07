import type { ParamListBase } from '@react-navigation/routers';
import * as React from 'react';

import { Group } from './Group';
import { Screen } from './Screen';
import {
  createComponentForStaticConfig,
  type NoExcessStaticConfig,
  type StaticConfig,
  type StaticParamList,
} from './StaticNavigation';
import type {
  NavigatorTypeBagBase,
  NavigatorTypeBagFor,
  NestedNavigatorsForParamList,
  TypedNavigator,
} from './types';
import type { KeysOf, NoExcessObject } from './utilities';

type NavigatorNesting<ParamList extends ParamListBase, Nesting> = {
  [RouteName in keyof ParamList]?: unknown;
} & Record<Exclude<KeysOf<Nesting>, keyof ParamList>, never>;

type ValidNavigatorNesting<ParamList extends ParamListBase, Nesting> =
  Nesting extends NavigatorNesting<ParamList, Nesting> ? Nesting : never;

type AnyStaticConfig<TypeBag extends NavigatorTypeBagBase> = StaticConfig<
  NavigatorTypeBagFor<TypeBag, ParamListBase>
>;

export type TypedNavigatorFactory<in out TypeBag extends NavigatorTypeBagBase> =
  {
    <
      const ParamList extends ParamListBase,
      const Nesting extends NavigatorNesting<ParamList, Nesting> =
        ValidNavigatorNesting<
          ParamList,
          NestedNavigatorsForParamList<ParamList>
        >,
    >(): TypedNavigator<
      NavigatorTypeBagFor<TypeBag, ParamList>,
      undefined,
      Nesting
    >;
    <
      const Config extends AnyStaticConfig<TypeBag> &
        NoExcessObject<Config, AnyStaticConfig<TypeBag>>,
    >(
      config: Config & NoExcessStaticConfig<NoInfer<Config>, TypeBag>
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
