import * as React from 'react';
import Screen from './Screen';
import { ParamListBase, TypedNavigator } from './types';

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
  return <ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    ScreenOptions,
    typeof Navigator
  > => {
    return {
      Navigator,
      Screen,
    };
  };
}
