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

  return (
    <NavigationContent>
      <BottomTabs
        // tabBarItemTitleFontSize={24}
        // tabBarItemTitleFontSizeActive={32}
        // tabBarItemActiveIndicatorEnabled={false}
        // tabBarTintColor={'blue'}
        tabBarTintColor={
          descriptors[state.routes[state.index].key].options
            .tabBarActiveTintColor
        }
        tabBarItemTitleFontColorActive={
          descriptors[state.routes[state.index].key].options
            .tabBarActiveTintColor
        }
        tabBarItemTitleFontColor={
          descriptors[state.routes[state.index].key].options
            .tabBarInactiveTintColor
        }
        tabBarItemIconColorActive={
          descriptors[state.routes[state.index].key].options
            .tabBarActiveTintColor
        }
        tabBarItemIconColor={
          descriptors[state.routes[state.index].key].options
            .tabBarInactiveTintColor
        }
        tabBarBackgroundColor={
          descriptors[state.routes[state.index].key].options.tabBarStyle
            ?.backgroundColor
        }
        // tabBarItemActiveIndicatorColor={'transparent'}
        tabBarItemActiveIndicatorEnabled={false}
        // tabBarItemRippleColor={'green'}
        // tabBarItemLabelVisibilityMode={'selected'}
        tabBarMinimizeBehavior={'onScrollDown'}
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
          } else {
            title = options.title ?? route.name;
          }

          return (
            <BottomTabsScreen
              key={route.key}
              tabKey={route.key}
              icon={
                options.tabBarIcon
                  ? {
                      sfSymbolName: options.tabBarIcon,
                    }
                  : undefined
              }
              iconResourceName={options.tabBarIcon}
              // iconResource={require('../../../../example/assets/small.png')}
              // tabBarItemBadgeTextColor={'blue'}
              // rippleColor={'red'}
              tabBarItemBadgeBackgroundColor={
                options.tabBarBadgeStyle?.backgroundColor
              }
              tabBarItemBadgeTextColor={options.tabBarBadgeStyle?.textColor}
              // systemItem={'contacts'}
              badgeValue={options.tabBarBadge?.toString()}
              // selectedIcon={options.tabBarActiveIcon}
              // specialEffects={{
              //   repeatedTabSelection: {
              //     popToRoot: false,
              //     scrollToTop: false, // seems not working
              //   },
              // }}
              // orientation={'landscape'}
              // standardAppearance={{
              //   stacked: {
              //     normal: {
              //       tabBarItemTitleFontFamily: 'Arial',
              //       // tabBarItemTitleFontColor: 'red',
              //     },
              //   },
              // }}
              // scrollEdgeAppearance={{
              //   stacked: {
              //     normal: {
              //       // tabBarItemTitleFontFamily: 'Arial',
              //       tabBarItemTitleFontColor: 'red',
              //     },
              //   },
              // }}
              isFocused={isFocused}
              title={options.tabBarShowLabel !== false ? title : undefined}
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
