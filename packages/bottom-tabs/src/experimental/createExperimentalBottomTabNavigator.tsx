import {
  getHeaderTitle,
  Header,
  Screen as ScreenContent,
} from '@react-navigation/elements';
import {
  CommonActions,
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
import type { TextStyle } from 'react-native';
import { BottomTabs, BottomTabsScreen } from 'react-native-screens';

import { useAnimatedHashMap } from '../utils/useAnimatedHashMap';
import type {
  ExperimentalBottomTabHeaderProps,
  ExperimentalBottomTabNavigationEventMap,
  ExperimentalBottomTabNavigationOptions,
  ExperimentalBottomTabNavigationProp,
  ExperimentalBottomTabNavigatorProps,
} from './types';

function TabNavigator({ ...rest }: ExperimentalBottomTabNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      ExperimentalBottomTabNavigationOptions,
      ExperimentalBottomTabNavigationEventMap
    >(TabRouter, rest);

  const focusedRouteKey = state.routes[state.index].key;
  const previousRouteKeyRef = React.useRef(focusedRouteKey);
  const tabAnims = useAnimatedHashMap(state);

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
  }, [
    descriptors,
    focusedRouteKey,
    navigation,
    state.index,
    state.routes,
    tabAnims,
  ]);

  const activeDescriptor = descriptors[state.routes[state.index].key];

  const { tabBarLabelStyle } = activeDescriptor.options;

  const { fontFamily, fontSize, fontWeight, fontStyle, color } =
    (tabBarLabelStyle || {}) as TextStyle;

  return (
    <NavigationContent>
      <BottomTabs
        // ios
        tabBarTintColor={activeDescriptor.options.tabBarActiveTintColor}
        // android
        tabBarItemTitleFontColorActive={
          activeDescriptor.options.tabBarActiveTintColor
        }
        tabBarItemTitleFontColor={
          activeDescriptor.options.tabBarInactiveTintColor || color
        }
        tabBarItemIconColorActive={
          activeDescriptor.options.tabBarActiveTintColor || color
        }
        tabBarItemIconColor={activeDescriptor.options.tabBarInactiveTintColor}
        tabBarBackgroundColor={
          activeDescriptor.options.tabBarStyle?.backgroundColor
        }
        // tabBarItemActiveIndicatorColor={'transparent'}
        tabBarItemActiveIndicatorEnabled={false}
        // android
        tabBarItemTitleFontSize={fontSize}
        tabBarItemTitleFontFamily={fontFamily}
        tabBarItemTitleFontWeight={fontWeight as TextStyle['fontWeight']}
        tabBarItemTitleFontStyle={fontStyle as TextStyle['fontStyle']}
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

          const {
            header = ({ options }: ExperimentalBottomTabHeaderProps) => (
              <Header
                {...options}
                title={getHeaderTitle(options, route.name)}
              />
            ),
            headerShown,
            headerStatusBarHeight,
            headerTransparent,
            sceneStyle: customSceneStyle,
          } = options;

          let title: string;

          if (typeof options.tabBarLabel === 'string') {
            title = options.tabBarLabel;
          } else {
            title = options.title ?? route.name;
          }

          const { fontFamily, fontSize, fontWeight, fontStyle, color } =
            (options.tabBarLabelStyle || {}) as TextStyle;

          // ios
          const labelStyle = {
            tabBarItemTitleFontFamily: fontFamily,
            tabBarItemTitleFontSize: fontSize,
            tabBarItemTitleFontWeight: fontWeight,
            tabBarItemTitleFontStyle: fontStyle,
            tabBarItemTitleFontColor:
              activeDescriptor.options.tabBarInactiveTintColor ?? color,
          };

          const selectedLabelStyle = {
            ...labelStyle,
            tabBarItemTitleFontColor:
              activeDescriptor.options.tabBarActiveTintColor ?? color,
          };

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
              // icon={{
              //   imageSource: {
              //     uri: require('../../../../example/assets/icon.png'),
              //   },
              // }}
              iconResourceName={options.tabBarIcon}
              tabBarItemBadgeBackgroundColor={
                options.tabBarBadgeStyle?.backgroundColor
              }
              tabBarItemBadgeTextColor={options.tabBarBadgeStyle?.textColor}
              badgeValue={options.tabBarBadge?.toString()}
              isFocused={isFocused}
              title={options.tabBarShowLabel !== false ? title : undefined}
              standardAppearance={{
                // on ios it styles all bar, not just one entry
                tabBarBackgroundColor: options.tabBarStyle?.backgroundColor,
                tabBarShadowColor: options.tabBarStyle?.shadowColor,
                stacked: {
                  normal: labelStyle,
                  selected: selectedLabelStyle,
                },
                inline: {
                  normal: labelStyle,
                  selected: selectedLabelStyle,
                },
                compactInline: {
                  normal: labelStyle,
                  selected: selectedLabelStyle,
                },
              }}
            >
              <ScreenContent
                focused={isFocused}
                route={descriptors[route.key].route}
                navigation={descriptors[route.key].navigation}
                headerShown={headerShown}
                headerStatusBarHeight={headerStatusBarHeight}
                headerTransparent={headerTransparent}
                header={header({
                  route: descriptors[route.key].route,
                  navigation: descriptors[route.key]
                    .navigation as ExperimentalBottomTabNavigationProp<ParamListBase>,
                  options: descriptors[route.key].options,
                })}
                style={customSceneStyle}
              >
                {descriptors[route.key].render()}
              </ScreenContent>
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
