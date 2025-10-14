import {
  getHeaderTitle,
  getLabel,
  Header,
  Screen as ScreenContent,
} from '@react-navigation/elements';
import {
  CommonActions,
  type ParamListBase,
  StackActions,
  type TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { PlatformColor } from 'react-native';
import { BottomTabs, BottomTabsScreen } from 'react-native-screens';

import type { BottomTabNavigationHelpers } from '../types';
import type {
  ExperimentalBottomTabDescriptorMap,
  ExperimentalBottomTabHeaderProps,
  ExperimentalBottomTabNavigationConfig,
  ExperimentalBottomTabNavigationProp,
} from './types';

type Props = ExperimentalBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: ExperimentalBottomTabDescriptorMap;
};

export function ExperimentalBottomTabView({
  state,
  navigation,
  descriptors,
}: Props) {
  const { colors } = useTheme();

  const focusedRouteKey = state.routes[state.index].key;
  const previousRouteKeyRef = React.useRef(focusedRouteKey);

  /**
   * List of loaded tabs, tabs will be loaded when navigated to.
   */
  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    // Set the current tab to be loaded if it was not loaded before
    setLoaded([...loaded, focusedRouteKey]);
  }

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

  const activeDescriptor = descriptors[state.routes[state.index].key];

  const {
    backgroundColor: tabBarBackgroundColor,
    shadowColor: tabBarShadowColor,
  } = activeDescriptor.options.tabBarStyle || {};

  const activeTintColor =
    activeDescriptor.options.tabBarActiveTintColor ?? colors.primary;
  const inactiveTintColor =
    activeDescriptor.options.tabBarInactiveTintColor ?? PlatformColor('label');

  return (
    <BottomTabs
      tabBarTintColor={activeTintColor}
      tabBarItemTitleFontColorActive={activeTintColor}
      tabBarItemTitleFontColor={inactiveTintColor}
      tabBarItemIconColorActive={activeTintColor}
      tabBarItemIconColor={inactiveTintColor}
      tabBarBackgroundColor={
        activeDescriptor.options.tabBarStyle?.backgroundColor
      }
      tabBarItemActiveIndicatorEnabled={false}
      experimentalControlNavigationStateInJS
      onNativeFocusChange={(e) => {
        const route = state.routes.find(
          (route) => route.key === e.nativeEvent.tabKey
        );

        if (route) {
          const isFocused =
            state.index === state.routes.findIndex((r) => r.key === route.key);

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
        const isPreloaded = state.preloadedRouteKeys.includes(route.key);

        const {
          lazy = true,
          header = ({ options }: ExperimentalBottomTabHeaderProps) => (
            <Header {...options} title={getHeaderTitle(options, route.name)} />
          ),
          headerShown,
          headerStatusBarHeight,
          headerTransparent,
          sceneStyle: customSceneStyle,
        } = options;

        const title = getLabel(
          { label: options.tabBarLabel, title: options.title },
          route.name
        );

        const { fontFamily, fontSize, fontWeight, fontStyle, color } =
          options.tabBarLabelStyle || {};

        // ios
        const labelStyle = {
          tabBarItemTitleFontFamily: fontFamily,
          tabBarItemTitleFontSize: fontSize,
          tabBarItemTitleFontWeight: fontWeight,
          tabBarItemTitleFontStyle: fontStyle,
          tabBarItemTitleFontColor: color,
        };

        return (
          <BottomTabsScreen
            key={route.key}
            tabKey={route.key}
            icon={options.tabBarIcon}
            tabBarItemBadgeBackgroundColor={
              options.tabBarBadgeStyle?.backgroundColor
            }
            tabBarItemBadgeTextColor={options.tabBarBadgeStyle?.color}
            badgeValue={options.tabBarBadge?.toString()}
            isFocused={isFocused}
            title={options.tabBarShowLabel !== false ? title : undefined}
            standardAppearance={{
              tabBarBackgroundColor,
              tabBarShadowColor,
              stacked: {
                normal: labelStyle,
              },
              inline: {
                normal: labelStyle,
              },
              compactInline: {
                normal: labelStyle,
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
              {
                // Don't render a lazy screen if we've never navigated to it or it wasn't preloaded
                lazy &&
                !loaded.includes(route.key) &&
                !isFocused &&
                !isPreloaded
                  ? null
                  : descriptors[route.key].render()
              }
            </ScreenContent>
          </BottomTabsScreen>
        );
      })}
    </BottomTabs>
  );
}
