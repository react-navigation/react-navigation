import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigatorTypeBagBase,
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
  const { state, descriptors, render } = useNavigationBuilder(
    StackRouter,
    props
  );

  const route = state.routes[state.index];

  if (route == null) {
    throw new Error(`Couldn't find a route at index ${state.index}.`);
  }

  const descriptor = descriptors[route.key];

  if (descriptor == null) {
    throw new Error(`Couldn't find a descriptor for route '${route.key}'.`);
  }

  return render(descriptor.render());
};

interface StubStackTypeBag extends NavigatorTypeBagBase {
  State: StackNavigationState<this['ParamList']>;
  Navigator: typeof StackNavigator;
}

export const createStackNavigator =
  createNavigatorFactory<StubStackTypeBag>(StackNavigator);
