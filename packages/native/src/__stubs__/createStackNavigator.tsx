import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigationProp,
  type NavigationState,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';

const StackNavigator = (
  props: DefaultNavigatorOptions<
    ParamListBase,
    StackNavigationState<ParamListBase>,
    {},
    {}
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

export const createStackNavigator = <
  ParamList extends {},
  NavigatorID extends string | undefined = undefined,
>() =>
  createNavigatorFactory<
    ParamList,
    NavigationState<ParamList>,
    {},
    {},
    {
      [RouteName in keyof ParamList]: NavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    },
    typeof StackNavigator
  >(StackNavigator)();
