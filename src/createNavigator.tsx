import * as React from 'react';
import Screen from './Screen';
import { ParamListBase, RouteConfig, TypedNavigator } from './types';

export default function createNavigator<
  ScreenOptions extends object,
  N extends React.ComponentType<any>
>(RawNavigator: N) {
  return function Navigator<ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    ScreenOptions,
    typeof RawNavigator
  > {
    return {
      Navigator: RawNavigator,
      Screen: Screen as React.ComponentType<
        RouteConfig<ParamList, keyof ParamList, ScreenOptions>
      >,
    };
  };
}
