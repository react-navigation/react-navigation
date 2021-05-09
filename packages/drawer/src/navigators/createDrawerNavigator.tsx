import * as React from 'react';
import {
  createNavigatorFactory,
  useNavigationBuilder,
  DefaultNavigatorOptions,
  DrawerNavigationState,
  DrawerRouterOptions,
  DrawerRouter,
  DrawerActionHelpers,
  ParamListBase,
} from '@react-navigation/native';
import warnOnce from 'warn-once';
import DrawerView from '../views/DrawerView';
import type {
  DrawerNavigationOptions,
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<DrawerNavigationOptions> &
  DrawerRouterOptions &
  DrawerNavigationConfig;

function DrawerNavigator({
  initialRouteName,
  openByDefault,
  backBehavior,
  children,
  screenOptions,
  // @ts-expect-error: lazy is deprecated
  lazy,
  // @ts-expect-error: drawerContentOptions is deprecated
  drawerContentOptions,
  ...rest
}: Props) {
  let defaultScreenOptions: DrawerNavigationOptions = {};

  if (drawerContentOptions) {
    Object.assign(defaultScreenOptions, {
      drawerPosition: drawerContentOptions.drawerPosition,
      drawerType: drawerContentOptions.drawerType,
      swipeEdgeWidth: drawerContentOptions.edgeWidth,
      drawerHideStatusBarOnOpen: drawerContentOptions.hideStatusBar,
      keyboardDismissMode: drawerContentOptions.keyboardDismissMode,
      swipeMinDistance: drawerContentOptions.minSwipeDistance,
      overlayColor: drawerContentOptions.overlayColor,
      drawerStatusBarAnimation: drawerContentOptions.statusBarAnimation,
      gestureHandlerProps: drawerContentOptions.gestureHandlerProps,
    });

    warnOnce(
      drawerContentOptions,
      `Drawer Navigator: 'drawerContentOptions' is deprecated. Migrate the options to 'screenOptions' instead.\n\nPlace the following in 'screenOptions' in your code to keep current behavior:\n\n${JSON.stringify(
        defaultScreenOptions,
        null,
        2
      )}\n\nSee https://reactnavigation.org/docs/6.x/drawer-navigator#options for more details.`
    );
  }

  if (typeof lazy === 'boolean') {
    defaultScreenOptions.lazy = lazy;

    warnOnce(
      true,
      `Drawer Navigator: 'lazy' in props is deprecated. Move it to 'screenOptions' instead.`
    );
  }

  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    DrawerNavigationState<ParamListBase>,
    DrawerRouterOptions,
    DrawerActionHelpers<ParamListBase>,
    DrawerNavigationOptions,
    DrawerNavigationEventMap
  >(DrawerRouter, {
    initialRouteName,
    openByDefault,
    backBehavior,
    children,
    screenOptions,
    defaultScreenOptions,
  });

  return (
    <NavigationContent>
      <DrawerView
        {...rest}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  typeof DrawerNavigator
>(DrawerNavigator);
