/* @flow */

import React from 'react';
import { Dimensions, Platform } from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import DrawerScreen from '../views/Drawer/DrawerScreen';
import DrawerView from '../views/Drawer/DrawerView';
import DrawerItems from '../views/Drawer/DrawerNavigatorItems';

import NavigatorTypes from './NavigatorTypes';

import type { DrawerViewConfig } from '../views/Drawer/DrawerView';
import type {
  NavigationRouteConfigMap,
  NavigationTabRouterConfig,
} from '../TypeDefinition';

export type DrawerNavigatorConfig = {
  containerConfig?: void,
} & NavigationTabRouterConfig &
  DrawerViewConfig;

const DefaultDrawerConfig = {
  /*
   * Default drawer width is screen width - header width
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  drawerWidth:
    Dimensions.get('window').width - (Platform.OS === 'android' ? 56 : 64),
  contentComponent: DrawerItems,
  drawerPosition: 'left',
  useNativeAnimations: true,
};

const DrawerNavigator = (
  routeConfigs: NavigationRouteConfigMap,
  config: DrawerNavigatorConfig = {}
) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const {
    containerConfig,
    drawerWidth,
    drawerLockMode,
    contentComponent,
    contentOptions,
    drawerPosition,
    useNativeAnimations,
    ...tabsConfig
  } = mergedConfig;

  const contentRouter = TabRouter(routeConfigs, tabsConfig);

  const drawerRouter = TabRouter(
    {
      DrawerClose: {
        screen: createNavigator(
          contentRouter,
          routeConfigs,
          config,
          NavigatorTypes.DRAWER
        )((props: *) => <DrawerScreen {...props} />),
      },
      DrawerOpen: {
        screen: () => null,
      },
      DrawerToggle: {
        screen: () => null,
      },
    },
    {
      initialRouteName: 'DrawerClose',
    }
  );

  const navigator = createNavigator(
    drawerRouter,
    routeConfigs,
    config,
    NavigatorTypes.DRAWER
  )((props: *) => (
    <DrawerView
      {...props}
      drawerLockMode={drawerLockMode}
      useNativeAnimations={useNativeAnimations}
      drawerWidth={drawerWidth}
      contentComponent={contentComponent}
      contentOptions={contentOptions}
      drawerPosition={drawerPosition}
    />
  ));

  return createNavigationContainer(navigator);
};

export default DrawerNavigator;
