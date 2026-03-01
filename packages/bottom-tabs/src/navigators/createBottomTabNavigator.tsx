import {
  createNavigatorFactory,
  type ParamListBase,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenConfig,
  type StaticScreenConfigLinking,
  type StaticScreenConfigScreen,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';

import type {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabNavigatorProps,
} from '../types';
import { BottomTabView } from '../views/BottomTabViewCommon';

function BottomTabNavigator({
  initialRouteName,
  backBehavior,
  routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: BottomTabNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BottomTabNavigationOptions,
      BottomTabNavigationEventMap
    >(TabRouter, {
      initialRouteName,
      backBehavior,
      routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
    });

  return (
    <NavigationContent>
      <BottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

type BottomTabTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: TabNavigationState<ParamList>;
  ScreenOptions: BottomTabNavigationOptions;
  EventMap: BottomTabNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: BottomTabNavigationProp<
      ParamList,
      RouteName
    >;
  };
  Navigator: typeof BottomTabNavigator;
};

export function createBottomTabNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<BottomTabTypeBag<ParamList>, undefined>;
export function createBottomTabNavigator<
  const Config extends StaticConfig<BottomTabTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<
  BottomTabTypeBag<StaticParamList<{ config: Config }>>,
  Config
>;
export function createBottomTabNavigator(config?: unknown) {
  return createNavigatorFactory(BottomTabNavigator)(config);
}

export function createBottomTabScreen<
  const Linking extends StaticScreenConfigLinking,
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfig<
    Linking,
    Screen,
    TabNavigationState<ParamListBase>,
    BottomTabNavigationOptions,
    BottomTabNavigationEventMap,
    BottomTabNavigationProp<ParamListBase>
  >
) {
  return config;
}
