import * as React from 'react';
import Screen from './Screen';
import { ParamListBase, RouteConfig, TypedNavigator } from './types';

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param NavigatorComponent The navigtor component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export default function createNavigator<
  ScreenOptions extends object,
  N extends React.ComponentType<any>
>(NavigatorComponent: N) {
  return <ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    ScreenOptions,
    typeof NavigatorComponent
  > => {
    return {
      Navigator: NavigatorComponent,
      Screen: Screen as React.ComponentType<
        RouteConfig<ParamList, keyof ParamList, ScreenOptions>
      >,
    };
  };
}
