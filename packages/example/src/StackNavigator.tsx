/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import { Text, View } from 'react-native';
import {
  useNavigationBuilder,
  NavigationProp,
  ParamListBase,
  createNavigator,
} from '@navigation-ex/core';
import {
  StackRouter,
  StackRouterOptions,
  StackNavigationState,
} from '@navigation-ex/routers';

type Props = StackRouterOptions & {
  children: React.ReactNode;
};

export type StackNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

export type StackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState,
  StackNavigationOptions
> & {
  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;

  /**
   * Pop a screen from the stack.
   */
  pop(count?: number): void;

  /**
   * Pop to the first route in the stack, dismissing all other screens.
   */
  popToTop(): void;
};

export function StackNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder<
    StackNavigationState,
    StackNavigationOptions,
    StackRouterOptions
  >(StackRouter, props);

  return (
    <View>
      {state.routes.map((route, i) => (
        <View
          key={route.key}
          style={{
            position: 'absolute',
            margin: 20,
            left: i * 20,
            top: i * 20,
            padding: 10,
            height: 480,
            width: 320,
            backgroundColor: 'white',
            borderRadius: 3,
          }}
        >
          {descriptors[route.key].render()}
        </View>
      ))}
      <View
        style={{
          position: 'absolute',
          left: 40,
          width: 120,
          padding: 10,
          backgroundColor: 'tomato',
          borderRadius: 3,
        }}
      >
        <Text>{descriptors[state.routes[state.index].key].options.title}</Text>
      </View>
    </View>
  );
}

export default createNavigator<StackNavigationOptions, typeof StackNavigator>(
  StackNavigator
);
