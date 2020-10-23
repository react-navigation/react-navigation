import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
  ParamListBase,
} from '@react-navigation/native';
import createCompatNavigatorFactory from './createCompatNavigatorFactory';

type Props = DefaultNavigatorOptions<{}> & TabRouterOptions;

function SwitchNavigator(props: Props) {
  const { state, descriptors } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    {},
    {}
  >(TabRouter, props);

  return descriptors[state.routes[state.index].key].render();
}

export default createCompatNavigatorFactory(
  createNavigatorFactory<
    TabNavigationState<ParamListBase>,
    {},
    {},
    typeof SwitchNavigator
  >(SwitchNavigator)
);
