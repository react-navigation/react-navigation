import * as React from 'react';
import { ParamListBase, ScreenProps, TypedNavigator } from './types';
import Screen from './Screen';

export default function createNavigator<N extends React.ComponentType<any>>(
  RawNavigator: N
) {
  return function Navigator<ParamList extends ParamListBase>(): TypedNavigator<
    ParamList,
    typeof RawNavigator
  > {
    return {
      Navigator: RawNavigator,
      Screen: Screen as React.ComponentType<
        ScreenProps<ParamList, keyof ParamList>
      >,
    };
  };
}
