/* @flow */

import * as React from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import DrawerScreen from '../views/Drawer/DrawerScreen';
import DrawerView from '../views/Drawer/DrawerView';
import DrawerItems from '../views/Drawer/DrawerNavigatorItems';
import SafeAreaView from '../views/SafeAreaView';

import NavigatorTypes from './NavigatorTypes';

import type { DrawerViewConfig } from '../views/Drawer/DrawerView';
import type {
  NavigationState,
  NavigationRouteConfigMap,
  NavigationTabRouterConfig,
  NavigationDrawerScreenOptions,
  NavigationNavigatorProps,
} from '../TypeDefinition';

export type DrawerNavigatorConfig = {
  containerConfig?: void,
} & NavigationTabRouterConfig &
  DrawerViewConfig;

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props
type DrawerNavigatorProps = NavigationNavigatorProps<
  NavigationDrawerScreenOptions,
  NavigationState
> &
  React.ElementProps<typeof DrawerView>;

const defaultContentComponent = (
  props: React.ElementProps<typeof DrawerItems>
) => (
  <ScrollView alwaysBounceVertical={false}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const DefaultDrawerConfig = {
  drawerWidth: () => {
    /*
     * Default drawer width is screen width - header height
     * with a max width of 280 on mobile and 320 on tablet
     * https://material.io/guidelines/patterns/navigation-drawer.html
     */
    const { height, width } = Dimensions.get('window');
    const smallerAxisSize = Math.min(height, width);
    const isLandscape = width > height;
    const isTablet = smallerAxisSize >= 600;
    const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
    const maxWidth = isTablet ? 320 : 280;

    return Math.min(smallerAxisSize - appBarHeight, maxWidth);
  },
  contentComponent: defaultContentComponent,
  drawerPosition: 'left',
  drawerBackgroundColor: 'white',
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
    drawerBackgroundColor,
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
        )((props: React.ElementProps<typeof DrawerScreen>) => (
          <DrawerScreen {...props} />
        )),
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
  )((props: DrawerNavigatorProps) => (
    <DrawerView
      {...props}
      drawerBackgroundColor={drawerBackgroundColor}
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
