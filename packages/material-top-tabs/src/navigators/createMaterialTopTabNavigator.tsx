import * as React from 'react';
import warnOnce from 'warn-once';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
  TabActionHelpers,
  ParamListBase,
} from '@react-navigation/native';
import MaterialTopTabView from '../views/MaterialTopTabView';
import type {
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<MaterialTopTabNavigationOptions> &
  TabRouterOptions &
  MaterialTopTabNavigationConfig;

function MaterialTopTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  lazy,
  tabBarOptions,
  ...rest
}: Props) {
  let defaultScreenOptions: MaterialTopTabNavigationOptions = {};

  if (tabBarOptions) {
    Object.assign(defaultScreenOptions, {
      tabBarActiveTintColor: tabBarOptions.activeTintColor,
      tabBarInactiveTintColor: tabBarOptions.inactiveTintColor,
      tabBarPressColor: tabBarOptions.pressColor,
      tabBarPressOpacity: tabBarOptions.pressOpacity,
      tabBarShowLabel: tabBarOptions.showLabel,
      tabBarShowIcon: tabBarOptions.showIcon,
      tabBarAllowFontScaling: tabBarOptions.allowFontScaling,
      tabBarBounces: tabBarOptions.bounces,
      tabBarScrollEnabled: tabBarOptions.scrollEnabled,
      tabBarIconStyle: tabBarOptions.iconStyle,
      tabBarLabelStyle: tabBarOptions.labelStyle,
      tabBarItemStyle: tabBarOptions.tabStyle,
      tabBarIndicatorStyle: tabBarOptions.indicatorStyle,
      tabBarIndicatorContainerStyle: tabBarOptions.indicatorContainerStyle,
      tabBarContentContainerStyle: tabBarOptions.contentContainerStyle,
      tabBarStyle: tabBarOptions.style,
    });

    warnOnce(
      tabBarOptions,
      `Material Top Tab Navigator: 'tabBarOptions' is deprecated. Migrate the options to 'screenOptions' instead.\n\nPlace the following in 'screenOptions' in your code to keep current behavior:\n\n${JSON.stringify(
        defaultScreenOptions,
        null,
        2
      )}\n\nSee https://reactnavigation.org/docs/6.x/material-top-tab-navigator#options for more details.`
    );
  }

  if (typeof lazy === 'boolean') {
    defaultScreenOptions.lazy = lazy;

    warnOnce(
      true,
      `Material Top Tab Navigator: 'lazy' in props is deprecated. Move it to 'screenOptions' instead.`
    );
  }

  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
  >(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  return (
    <NavigationContent>
      <MaterialTopTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  typeof MaterialTopTabNavigator
>(MaterialTopTabNavigator);
