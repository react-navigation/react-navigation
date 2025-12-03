import {
  createNavigatorFactory,
  type DrawerActionHelpers,
  type DrawerNavigationState,
  DrawerRouter,
  type DrawerRouterOptions,
  type ParamListBase,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenConfig,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';

import type {
  DrawerNavigationEventMap,
  DrawerNavigationOptions,
  DrawerNavigationProp,
  DrawerNavigatorProps,
} from '../types';
import { DrawerView } from '../views/DrawerView';

function DrawerNavigator({
  initialRouteName,
  defaultStatus = 'closed',
  backBehavior,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: DrawerNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      DrawerNavigationState<ParamListBase>,
      DrawerRouterOptions,
      DrawerActionHelpers<ParamListBase>,
      DrawerNavigationOptions,
      DrawerNavigationEventMap
    >(DrawerRouter, {
      initialRouteName,
      defaultStatus,
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
      <DrawerView
        {...rest}
        defaultStatus={defaultStatus}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

type DrawerTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: DrawerNavigationState<ParamList>;
  ScreenOptions: DrawerNavigationOptions;
  EventMap: DrawerNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: DrawerNavigationProp<ParamList, RouteName>;
  };
  Navigator: typeof DrawerNavigator;
};

export function createDrawerNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<DrawerTypeBag<ParamList>, undefined>;
export function createDrawerNavigator<
  const Config extends StaticConfig<DrawerTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<DrawerTypeBag<StaticParamList<{ config: Config }>>, Config>;
export function createDrawerNavigator(config?: unknown) {
  return createNavigatorFactory(DrawerNavigator)(config);
}

export function createDrawerScreen<const Screen>(
  config: StaticScreenConfig<
    Screen,
    DrawerNavigationState<ParamListBase>,
    DrawerNavigationOptions,
    DrawerNavigationEventMap,
    DrawerNavigationProp<ParamListBase>
  >
) {
  return config;
}
