import {
  createNavigatorFactory,
  createScreenFactory,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';

import type {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigatorProps,
} from '../types';
import { BottomTabView } from '../views/BottomTabView';

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
  const { state, navigation, descriptors, render } = useNavigationBuilder<
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

  return render(
    <BottomTabView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export interface BottomTabTypeBag extends NavigatorTypeBagBase {
  State: TabNavigationState<this['ParamList']>;
  ScreenOptions: BottomTabNavigationOptions;
  EventMap: BottomTabNavigationEventMap;
  ActionHelpers: TabActionHelpers<this['ParamList']>;
  Navigator: typeof BottomTabNavigator;
}

export const createBottomTabNavigator =
  createNavigatorFactory<BottomTabTypeBag>(BottomTabNavigator);

export const createBottomTabScreen = createScreenFactory<BottomTabTypeBag>();
