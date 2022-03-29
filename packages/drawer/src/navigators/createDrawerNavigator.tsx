import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  DrawerActionHelpers,
  DrawerNavigationState,
  DrawerRouter,
  DrawerRouterOptions,
  DrawerStatus,
  ParamListBase,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import warnOnce from 'warn-once';

import type {
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
  DrawerNavigationOptions,
} from '../types';
import DrawerView from '../views/DrawerView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap
> &
  DrawerRouterOptions &
  DrawerNavigationConfig;

function DrawerNavigator({
  id,
  initialRouteName,
  defaultStatus: customDefaultStatus,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  ...restWithDeprecated
}: Props) {
  const {
    // @ts-expect-error: openByDefault is deprecated
    openByDefault,
    // @ts-expect-error: lazy is deprecated
    lazy,
    // @ts-expect-error: drawerContentOptions is deprecated
    drawerContentOptions,
    ...rest
  } = restWithDeprecated;

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

    (
      Object.keys(defaultScreenOptions) as (keyof DrawerNavigationOptions)[]
    ).forEach((key) => {
      if (defaultScreenOptions[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete defaultScreenOptions[key];
      }
    });

    warnOnce(
      drawerContentOptions,
      `Drawer Navigator: 'drawerContentOptions' is deprecated. Migrate the options to 'screenOptions' instead.\n\nPlace the following in 'screenOptions' in your code to keep current behavior:\n\n${JSON.stringify(
        defaultScreenOptions,
        null,
        2
      )}\n\nSee https://reactnavigation.org/docs/drawer-navigator#options for more details.`
    );
  }

  if (typeof lazy === 'boolean') {
    defaultScreenOptions.lazy = lazy;

    warnOnce(
      true,
      `Drawer Navigator: 'lazy' in props is deprecated. Move it to 'screenOptions' instead.\n\nSee https://reactnavigation.org/docs/drawer-navigator/#lazy for more details.`
    );
  }

  if (typeof openByDefault === 'boolean') {
    warnOnce(
      true,
      `Drawer Navigator: 'openByDefault' is deprecated. Use 'defaultStatus' and set it to 'open' or 'closed' instead.\n\nSee https://reactnavigation.org/docs/drawer-navigator/#defaultstatus for more details.`
    );
  }

  const defaultStatus: DrawerStatus =
    customDefaultStatus !== undefined
      ? customDefaultStatus
      : openByDefault
      ? 'open'
      : 'closed';

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
      screenListeners,
      screenOptions,
      defaultScreenOptions,
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

export default createNavigatorFactory<
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
  typeof DrawerNavigator
>(DrawerNavigator);
