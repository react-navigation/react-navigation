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
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationProp,
  MaterialTopTabNavigatorProps,
} from '../types';
import { MaterialTopTabView } from '../views/MaterialTopTabView';

function MaterialTopTabNavigator({
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
      <MaterialTopTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export interface MaterialTopTabTypeBag extends NavigatorTypeBagFactory {
  ParamList: this['input'];
  State: TabNavigationState<this['input']>;
  ScreenOptions: MaterialTopTabNavigationOptions;
  EventMap: MaterialTopTabNavigationEventMap;
  NavigationList: {
    [RouteName in keyof this['input']]: MaterialTopTabNavigationProp<
      this['input'],
      RouteName
    >;
  };
  Navigator: typeof MaterialTopTabNavigator;
}

export const createMaterialTopTabNavigator =
  createNavigatorFactory<MaterialTopTabTypeBag>(MaterialTopTabNavigator);

export const createMaterialTopTabScreen =
  createStaticScreenFactory<MaterialTopTabTypeBag>();
