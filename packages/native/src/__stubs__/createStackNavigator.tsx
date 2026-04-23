import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigationListBase,
  type NavigatorTypeBagFactory,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
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
    props
  );

  return (
    <NavigationContent>
      {descriptors[state.routes[state.index].key].render()}
    </NavigationContent>
  );
};

interface StubStackTypeBag extends NavigatorTypeBagFactory {
  ParamList: this['input'];
  State: StackNavigationState<this['input']>;
  ScreenOptions: {};
  EventMap: {};
  NavigationList: NavigationListBase<this['input']>;
  Navigator: typeof StackNavigator;
}

export const createStackNavigator =
  createNavigatorFactory<StubStackTypeBag>(StackNavigator);
