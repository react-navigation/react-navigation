import * as React from 'react';
import { ParamListBase } from '@react-navigation/routers';
import Screen from './Screen';
import { TypedNavigator } from './types';

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigtor component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export default function createNavigatorFactory<
  ScreenOptions extends object,
  NavigatorComponent extends React.ComponentType<any>
>(Navigator: NavigatorComponent) {
  return function<ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    ScreenOptions,
    typeof Navigator
  > {
    if (arguments[0] !== undefined) {
      throw new Error(
        "Creating a navigator doesn't take an argument. Maybe you are trying to use React Navigation 4 API with React Navigation 5? See https://reactnavigation.org/docs/en/upgrading-from-4.x.html for migration guide."
      );
    }

    return {
      Navigator,
      Screen,
    };
  };
}
