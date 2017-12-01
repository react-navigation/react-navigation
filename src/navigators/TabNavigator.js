/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import TabView from '../views/TabView/TabView';
import TabBarTop from '../views/TabView/TabBarTop';
import TabBarBottom from '../views/TabView/TabBarBottom';

import NavigatorTypes from './NavigatorTypes';

import type { TabViewConfig } from '../views/TabView/TabView';

import type {
  NavigationState,
  NavigationRouteConfigMap,
  NavigationTabRouterConfig,
  NavigationTabScreenOptions,
  NavigationNavigatorProps,
} from '../TypeDefinition';

export type TabNavigatorConfig = {
  containerOptions?: void,
} & NavigationTabRouterConfig &
  TabViewConfig;

// A tab navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props
type TabNavigatorProps = NavigationNavigatorProps<
  NavigationTabScreenOptions,
  NavigationState
> &
  React.ElementProps<typeof TabView>;

const TabNavigator = (
  routeConfigs: NavigationRouteConfigMap,
  config: TabNavigatorConfig = {}
) => {
  // Use the look native to the platform by default
  const mergedConfig = { ...TabNavigator.Presets.Default, ...config };
  const {
    tabBarComponent,
    tabBarPosition,
    tabBarOptions,
    swipeEnabled,
    animationEnabled,
    configureTransition,
    initialLayout,
    ...tabsConfig
  } = mergedConfig;

  const router = TabRouter(routeConfigs, tabsConfig);

  const navigator = createNavigator(
    router,
    routeConfigs,
    config,
    NavigatorTypes.TABS
  )((props: TabNavigatorProps) => (
    <TabView
      {...props}
      tabBarComponent={tabBarComponent}
      tabBarPosition={tabBarPosition}
      tabBarOptions={tabBarOptions}
      swipeEnabled={swipeEnabled}
      animationEnabled={animationEnabled}
      configureTransition={configureTransition}
      initialLayout={initialLayout}
    />
  ));

  return createNavigationContainer(navigator);
};

const Presets = {
  iOSBottomTabs: {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    initialLayout: undefined,
  },
  AndroidTopTabs: {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    initialLayout: undefined,
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
  Default:
    Platform.OS === 'ios' ? Presets.iOSBottomTabs : Presets.AndroidTopTabs,
};

export default TabNavigator;
