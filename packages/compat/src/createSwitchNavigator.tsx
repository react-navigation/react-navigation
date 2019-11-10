import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
} from '@react-navigation/core';
import {
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@react-navigation/routers';
import createCompatNavigatorFactory from './createCompatNavigatorFactory';

type Props = DefaultNavigatorOptions<{}> & TabRouterOptions;

function SwitchNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder<
    TabNavigationState,
    TabRouterOptions,
    {},
    {}
  >(TabRouter, props);

  return descriptors[state.routes[state.index].key].render();
}

export default createCompatNavigatorFactory(
  createNavigatorFactory<{}, typeof SwitchNavigator>(SwitchNavigator)
);
