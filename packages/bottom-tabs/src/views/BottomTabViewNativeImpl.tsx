import { getLabel } from '@react-navigation/elements';
import {
  Color,
  Lazy,
  SafeAreaProviderCompat,
} from '@react-navigation/elements/internal';
import {
  CommonActions,
  MaterialSymbol,
  NavigationMetaContext,
  type ParamListBase,
  type Route,
  StackActions,
  type TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  type ColorValue,
  Platform,
  PlatformColor,
} from 'react-native';
import {
  type PlatformIcon,
  Tabs,
  type TabsScreenItemStateAppearance,
} from 'react-native-screens';

import type {
  BottomTabDescriptorMap,
  BottomTabIcon,
  BottomTabNavigationConfig,
  BottomTabNavigationHelpers,
} from '../types';
import { BottomTabAnimationContext } from '../utils/BottomTabAnimationContext';
import { BottomTabBarHeightContext } from '../utils/BottomTabBarHeightContext';
import { useTabBarPosition } from '../utils/useTabBarPosition';
import { ScreenContent } from './ScreenContent';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

const ICON_SIZE = Platform.select({
  ios: 25,
  default: 24,
});

const meta = {
  type: 'native-tabs',
};

export function BottomTabViewNative({
  state,
  navigation,
  descriptors,
  tabBar,
}: Props) {
  const { dark, colors, fonts } = useTheme();

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
    color: fontColor,
  } = currentOptions.tabBarLabelStyle || {};

  const backgroundColor =
    currentOptions.tabBarStyle?.backgroundColor ?? colors.background;

  let activeIndicatorColor = currentOptions?.tabBarActiveIndicatorColor;
  let activeTintColor = currentOptions.tabBarActiveTintColor;
  let inactiveTintColor = currentOptions.tabBarInactiveTintColor;

  // Derive colors based on Material Design guidelines
  // https://m3.material.io/components/navigation-bar/specs
  if (Platform.OS === 'android') {
    switch (getAndroidColorName(backgroundColor)) {
      case 'system_surface_container_light':
      case 'system_surface_container_high_light':
      case 'system_surface_container_highest_light':
      case 'system_surface_container_low_light':
      case 'system_surface_container_lowest_light':
        inactiveTintColor =
          inactiveTintColor ??
          PlatformColor('@android:color/system_on_surface_variant_light');
        activeTintColor =
          activeTintColor ??
          PlatformColor('@android:color/system_on_secondary_container_light');
        activeIndicatorColor =
          activeIndicatorColor ??
          PlatformColor('@android:color/system_secondary_container_light');
        break;
      case 'system_surface_container_dark':
      case 'system_surface_container_high_dark':
      case 'system_surface_container_highest_dark':
      case 'system_surface_container_low_dark':
      case 'system_surface_container_lowest_dark':
        inactiveTintColor =
          inactiveTintColor ??
          PlatformColor('@android:color/system_on_surface_variant_dark');
        activeTintColor =
          activeTintColor ??
          PlatformColor('@android:color/system_on_secondary_container_dark');
        activeIndicatorColor =
          activeIndicatorColor ??
          PlatformColor('@android:color/system_secondary_container_dark');
        break;
    }
  }

  inactiveTintColor =
    inactiveTintColor ??
    Platform.select({ ios: PlatformColor('label'), default: colors.text });

  activeTintColor = activeTintColor ?? colors.primary;

  activeIndicatorColor =
    activeIndicatorColor ??
    Platform.select({
      android: Color(activeTintColor)?.alpha(0.075).string(),
      default: undefined,
    });

  const onTransitionStart = ({ route }: { route: Route<string> }) => {
    navigation.emit({
      type: 'transitionStart',
      target: route.key,
    });
  };

  const onTransitionEnd = ({ route }: { route: Route<string> }) => {
    navigation.emit({
      type: 'transitionEnd',
      target: route.key,
    });
  };

  const tabBarPosition = useTabBarPosition(currentOptions);

  const hasCustomTabBar = tabBar != null;
  const tabBarElement = tabBar
    ? tabBar({
        state,
        descriptors,
        navigation,
      })
    : null;

  const tabBarControllerMode =
    currentOptions.tabBarControllerMode === 'auto'
      ? 'automatic'
      : currentOptions.tabBarControllerMode;

  const tabBarMinimizeBehavior =
    currentOptions.tabBarMinimizeBehavior === 'auto'
      ? 'automatic'
      : currentOptions.tabBarMinimizeBehavior === 'none'
        ? 'never'
        : currentOptions.tabBarMinimizeBehavior;

  const bottomAccessory = currentOptions.bottomAccessory;

  return (
    <SafeAreaProviderCompat
      style={{
        flexDirection:
          tabBarPosition === 'left' || tabBarPosition === 'right'
            ? 'row'
            : 'column',
      }}
    >
      {tabBarPosition === 'top' || tabBarPosition === 'left'
        ? tabBarElement
        : null}
      <Tabs.Host
        tabBarHidden={hasCustomTabBar}
        bottomAccessory={
          bottomAccessory
            ? (environment) => bottomAccessory({ placement: environment })
            : undefined
        }
        tabBarItemLabelVisibilityMode={
          currentOptions?.tabBarLabelVisibilityMode
        }
        tabBarControllerMode={tabBarControllerMode}
        tabBarMinimizeBehavior={tabBarMinimizeBehavior}
        tabBarTintColor={activeTintColor}
        tabBarItemIconColor={inactiveTintColor}
        tabBarItemIconColorActive={activeTintColor}
        tabBarItemTitleFontColor={inactiveTintColor ?? fontColor}
        tabBarItemTitleFontColorActive={activeTintColor}
        tabBarItemTitleFontFamily={fontFamily}
        tabBarItemTitleFontWeight={fontWeight}
        tabBarItemTitleFontSize={fontSize}
        tabBarItemTitleFontSizeActive={fontSize}
        tabBarItemTitleFontStyle={fontStyle}
        tabBarBackgroundColor={backgroundColor}
        tabBarItemActiveIndicatorColor={activeIndicatorColor}
        tabBarItemActiveIndicatorEnabled={
          currentOptions?.tabBarActiveIndicatorEnabled
        }
        tabBarItemRippleColor={currentOptions?.tabBarRippleColor}
        experimentalControlNavigationStateInJS={false}
        onNativeFocusChange={(e) => {
          const route = state.routes.find(
            (route) => route.key === e.nativeEvent.tabKey
          );

          if (route) {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              throw new Error(
                "Preventing default for 'tabPress' is not supported with native tab bar."
              );
            }

            const isFocused =
              state.index ===
              state.routes.findIndex((r) => r.key === route.key);

            if (!isFocused) {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
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
            tabBarBlurEffect = dark ? 'systemMaterialDark' : 'systemMaterial',
            tabBarStyle,
            tabBarAccessibilityLabel,
            tabBarButtonTestID,
            sceneStyle,
            scrollEdgeEffects,
            overrideScrollViewContentInsetAdjustmentBehavior,
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

          const badgeBackgroundColor =
            tabBarBadgeStyle?.backgroundColor ?? colors.notification;
          const badgeTextColor =
            tabBarBadgeStyle?.color ?? Color.foreground(badgeBackgroundColor);

          const tabItemAppearance: TabsScreenItemStateAppearance = {
            tabBarItemTitleFontFamily: fontFamily,
            tabBarItemTitleFontSize: fontSize,
            tabBarItemTitleFontWeight: fontWeight,
            tabBarItemTitleFontStyle: fontStyle,
            tabBarItemTitleFontColor: inactiveTintColor ?? fontColor,
            tabBarItemIconColor: inactiveTintColor,
            tabBarItemBadgeBackgroundColor: badgeBackgroundColor,
          };

          const getIcon = (selected: boolean) => {
            if (typeof tabBarIcon === 'function') {
              const result = tabBarIcon({
                focused: selected,
                size: ICON_SIZE!,
                color: selected ? activeTintColor : inactiveTintColor,
              });

              if (React.isValidElement(result)) {
                throw new Error(
                  `Returning a React element from 'tabBarIcon' is not supported with native tab bar.`
                );
              } else if (
                result &&
                typeof result === 'object' &&
                'type' in result
              ) {
                return getPlatformIcon(result);
              } else {
                throw new Error(
                  `The 'tabBarIcon' function must return an icon object (got ${typeof result}).`
                );
              }
            } else if (tabBarIcon != null) {
              return getPlatformIcon(tabBarIcon);
            }

            return undefined;
          };

          const icon = getIcon(false);
          const selectedIcon = getIcon(true);

          return (
            <Tabs.Screen
              onWillAppear={() => onTransitionStart({ route })}
              onDidAppear={() => onTransitionEnd({ route })}
              key={route.key}
              tabKey={route.key}
              icon={icon}
              selectedIcon={
                (Platform.OS === 'ios'
                  ? (selectedIcon?.ios ?? selectedIcon?.shared)
                  : (selectedIcon?.android ??
                    selectedIcon?.shared)) as typeof selectedIcon extends undefined
                  ? undefined
                  : any
              }
              tabBarItemBadgeBackgroundColor={badgeBackgroundColor}
              tabBarItemBadgeTextColor={badgeTextColor}
              tabBarItemAccessibilityLabel={tabBarAccessibilityLabel}
              tabBarItemTestID={tabBarButtonTestID}
              badgeValue={tabBarBadge?.toString()}
              systemItem={tabBarSystemItem}
              isFocused={isFocused}
              title={tabTitle}
              scrollEdgeEffects={{
                top:
                  scrollEdgeEffects?.top === 'auto'
                    ? 'automatic'
                    : scrollEdgeEffects?.top,
                bottom:
                  scrollEdgeEffects?.bottom === 'auto'
                    ? 'automatic'
                    : scrollEdgeEffects?.bottom,
                left:
                  scrollEdgeEffects?.left === 'auto'
                    ? 'automatic'
                    : scrollEdgeEffects?.left,
                right:
                  scrollEdgeEffects?.right === 'auto'
                    ? 'automatic'
                    : scrollEdgeEffects?.right,
              }}
              // FIXME: if this is not provided, ScrollView on lazy tabs glitches on iOS 18
              // For now we provide an empty object before adding proper support
              scrollEdgeAppearance={{}}
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
              specialEffects={{
                repeatedTabSelection: {
                  popToRoot: true,
                  scrollToTop: true,
                },
              }}
              overrideScrollViewContentInsetAdjustmentBehavior={
                overrideScrollViewContentInsetAdjustmentBehavior
              }
              experimental_userInterfaceStyle={dark ? 'dark' : 'light'}
            >
              <Lazy enabled={lazy} visible={isFocused || isPreloaded}>
                <ScreenContent
                  isFocused={isFocused}
                  route={route}
                  navigation={navigation}
                  options={options}
                  style={sceneStyle}
                >
                  <AnimatedScreenContent isFocused={isFocused}>
                    <BottomTabBarHeightContext.Provider value={0}>
                      <NavigationMetaContext.Provider value={meta}>
                        {render()}
                      </NavigationMetaContext.Provider>
                    </BottomTabBarHeightContext.Provider>
                  </AnimatedScreenContent>
                </ScreenContent>
              </Lazy>
            </Tabs.Screen>
          );
        })}
      </Tabs.Host>
      {tabBarPosition === 'bottom' || tabBarPosition === 'right'
        ? tabBarElement
        : null}
    </SafeAreaProviderCompat>
  );
}

function AnimatedScreenContent({
  isFocused,
  children,
}: {
  isFocused: boolean;
  children: React.ReactNode;
}) {
  const [progress] = React.useState(
    () => new Animated.Value(isFocused ? 1 : 0)
  );

  React.useLayoutEffect(() => {
    /**
     * We don't have animation progress from native,
     * So we expose a static value (0 or 1) based on focus state.
     * Otherwise code using the `useTabAnimation` hook will crash
     */
    progress.setValue(isFocused ? 1 : 0);
  }, [isFocused, progress]);

  const interpolationProps = React.useMemo(() => {
    return {
      current: { progress },
    };
  }, [progress]);

  return (
    <BottomTabAnimationContext.Provider value={interpolationProps}>
      {children}
    </BottomTabAnimationContext.Provider>
  );
}

function getPlatformIcon(icon: BottomTabIcon): PlatformIcon {
  switch (icon.type) {
    case 'sfSymbol':
      return {
        ios: icon,
        android: undefined,
        shared: undefined,
      };
    case 'materialSymbol':
      return {
        ios: undefined,
        android: {
          type: 'imageSource',
          imageSource: MaterialSymbol.getImageSource({
            name: icon.name,
            variant: icon.variant,
            weight: icon.weight,
            size: ICON_SIZE,
          }),
        },
        shared: undefined,
      };
    case 'image':
      return {
        ios:
          icon.tinted === false
            ? {
                type: 'imageSource',
                imageSource: icon.source,
              }
            : {
                type: 'templateSource',
                templateSource: icon.source,
              },
        android: undefined,
        shared: {
          type: 'imageSource',
          imageSource: icon.source,
        },
      };
    default: {
      const _exhaustiveCheck: never = icon;

      return _exhaustiveCheck;
    }
  }
}

function getAndroidColorName(color: ColorValue) {
  const value = color as unknown;

  if (
    typeof value === 'object' &&
    value != null &&
    'resource_paths' in value &&
    Array.isArray(value.resource_paths) &&
    typeof value.resource_paths[0] === 'string'
  ) {
    return value.resource_paths[0].replace('@android:color/', '');
  }

  return null;
}
