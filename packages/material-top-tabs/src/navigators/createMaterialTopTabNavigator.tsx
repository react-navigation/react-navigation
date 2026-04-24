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
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
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

export interface MaterialTopTabTypeBag extends NavigatorTypeBagBase {
  State: TabNavigationState<this['ParamList']>;
  ScreenOptions: MaterialTopTabNavigationOptions;
  EventMap: MaterialTopTabNavigationEventMap;
  ActionHelpers: TabActionHelpers<this['ParamList']>;
  Navigator: typeof MaterialTopTabNavigator;
}

export const createMaterialTopTabNavigator =
  createNavigatorFactory<MaterialTopTabTypeBag>(MaterialTopTabNavigator);

export const createMaterialTopTabScreen =
  createScreenFactory<MaterialTopTabTypeBag>();
