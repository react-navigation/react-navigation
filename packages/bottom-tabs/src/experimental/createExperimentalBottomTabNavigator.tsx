import {
  createNavigatorFactory,
  type NavigatorTypeBagBase,
  type ParamListBase,
  StackActions,
  type StaticConfig,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import { ExperimentalBottomTabView } from './ExperimentalBottomTabView';
import type {
  ExperimentalBottomTabNavigationEventMap,
  ExperimentalBottomTabNavigationOptions,
  ExperimentalBottomTabNavigationProp,
  ExperimentalBottomTabNavigatorProps,
} from './types';

function TabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: ExperimentalBottomTabNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      ExperimentalBottomTabNavigationOptions,
      ExperimentalBottomTabNavigationEventMap
    >(TabRouter, {
      id,
      initialRouteName,
      backBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
    });

  const focusedRouteKey = state.routes[state.index].key;
  const previousRouteKeyRef = React.useRef(focusedRouteKey);

  React.useEffect(() => {
    const previousRouteKey = previousRouteKeyRef.current;

    if (
      previousRouteKey !== focusedRouteKey &&
      descriptors[previousRouteKey]?.options.popToTopOnBlur
    ) {
      const prevRoute = state.routes.find(
        (route) => route.key === previousRouteKey
      );

      if (prevRoute?.state?.type === 'stack' && prevRoute.state.key) {
        const popToTopAction = {
          ...StackActions.popToTop(),
          target: prevRoute.state.key,
        };
        navigation.dispatch(popToTopAction);
      }
    }

    previousRouteKeyRef.current = focusedRouteKey;
  }, [descriptors, focusedRouteKey, navigation, state.index, state.routes]);

  return (
    <NavigationContent>
      <ExperimentalBottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export function createExperimentalBottomTabNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = undefined,
  const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: TabNavigationState<ParamList>;
    ScreenOptions: ExperimentalBottomTabNavigationOptions;
    EventMap: ExperimentalBottomTabNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: ExperimentalBottomTabNavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    };
    Navigator: typeof TabNavigator;
  },
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(TabNavigator)(config);
}
