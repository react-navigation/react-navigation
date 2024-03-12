import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type DrawerActionHelpers,
  type DrawerNavigationState,
  DrawerRouter,
  type DrawerRouterOptions,
  type NavigationListBase,
  type ParamListBase,
  type StaticConfig,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
  DrawerNavigationOptions,
  DrawerNavigationProp,
} from '../types';
import { DrawerView } from '../views/DrawerView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  DrawerNavigationProp<ParamListBase>
> &
  DrawerRouterOptions &
  DrawerNavigationConfig;

function DrawerNavigator({
  id,
  initialRouteName,
  defaultStatus = 'closed',
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      DrawerNavigationState<ParamListBase>,
      DrawerRouterOptions,
      DrawerActionHelpers<ParamListBase>,
      DrawerNavigationOptions,
      DrawerNavigationEventMap
    >(DrawerRouter, {
      id,
      initialRouteName,
      defaultStatus,
      backBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
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

export function createDrawerNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined = undefined,
  NavigationList extends NavigationListBase<ParamList> = {
    [RouteName in keyof ParamList]: DrawerNavigationProp<
      ParamList,
      RouteName,
      NavigatorID
    >;
  },
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
    DrawerNavigationState<ParamList>,
    DrawerNavigationOptions,
    DrawerNavigationEventMap,
    NavigationList,
    typeof DrawerNavigator
  > = StaticConfig<
    ParamList,
    NavigatorID,
    DrawerNavigationState<ParamList>,
    DrawerNavigationOptions,
    DrawerNavigationEventMap,
    NavigationList,
    typeof DrawerNavigator
  >,
>(
  config?: Config
): TypedNavigator<
  ParamList,
  NavigatorID,
  DrawerNavigationState<ParamList>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  NavigationList,
  typeof DrawerNavigator
> &
  (typeof config extends undefined ? {} : { config: Config }) {
  return createNavigatorFactory(DrawerNavigator)(config);
}
