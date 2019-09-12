import * as React from 'react';
import { Dimensions, Platform, ScrollView, I18nManager } from 'react-native';
import {
  createNavigator,
  ThemeColors,
  SafeAreaView,
  NavigationRouteConfigMap,
  CreateNavigatorConfig,
  NavigationRoute,
} from 'react-navigation';
import DrawerRouter from '../routers/DrawerRouter';
import DrawerView from '../views/DrawerView';
import DrawerItems from '../views/DrawerNavigatorItems';
import {
  NavigationDrawerOptions,
  NavigationDrawerProp,
  NavigationDrawerConfig,
  NavigationDrawerRouterConfig,
  DrawerContentComponentProps,
} from '../types';

const defaultContentComponent = (props: DrawerContentComponentProps) => (
  <ScrollView alwaysBounceVertical={false}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const DefaultDrawerConfig: NavigationDrawerConfig = {
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
  drawerPosition: I18nManager.isRTL ? 'right' : 'left',
  keyboardDismissMode: 'on-drag',
  drawerBackgroundColor: {
    light: ThemeColors.light.bodyContent,
    dark: ThemeColors.dark.bodyContent,
  },
  overlayColor: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },
  drawerType: 'front',
  hideStatusBar: false,
  statusBarAnimation: 'slide',
};

const DrawerNavigator = (
  routeConfigs: NavigationRouteConfigMap<
    NavigationDrawerOptions,
    NavigationDrawerProp<NavigationRoute, any>
  >,
  config: CreateNavigatorConfig<
    NavigationDrawerConfig,
    NavigationDrawerRouterConfig,
    NavigationDrawerOptions,
    NavigationDrawerProp<NavigationRoute, any>
  > = {}
) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const drawerRouter = DrawerRouter(routeConfigs, mergedConfig);

  // TODO: don't have time to fix it right now
  // @ts-ignore
  const navigator = createNavigator(DrawerView, drawerRouter, mergedConfig);
  return navigator;
};

export default DrawerNavigator;
