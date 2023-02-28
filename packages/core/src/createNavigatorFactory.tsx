import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import type * as React from 'react';

import { Group } from './Group';
import { Screen } from './Screen';
import type { StaticConfig } from './StaticNavigation';
import type { EventMapBase, TypedNavigator } from './types';

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigator component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export function createNavigatorFactory<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigatorComponent extends React.ComponentType<any>
>(Navigator: NavigatorComponent) {
  function createNavigator<ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    State,
    ScreenOptions,
    EventMap,
    typeof Navigator
  >;

  // eslint-disable-next-line no-redeclare
  function createNavigator<
    ParamList extends ParamListBase,
    Config extends StaticConfig<
      ParamList,
      State,
      ScreenOptions,
      EventMap,
      typeof Navigator
    >
  >(
    config: Config
  ): TypedNavigator<
    ParamList,
    State,
    ScreenOptions,
    EventMap,
    typeof Navigator
  > & { config: Config };

  // eslint-disable-next-line no-redeclare
  function createNavigator(config?: any): any {
    if (config != null) {
      return {
        Navigator,
        Screen,
        Group,
        config,
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
