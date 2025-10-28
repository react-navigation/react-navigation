import {
  getLabel,
  Lazy,
  SafeAreaProviderCompat,
} from '@react-navigation/elements';
import {
  CommonActions,
  type ParamListBase,
  type Route,
  StackActions,
  type TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { type ColorValue, Platform, PlatformColor } from 'react-native';
import {
  BottomTabs,
  BottomTabsScreen,
  type BottomTabsScreenItemStateAppearance,
  type PlatformIcon,
} from 'react-native-screens';

import { NativeScreen } from './NativeScreen/NativeScreen';
import type {
  Icon,
  NativeBottomTabDescriptorMap,
  NativeBottomTabNavigationConfig,
  NativeBottomTabNavigationHelpers,
} from './types';

type Props = NativeBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: NativeBottomTabNavigationHelpers;
  descriptors: NativeBottomTabDescriptorMap;
};

export function NativeBottomTabView({ state, navigation, descriptors }: Props) {
  const { colors, fonts } = useTheme();

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

  const currentOptions = descriptors[state.routes[state.index].key]?.options;

  const {
    fontFamily = Platform.select({
      ios: fonts.medium.fontFamily,
      default: fonts.regular.fontFamily,
    }),
    fontWeight = Platform.select({
      ios: fonts.medium.fontWeight,
      default: fonts.regular.fontWeight,
    }),
    fontSize,
    fontStyle,
  } = currentOptions.tabBarLabelStyle || {};

  const activeTintColor =
    currentOptions.tabBarActiveTintColor ?? colors.primary;

  const inactiveTintColor =
    currentOptions.tabBarInactiveTintColor ??
    Platform.select<ColorValue | string>({
      ios: PlatformColor('label'),
      default: colors.text,
    });

  const activeIndicatorColor =
    (currentOptions?.tabBarActiveIndicatorColor ??
    typeof activeTintColor === 'string')
      ? Color(activeTintColor)?.alpha(0.1).string()
      : undefined;

  const onTransitionStart = ({
    closing,
    route,
  }: {
    closing: boolean;
    route: Route<string>;
  }) => {
    navigation.emit({
      type: 'transitionStart',
      data: { closing },
      target: route.key,
    });
  };

  const onTransitionEnd = ({
    closing,
    route,
  }: {
    closing: boolean;
    route: Route<string>;
  }) => {
    navigation.emit({
      type: 'transitionEnd',
      data: { closing },
      target: route.key,
    });
  };

  return (
    <SafeAreaProviderCompat>
      <BottomTabs
        tabBarItemLabelVisibilityMode={
          currentOptions?.tabBarLabelVisibilityMode
        }
        tabBarControllerMode={currentOptions?.tabBarControllerMode}
        tabBarMinimizeBehavior={currentOptions?.tabBarMinimizeBehavior}
        tabBarTintColor={activeTintColor}
        tabBarItemIconColor={inactiveTintColor}
        tabBarItemIconColorActive={activeTintColor}
        tabBarItemTitleFontColor={inactiveTintColor}
        tabBarItemTitleFontColorActive={activeTintColor}
        tabBarItemTitleFontFamily={fontFamily}
        tabBarItemTitleFontWeight={fontWeight}
        tabBarItemTitleFontSize={fontSize}
        tabBarItemTitleFontSizeActive={fontSize}
        tabBarItemTitleFontStyle={fontStyle}
        tabBarBackgroundColor={currentOptions.tabBarStyle?.backgroundColor}
        tabBarItemActiveIndicatorColor={activeIndicatorColor}
        tabBarItemActiveIndicatorEnabled={
          currentOptions?.tabBarActiveIndicatorEnabled
        }
        tabBarItemRippleColor={currentOptions?.tabBarRippleColor}
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
          const { options, render, navigation } = descriptors[route.key];
          const isFocused = state.index === index;
          const isPreloaded = state.preloadedRouteKeys.includes(route.key);

          const {
            title,
            lazy = true,
            tabBarLabel,
            tabBarBadgeStyle,
            tabBarIcon,
            tabBarBadge,
            tabBarSystemItem,
            tabBarBlurEffect,
            tabBarStyle,
          } = options;

          const {
            backgroundColor: tabBarBackgroundColor,
            shadowColor: tabBarShadowColor,
          } = tabBarStyle || {};

          const tabTitle =
            // On iOS, `systemItem` already provides a localized label
            // So we should only use `tabBarLabel` if explicitly provided
            Platform.OS === 'ios' && tabBarSystemItem != null
              ? tabBarLabel
              : getLabel({ label: tabBarLabel, title }, route.name);

          const tabItemAppearance: BottomTabsScreenItemStateAppearance = {
            tabBarItemTitleFontFamily: fontFamily,
            tabBarItemTitleFontSize: fontSize,
            tabBarItemTitleFontWeight: fontWeight,
            tabBarItemTitleFontStyle: fontStyle,
          };

          const badgeBackgroundColor =
            tabBarBadgeStyle?.backgroundColor ?? colors.notification;
          const badgeTextColor =
            typeof badgeBackgroundColor === 'string' &&
            Color(badgeBackgroundColor)?.isLight()
              ? 'black'
              : 'white';

          const icon =
            typeof tabBarIcon === 'function'
              ? getPlatformIcon(tabBarIcon({ focused: false }))
              : tabBarIcon != null
                ? getPlatformIcon(tabBarIcon)
                : undefined;

          const selectedIcon =
            typeof tabBarIcon === 'function'
              ? getPlatformIcon(tabBarIcon({ focused: true }))
              : undefined;

          return (
            <BottomTabsScreen
              onWillDisappear={() =>
                onTransitionStart({ closing: true, route })
              }
              onWillAppear={() => onTransitionStart({ closing: false, route })}
              onDidAppear={() => onTransitionEnd({ closing: false, route })}
              onDidDisappear={() => onTransitionEnd({ closing: true, route })}
              key={route.key}
              tabKey={route.key}
              icon={icon}
              selectedIcon={selectedIcon?.ios ?? selectedIcon?.shared}
              tabBarItemBadgeBackgroundColor={badgeBackgroundColor}
              tabBarItemBadgeTextColor={badgeTextColor}
              badgeValue={tabBarBadge?.toString()}
              systemItem={tabBarSystemItem}
              isFocused={isFocused}
              title={tabTitle}
              standardAppearance={{
                tabBarBackgroundColor,
                tabBarShadowColor,
                tabBarBlurEffect,
                stacked: {
                  normal: tabItemAppearance,
                },
                inline: {
                  normal: tabItemAppearance,
                },
                compactInline: {
                  normal: tabItemAppearance,
                },
              }}
            >
              <Lazy
                enabled={lazy ? isFocused || isPreloaded : true}
                render={() => (
                  <NativeScreen
                    route={route}
                    navigation={navigation}
                    options={options}
                  >
                    {render()}
                  </NativeScreen>
                )}
              />
            </BottomTabsScreen>
          );
        })}
      </BottomTabs>
    </SafeAreaProviderCompat>
  );
}

function getPlatformIcon(icon: Icon): PlatformIcon {
  return {
    ios:
      icon?.type === 'sfSymbol'
        ? icon
        : icon?.type === 'image' && icon.tinted !== false
          ? {
              type: 'templateSource',
              templateSource: icon.source,
            }
          : undefined,
    android: icon?.type === 'drawableResource' ? icon : undefined,
    shared:
      icon?.type === 'image'
        ? {
            type: 'imageSource',
            imageSource: icon.source,
          }
        : undefined,
  } as const;
}
