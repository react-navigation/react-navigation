import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';

const StackNavigator = (
  props: DefaultNavigatorOptions<
    ParamListBase,
    string | undefined,
    StackNavigationState<ParamListBase>,
    {},
    {},
    unknown
  >
) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  return (
    <NavigationContent>
      {descriptors[state.routes[state.index].key].render()}
    </NavigationContent>
  );
};

export function createStackNavigator<ParamList extends {}>(): TypedNavigator<
  ParamList,
  string | undefined,
  StackNavigationState<ParamList>,
  {},
  {},
  Record<keyof ParamList, unknown>,
  typeof StackNavigator
> {
  return createNavigatorFactory(StackNavigator)();
}
