/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import { View } from 'react-native';
import {
  useNavigationBuilder,
  NavigationProp,
  ParamListBase,
  createNavigator,
} from '@navigation-ex/core';
import {
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@navigation-ex/routers';

type Props = TabRouterOptions & {
  children: React.ReactNode;
};

export type TabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

export type TabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  TabNavigationOptions
> & {
  /**
   * Jump to an existing tab.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends Extract<keyof ParamList, string>>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;
};

export function TabNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder<
    TabNavigationState,
    TabNavigationOptions,
    TabRouterOptions
  >(TabRouter, props);

  return (
    <View style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      {state.routes.map((route, i, self) => (
        <View
          key={route.key}
          style={{
            width: `${100 / self.length}%`,
            padding: 10,
            borderRadius: 3,
            backgroundColor: i === state.index ? 'tomato' : 'white',
          }}
        >
          {descriptors[route.key].render()}
        </View>
      ))}
    </View>
  );
}

export default createNavigator<TabNavigationOptions, typeof TabNavigator>(
  TabNavigator
);
