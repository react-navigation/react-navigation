import {
  createNavigatorFactory,
  createStaticScreenFactory,
  type DrawerActionHelpers,
  type DrawerNavigationState,
  DrawerRouter,
  type DrawerRouterOptions,
  type NavigatorTypeBagFactory,
  type ParamListBase,
  useNavigationBuilder,
} from '@react-navigation/native';

import type {
  DrawerNavigationEventMap,
  DrawerNavigationOptions,
  DrawerNavigatorProps,
} from '../types';
import { DrawerView } from '../views/DrawerView';

function DrawerNavigator({
  initialRouteName,
  defaultStatus = 'closed',
  backBehavior,
  routeNamesChangeBehavior,
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

export interface DrawerTypeBag extends NavigatorTypeBagFactory {
  State: DrawerNavigationState<this['ParamList']>;
  ScreenOptions: DrawerNavigationOptions;
  EventMap: DrawerNavigationEventMap;
  ActionHelpers: DrawerActionHelpers<this['ParamList']>;
  Navigator: typeof DrawerNavigator;
}

export const createDrawerNavigator =
  createNavigatorFactory<DrawerTypeBag>(DrawerNavigator);

export const createDrawerScreen = createStaticScreenFactory<DrawerTypeBag>();
