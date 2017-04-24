/* @flow */

import React from 'react';
import { Platform } from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import TabView from '../views/TabView/TabView';
import NavigatorTypes from './NavigatorTypes';

import type { TabViewConfig } from '../views/TabView/TabView';

import type {
  NavigationRouteConfigMap,
  NavigationTabRouterConfig,
} from '../TypeDefinition';

export type TabNavigatorConfig =
  & { containerOptions?: void }
  & NavigationTabRouterConfig
  & TabViewConfig;

const TabNavigator = (
  routeConfigs: NavigationRouteConfigMap,
  config: TabNavigatorConfig = {},
) => {
  // Use the look native to the platform by default
  const mergedConfig = { ...TabNavigator.Presets.Default, ...config };
  const {
    tabBarComponent,
    tabBarPosition,
    tabBarOptions,
    swipeEnabled,
    animationEnabled,
    lazyLoad,
    ...tabsConfig
  } = mergedConfig;

  const router = TabRouter(routeConfigs, tabsConfig);

  const navigator = createNavigator(
    router,
    routeConfigs,
    config,
    NavigatorTypes.STACK,
  )((props: *) => (
    <TabView
      {...props}
      tabBarComponent={tabBarComponent}
      tabBarPosition={tabBarPosition}
      tabBarOptions={tabBarOptions}
      swipeEnabled={swipeEnabled}
      animationEnabled={animationEnabled}
      lazyLoad={lazyLoad}
    />
  ));

  return createNavigationContainer(navigator, tabsConfig.containerOptions);
};

const Presets = {
  iOSBottomTabs: {
    tabBarComponent: TabView.TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: false,
  },
  AndroidTopTabs: {
    tabBarComponent: TabView.TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: false,
  },
};

/**
 * Use these to get Android-style top tabs even on iOS or vice versa.
 *
 * Example:
 * ```
 * const HomeScreenTabNavigator = TabNavigator({
 *  Chat: {
 *    screen: ChatScreen,
 *  },
 *  ...
 * }, {
 *  ...TabNavigator.Presets.AndroidTopTabs,
 *  tabBarOptions: {
 *    ...
 *  },
 * });
 *```
 */
TabNavigator.Presets = {
  iOSBottomTabs: Presets.iOSBottomTabs,
  AndroidTopTabs: Presets.AndroidTopTabs,
  Default: Platform.OS === 'ios'
    ? Presets.iOSBottomTabs
    : Presets.AndroidTopTabs,
};

export default TabNavigator;
