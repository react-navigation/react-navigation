import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import warnOnce from 'warn-once';

import type {
  BottomTabNavigationConfig,
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
} from '../types';
import BottomTabView from '../views/BottomTabView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> &
  TabRouterOptions &
  BottomTabNavigationConfig;

function BottomTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  sceneContainerStyle,
  // @ts-expect-error: lazy is deprecated
  lazy,
  // @ts-expect-error: tabBarOptions is deprecated
  tabBarOptions,
  ...rest
}: Props) {
  let defaultScreenOptions: BottomTabNavigationOptions = {};

  if (tabBarOptions) {
    Object.assign(defaultScreenOptions, {
      tabBarHideOnKeyboard: tabBarOptions.keyboardHidesTabBar,
      tabBarActiveTintColor: tabBarOptions.activeTintColor,
      tabBarInactiveTintColor: tabBarOptions.inactiveTintColor,
      tabBarActiveBackgroundColor: tabBarOptions.activeBackgroundColor,
      tabBarInactiveBackgroundColor: tabBarOptions.inactiveBackgroundColor,
      tabBarAllowFontScaling: tabBarOptions.allowFontScaling,
      tabBarShowLabel: tabBarOptions.showLabel,
      tabBarLabelStyle: tabBarOptions.labelStyle,
      tabBarIconStyle: tabBarOptions.iconStyle,
      tabBarItemStyle: tabBarOptions.tabStyle,
      tabBarLabelPosition:
        tabBarOptions.labelPosition ??
        (tabBarOptions.adaptive === false ? 'below-icon' : undefined),
      tabBarStyle: [
        { display: tabBarOptions.tabBarVisible ? 'none' : 'flex' },
        defaultScreenOptions.tabBarStyle,
      ],
    });

    (
      Object.keys(defaultScreenOptions) as (keyof BottomTabNavigationOptions)[]
    ).forEach((key) => {
      if (defaultScreenOptions[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete defaultScreenOptions[key];
      }
    });

    warnOnce(
      tabBarOptions,
      `Bottom Tab Navigator: 'tabBarOptions' is deprecated. Migrate the options to 'screenOptions' instead.\n\nPlace the following in 'screenOptions' in your code to keep current behavior:\n\n${JSON.stringify(
        defaultScreenOptions,
        null,
        2
      )}\n\nSee https://reactnavigation.org/docs/bottom-tab-navigator#options for more details.`
    );
  }

  if (typeof lazy === 'boolean') {
    defaultScreenOptions.lazy = lazy;

    warnOnce(
      true,
      `Bottom Tab Navigator: 'lazy' in props is deprecated. Move it to 'screenOptions' instead.\n\nSee https://reactnavigation.org/docs/bottom-tab-navigator/#lazy for more details.`
    );
  }

  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BottomTabNavigationOptions,
      BottomTabNavigationEventMap
    >(TabRouter, {
      initialRouteName,
      backBehavior,
      children,
      screenListeners,
      screenOptions,
      defaultScreenOptions,
    });

  return (
    <NavigationContent>
      <BottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        sceneContainerStyle={sceneContainerStyle}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  typeof BottomTabNavigator
>(BottomTabNavigator);
