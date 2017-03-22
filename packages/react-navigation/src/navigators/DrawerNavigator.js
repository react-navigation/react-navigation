/* @flow */

import React from 'react';
import {
  Dimensions,
  Platform,
} from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import DrawerScreen from '../views/Drawer/DrawerScreen';
import DrawerView from '../views/Drawer/DrawerView';

import type { DrawerViewConfig } from '../views/Drawer/DrawerView';
import type {
  NavigationContainerConfig,
  NavigationRouteConfigMap,
  NavigationTabRouterConfig,
} from '../TypeDefinition';

export type DrawerNavigatorConfig =
  & NavigationContainerConfig
  & NavigationTabRouterConfig
  & DrawerViewConfig;

const DefaultDrawerConfig = {
  /*
   * Default drawer width is screen width - header width
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  drawerWidth: Dimensions.get('window').width - (Platform.OS === 'android' ? 56 : 64),
  contentComponent: DrawerView.Items,
  drawerPosition: 'left',
};

const DrawerNavigator = (
  routeConfigs: NavigationRouteConfigMap,
  config: DrawerNavigatorConfig,
) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const {
    containerConfig,
    drawerWidth,
    contentComponent,
    contentOptions,
    drawerPosition,
    ...tabsConfig
  } = mergedConfig;
  const contentRouter = TabRouter(routeConfigs, tabsConfig);
  const drawerRouter = TabRouter({
    DrawerClose: {
      screen: createNavigator(contentRouter)((props: *) =>
        <DrawerScreen {...props} />
      ),
    },
    DrawerOpen: {
      screen: () => null,
    },
  }, {
    initialRouteName: 'DrawerClose',
  });
  return createNavigationContainer(createNavigator(drawerRouter)((props: *) =>
    <DrawerView
      {...props}
      drawerWidth={drawerWidth}
      contentComponent={contentComponent}
      contentOptions={contentOptions}
      drawerPosition={drawerPosition}
    />
  ), containerConfig);
};

export default DrawerNavigator;
