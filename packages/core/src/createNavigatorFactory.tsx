import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import type * as React from 'react';

import Group from './Group';
import Screen from './Screen';
import type { EventMapBase, TypedNavigator } from './types';

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigtor component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export default function createNavigatorFactory<
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase,
  NavigatorComponent extends React.ComponentType<any>
>(Navigator: NavigatorComponent) {
  return function <ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    State,
    ScreenOptions,
    EventMap,
    typeof Navigator
  > {
    if (arguments[0] !== undefined) {
      throw new Error(
        "Creating a navigator doesn't take an argument. Maybe you are trying to use React Navigation 4 API with React Navigation 5? See https://reactnavigation.org/docs/upgrading-from-4.x for migration guide."
      );
    }

    return {
      Navigator,
      Group,
      Screen,
    };
  };
}
