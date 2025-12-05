import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigationListBase,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/core';

const StackNavigator = (
  props: DefaultNavigatorOptions<
    ParamListBase,
    StackNavigationState<ParamListBase>,
    {},
    {},
    unknown
  >
) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    { ...props, meta: { name: 'test' } }
  );

  return (
    <NavigationContent>
      {descriptors[state.routes[state.index].key].render()}
    </NavigationContent>
  );
};

export function createStackNavigator<
  ParamList extends ParamListBase,
>(): TypedNavigator<{
  ParamList: ParamList;
  State: StackNavigationState<ParamList>;
  ScreenOptions: {};
  EventMap: {};
  NavigationList: NavigationListBase<ParamList>;
  Navigator: typeof StackNavigator;
}> {
  return createNavigatorFactory(StackNavigator)();
}
