import {
  CommonActions,
  createNavigatorFactory,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StaticConfig,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import { BottomTabs, BottomTabsScreen } from 'react-native-screens';
import BottomTabsNativeComponent from 'react-native-screens/src/fabric/bottom-tabs/BottomTabsScreenNativeComponent';

import type {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabNavigatorProps,
} from './types';

function TabNavigator({ ...rest }: BottomTabNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BottomTabNavigationOptions,
      BottomTabNavigationEventMap
    >(TabRouter, rest);

  console.log(BottomTabsNativeComponent, 'BottomTabNativeComponent');
  return (
    <NavigationContent>
      <BottomTabs
        experimentalControlNavigationStateInJS
        onNativeFocusChange={(e) => {
          const route = state.routes.find(
            (route) => route.key === e.nativeEvent.tabKey
          );

          if (route) {
            const isFocused =
              state.index ===
              state.routes.findIndex((r) => r.key === route.key);

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              React.startTransition(() => {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              });
            }
          }
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          let title: string;

          if (typeof options.tabBarLabel === 'string') {
            title = options.tabBarLabel;
          } else if (typeof options.tabBarLabel === 'function') {
            // TODO: react element is not supported
            title = '';
          } else {
            title = options.title ?? route.name;
          }

          return (
            <BottomTabsScreen
              key={route.key}
              tabKey={route.key}
              icon={options.tabBarIcon}
              isFocused={isFocused}
              title={title}
            >
              {descriptors[route.key].render()}
            </BottomTabsScreen>
          );
        })}
      </BottomTabs>
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
    ScreenOptions: BottomTabNavigationOptions;
    EventMap: BottomTabNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: BottomTabNavigationProp<
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
