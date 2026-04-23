import {
  createNavigatorFactory,
  createStaticScreenFactory,
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

export interface BottomTabTypeBag extends NavigatorTypeBagFactory {
  ParamList: this['input'];
  State: TabNavigationState<this['input']>;
  ScreenOptions: BottomTabNavigationOptions;
  EventMap: BottomTabNavigationEventMap;
  NavigationList: {
    [RouteName in keyof this['input']]: BottomTabNavigationProp<
      this['input'],
      RouteName
    >;
  };
  Navigator: typeof BottomTabNavigator;
}

export const createBottomTabNavigator =
  createNavigatorFactory<BottomTabTypeBag>(BottomTabNavigator);

export const createBottomTabScreen =
  createStaticScreenFactory<BottomTabTypeBag>();
