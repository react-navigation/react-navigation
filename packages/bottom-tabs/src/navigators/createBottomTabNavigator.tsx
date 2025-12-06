import {
  createNavigatorFactory,
  type ParamListBase,
  StackActions,
  type StaticConfig,
  type StaticParamList,
  type StaticScreenConfigInput,
  type StaticScreenConfigLinking,
  type StaticScreenConfigResult,
  type StaticScreenConfigScreen,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabNavigatorProps,
} from '../types';
import { BottomTabView } from '../views/BottomTabViewCommon';

function BottomTabNavigator({
  initialRouteName,
  backBehavior,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: BottomTabNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BottomTabNavigationOptions,
      BottomTabNavigationEventMap
    >(TabRouter, {
      initialRouteName,
      backBehavior,
      UNSTABLE_routeNamesChangeBehavior,
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
      <BottomTabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

type BottomTabTypeBag<ParamList extends {}> = {
  ParamList: ParamList;
  State: TabNavigationState<ParamList>;
  ScreenOptions: BottomTabNavigationOptions;
  EventMap: BottomTabNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: BottomTabNavigationProp<
      ParamList,
      RouteName
    >;
  };
  Navigator: typeof BottomTabNavigator;
};

export function createBottomTabNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<BottomTabTypeBag<ParamList>, undefined>;
export function createBottomTabNavigator<
  const Config extends StaticConfig<BottomTabTypeBag<ParamListBase>>,
>(
  config: Config
): TypedNavigator<
  BottomTabTypeBag<StaticParamList<{ config: Config }>>,
  Config
>;
export function createBottomTabNavigator(config?: unknown) {
  return createNavigatorFactory(BottomTabNavigator)(config);
}

export function createBottomTabScreen<
  const Linking extends StaticScreenConfigLinking,
  const Screen extends StaticScreenConfigScreen,
>(
  config: StaticScreenConfigInput<
    Linking,
    Screen,
    TabNavigationState<ParamListBase>,
    BottomTabNavigationOptions,
    BottomTabNavigationEventMap,
    BottomTabNavigationProp<ParamListBase>
  >
): StaticScreenConfigResult<
  Linking,
  Screen,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  BottomTabNavigationProp<ParamListBase>
> {
  // @ts-expect-error: there is some issue with the generic inference here
  return config;
}
