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
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '../types';
import MaterialTopTabView from '../views/MaterialTopTabView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap
> &
  TabRouterOptions &
  MaterialTopTabNavigationConfig;

function MaterialTopTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  ...restWithDeprecated
}: Props) {
  const {
    // @ts-expect-error: swipeEnabled is deprecated
    swipeEnabled,
    // @ts-expect-error: lazy is deprecated
    lazy,
    // @ts-expect-error: lazyPlaceholder is deprecated
    lazyPlaceholder,
    // @ts-expect-error: lazyPreloadDistance is deprecated
    lazyPreloadDistance,
    // @ts-expect-error: tabBarOptions is deprecated
    tabBarOptions,
    ...rest
  } = restWithDeprecated;

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
      tabBarBadge: tabBarOptions.renderBadge,
      tabBarIndicator: tabBarOptions.renderIndicator,
      tabBarIndicatorStyle: tabBarOptions.indicatorStyle,
      tabBarIndicatorContainerStyle: tabBarOptions.indicatorContainerStyle,
      tabBarContentContainerStyle: tabBarOptions.contentContainerStyle,
      tabBarStyle: tabBarOptions.style,
    });

    (
      Object.keys(
        defaultScreenOptions
      ) as (keyof MaterialTopTabNavigationOptions)[]
    ).forEach((key) => {
      if (defaultScreenOptions[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete defaultScreenOptions[key];
      }
    });

    warnOnce(
      tabBarOptions,
      `Material Top Tab Navigator: 'tabBarOptions' is deprecated. Migrate the options to 'screenOptions' instead.\n\nPlace the following in 'screenOptions' in your code to keep current behavior:\n\n${JSON.stringify(
        defaultScreenOptions,
        null,
        2
      )}\n\nSee https://reactnavigation.org/docs/material-top-tab-navigator#options for more details.`
    );
  }

  const deprecatedProps = {
    swipeEnabled,
    lazy,
    lazyPlaceholder,
    lazyPreloadDistance,
  } as const;

  Object.entries(deprecatedProps).forEach(([propName, propValue]) => {
    if (propValue !== undefined) {
      // @ts-expect-error: Object.entries doesn't return strict types
      defaultScreenOptions[propName] = propValue;

      warnOnce(
        true,
        `Material Top Tab Navigator: '${propName}' in props is deprecated. Move it to 'screenOptions' instead.\n\nSee https://reactnavigation.org/docs/material-top-tab-navigator#${propName.toLowerCase()} for more details.`
      );
    }
  });

  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      MaterialTopTabNavigationOptions,
      MaterialTopTabNavigationEventMap
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
