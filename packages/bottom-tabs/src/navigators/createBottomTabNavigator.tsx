import {
  createNavigatorFactory,
  createScreenFactory,
  type NavigatorTypeBagFactory,
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

export interface BottomTabTypeBag extends NavigatorTypeBagFactory {
  State: TabNavigationState<this['ParamList']>;
  ScreenOptions: BottomTabNavigationOptions;
  EventMap: BottomTabNavigationEventMap;
  ActionHelpers: TabActionHelpers<this['ParamList']>;
  Navigator: typeof BottomTabNavigator;
}

export const createBottomTabNavigator =
  createNavigatorFactory<BottomTabTypeBag>(BottomTabNavigator);

export const createBottomTabScreen = createScreenFactory<BottomTabTypeBag>();
