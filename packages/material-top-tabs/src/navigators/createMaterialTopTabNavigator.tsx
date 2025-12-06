import {
  createNavigatorFactory,
  type ParamListBase,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenConfigInput,
  type StaticScreenConfigLinking,
  type StaticScreenConfigResult,
  type StaticScreenConfigScreen,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';

import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationProp,
  MaterialTopTabNavigatorProps,
} from '../types';
import { MaterialTopTabView } from '../views/MaterialTopTabView';

function MaterialTopTabNavigator({
  initialRouteName,
  backBehavior,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: MaterialTopTabNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      MaterialTopTabNavigationOptions,
      MaterialTopTabNavigationEventMap
    >(TabRouter, {
      initialRouteName,
      backBehavior,
      UNSTABLE_routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
    });

  return (
    <NavigationContent>
      <MaterialTopTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

type MaterialTopTabTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: TabNavigationState<ParamList>;
  ScreenOptions: MaterialTopTabNavigationOptions;
  EventMap: MaterialTopTabNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: MaterialTopTabNavigationProp<
      ParamList,
      RouteName
    >;
  };
  Navigator: typeof MaterialTopTabNavigator;
};

export function createMaterialTopTabNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<MaterialTopTabTypeBag<ParamList>, undefined>;
export function createMaterialTopTabNavigator<
  const Config extends StaticConfig<MaterialTopTabTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<
  MaterialTopTabTypeBag<StaticParamList<{ config: Config }>>,
  Config
>;
export function createMaterialTopTabNavigator(config?: unknown) {
  return createNavigatorFactory(MaterialTopTabNavigator)(config);
}

export function createMaterialTopTabScreen<
  const Linking extends StaticScreenConfigLinking,
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfigInput<
    Linking,
    Screen,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationProp<ParamListBase>
  >
): StaticScreenConfigResult<
  Linking,
  Screen,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationProp<ParamListBase>
> {
  // @ts-expect-error: there is some issue with the generic inference here
  return config;
}
