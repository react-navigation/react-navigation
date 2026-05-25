import { getLabel, type Icon } from '@react-navigation/elements';
import {
  ActivityView,
  Color,
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
  type NativeSyntheticEvent,
  Platform,
  PlatformColor,
  StyleSheet,
} from 'react-native';
import {
  type PlatformIconAndroid,
  type PlatformIconIOS,
  type PlatformIconShared,
  Tabs,
  type TabsBottomAccessoryEnvironment,
  type TabSelectedEvent,
  type TabSelectionRejectedEvent,
  type TabsScreenItemStateAppearanceAndroid,
  type TabsScreenItemStateAppearanceIOS,
} from 'react-native-screens';

import type {
  BottomTabDescriptorMap,
  BottomTabNavigationConfig,
  BottomTabNavigationHelpers,
} from '../types';
import { BottomTabAnimationContext } from '../utils/BottomTabAnimationContext';
import { BottomTabBarHeightContext } from '../utils/BottomTabBarHeightContext';
import { useTabBarPosition } from '../utils/useTabBarPosition';
import { Deferred } from './Deferred';
import { ScreenContent } from './ScreenContent';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

type TabSelectionPreventedEvent = {
  selectedScreenKey: string;
  provenance: number;
  preventedScreenKey: string;
};

type PlatformIcon = {
  ios?: PlatformIconIOS;
  android?: PlatformIconAndroid;
  shared?: PlatformIconShared;
};

type ConfirmedState = {
  routeKey: string;
  provenance: number;
};

type NativeState = {
  lastTransition: { from: string; to: string } | null;
  confirmed: ConfirmedState;
};

type NativeAction =
  | { type: 'CLEAR_TRANSITION'; to: string }
  | {
      type: 'TRACK_TRANSITION';
      confirmed: ConfirmedState;
      lastTransition: NonNullable<NativeState['lastTransition']>;
    }
  | { type: 'CONFIRM_STATE'; confirmed: ConfirmedState };

const ICON_SIZE = Platform.select({
  ios: 25,
  default: 24,
});

const meta = {
  type: 'native-tabs',
};

function reducer(state: NativeState, action: NativeAction): NativeState {
  switch (action.type) {
    case 'TRACK_TRANSITION':
      return {
        ...state,
        lastTransition: action.lastTransition,
        confirmed: action.confirmed,
      };
    case 'CLEAR_TRANSITION':
      return state.lastTransition?.to === action.to
        ? {
            ...state,
            lastTransition: null,
          }
        : state;
    case 'CONFIRM_STATE':
      return state.confirmed.routeKey === action.confirmed.routeKey &&
        state.confirmed.provenance === action.confirmed.provenance
        ? state
        : {
            ...state,
            confirmed: action.confirmed,
          };
  }
}

export function BottomTabViewNative({
  state,
  navigation,
  descriptors,
  tabBar,
}: Props) {
  const { dark, colors, fonts } = useTheme();

  const focusedRouteKey = state.routes[state.index].key;

  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  const [nativeState, dispatch] = React.useReducer(reducer, {
    lastTransition: null,
    confirmed: {
      routeKey: focusedRouteKey,
      provenance: 0,
    },
  });

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

    // We dispatch `popToTop` for unfocused tabs when `popToTopOnBlur` is true
    // So we delay clearing `lastTransition` to keep the screen active for longer
    // This gives time for the action to be handled before the screen is paused,
    const timer = setTimeout(() => {
      dispatch({
        type: 'CLEAR_TRANSITION',
        to: focusedRouteKey,
      });
    }, 32);

    return () => clearTimeout(timer);
  }, [descriptors, focusedRouteKey, navigation, state.index, state.routes]);

  const navigate = (
    route: (typeof state.routes)[number],
    confirmed: ConfirmedState
  ) => {
    dispatch({
      type: 'TRACK_TRANSITION',
      confirmed,
      lastTransition: {
        from: previousRouteKeyRef.current,
        to: route.key,
      },
    });

    navigation.dispatch({
      ...CommonActions.navigate(route.name, route.params),
      target: state.key,
    });
  };

  // Native tabs are the source of truth for the selected tab.
  // JS sends a requested tab with the native provenance it was based on.
  // Native replies with the selected tab and its new provenance.
  const onTabSelected = (event: NativeSyntheticEvent<TabSelectedEvent>) => {
    const { selectedScreenKey, provenance, actionOrigin } = event.nativeEvent;

    const confirmed = {
      routeKey: selectedScreenKey,
      provenance,
    };

    const route = state.routes.find((route) => route.key === selectedScreenKey);

    if (!route) {
      console.error(
        `Received 'tabSelected' for route that doesn't exist: ${selectedScreenKey}`
      );

      return;
    }

    if (actionOrigin === 'user') {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        throw new Error(
          "Preventing default for 'tabPress' is not supported with native tab bar. Use the 'tabBarSelectionEnabled: false' option instead."
        );
      }
    }

    if (actionOrigin === 'programmatic-js' || focusedRouteKey === route.key) {
      dispatch({
        type: 'CONFIRM_STATE',
        confirmed,
      });

      return;
    }

    navigate(route, confirmed);
  };

  // If native rejects a JS request, keep native as the source of truth
  // and move JS back to the tab that native says is selected.
  const onTabSelectionRejected = (
    event: NativeSyntheticEvent<TabSelectionRejectedEvent>
  ) => {
    const { selectedScreenKey, provenance } = event.nativeEvent;

    const confirmed = {
      routeKey: selectedScreenKey,
      provenance,
    };

    const route = state.routes.find((route) => route.key === selectedScreenKey);

    if (!route) {
      console.error(
        `Received 'tabSelectionRejected' for route that doesn't exist: ${selectedScreenKey}`
      );

      return;
    }

    if (focusedRouteKey === route.key) {
      dispatch({
        type: 'CONFIRM_STATE',
        confirmed,
      });

      return;
    }

    navigate(route, confirmed);
  };

  const onTabSelectionPrevented = (
    event: NativeSyntheticEvent<TabSelectionPreventedEvent>
  ) => {
    const { selectedScreenKey, provenance, preventedScreenKey } =
      event.nativeEvent;

    const confirmed = {
      routeKey: selectedScreenKey,
      provenance,
    };

    dispatch({
      type: 'CONFIRM_STATE',
      confirmed,
    });

    navigation.emit({
      type: 'tabPress',
      target: preventedScreenKey,
      canPreventDefault: true,
    });
  };

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

  const shouldHideTabBar = currentOptions.tabBarStyle?.display === 'none';

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
        navStateRequest={{
          selectedScreenKey: focusedRouteKey,
          baseProvenance: nativeState.confirmed.provenance,
        }}
        rejectStaleNavStateUpdates
        onTabSelected={onTabSelected}
        onTabSelectionRejected={onTabSelectionRejected}
        onTabSelectionPrevented={onTabSelectionPrevented}
        tabBarHidden={hasCustomTabBar || shouldHideTabBar}
        colorScheme={dark ? 'dark' : 'light'}
        ios={{
          bottomAccessory: bottomAccessory
            ? (environment: TabsBottomAccessoryEnvironment) =>
                bottomAccessory({ placement: environment })
            : undefined,
          tabBarControllerMode,
          tabBarMinimizeBehavior,
          tabBarTintColor: activeTintColor,
        }}
      >
        {state.routes.map((route, index) => {
          const { options, render, navigation } = descriptors[route.key];
          const isFocused = state.index === index;
          const isPreloaded = state.preloadedRouteKeys.includes(route.key);

          const {
            title,
            lazy = false,
            inactiveBehavior = 'pause',
            tabBarLabel,
            tabBarSelectionEnabled,
            tabBarBadgeStyle,
            tabBarIcon,
            tabBarBadge,
            tabBarSystemItem,
            tabBarBlurEffect = dark ? 'systemMaterialDark' : 'systemMaterial',
            tabBarStyle,
            tabBarAccessibilityLabel,
            tabBarButtonTestID,
            sceneStyle,
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

          const tabItemAppearance: TabsScreenItemStateAppearanceIOS = {
            tabBarItemTitleFontFamily: fontFamily,
            tabBarItemTitleFontSize: fontSize,
            tabBarItemTitleFontWeight: fontWeight,
            tabBarItemTitleFontStyle: fontStyle,
            tabBarItemTitleFontColor: inactiveTintColor ?? fontColor,
            tabBarItemIconColor: inactiveTintColor,
            tabBarItemBadgeBackgroundColor: badgeBackgroundColor,
          };

          const normalTabItemAppearance: TabsScreenItemStateAppearanceAndroid =
            {
              tabBarItemTitleFontColor: inactiveTintColor ?? fontColor,
              tabBarItemIconColor: inactiveTintColor,
            };

          const selectedTabItemAppearance: TabsScreenItemStateAppearanceAndroid =
            {
              tabBarItemTitleFontColor: activeTintColor,
              tabBarItemIconColor: activeTintColor,
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

          // An error is thrown for React Elements in `getIcon`
          // So we only call it when we actually render a native tab bar
          const icon = hasCustomTabBar ? undefined : getIcon(false);
          const selectedIcon = hasCustomTabBar ? undefined : getIcon(true);

          // For preloaded screens and if lazy is false,
          // Keep them active so that the effects can run
          const isActive =
            inactiveBehavior === 'none' ||
            isPreloaded ||
            nativeState.lastTransition?.from === route.key ||
            nativeState.lastTransition?.to === route.key ||
            (lazy === false && !loaded.includes(route.key));

          return (
            <Tabs.Screen
              onWillAppear={() => onTransitionStart({ route })}
              onDidAppear={() => onTransitionEnd({ route })}
              key={route.key}
              screenKey={route.key}
              tabBarItemAccessibilityLabel={tabBarAccessibilityLabel}
              tabBarItemTestID={tabBarButtonTestID}
              preventNativeSelection={tabBarSelectionEnabled === false}
              badgeValue={tabBarBadge?.toString()}
              title={tabTitle}
              specialEffects={{
                repeatedTabSelection: {
                  popToRoot: true,
                  scrollToTop: true,
                },
              }}
              android={{
                icon: icon?.android ?? icon?.shared,
                selectedIcon: selectedIcon?.android ?? selectedIcon?.shared,
                standardAppearance: {
                  tabBarBackgroundColor:
                    tabBarBackgroundColor ?? backgroundColor,
                  tabBarItemRippleColor: currentOptions?.tabBarRippleColor,
                  tabBarItemLabelVisibilityMode:
                    currentOptions?.tabBarLabelVisibilityMode,
                  normal: normalTabItemAppearance,
                  selected: selectedTabItemAppearance,
                  tabBarItemActiveIndicatorColor: activeIndicatorColor,
                  tabBarItemActiveIndicatorEnabled:
                    currentOptions?.tabBarActiveIndicatorEnabled,
                  tabBarItemTitleFontFamily: fontFamily,
                  tabBarItemTitleFontWeight: fontWeight,
                  tabBarItemTitleSmallLabelFontSize: fontSize,
                  tabBarItemTitleLargeLabelFontSize: fontSize,
                  tabBarItemTitleFontStyle: fontStyle,
                  tabBarItemBadgeBackgroundColor: badgeBackgroundColor,
                  tabBarItemBadgeTextColor: badgeTextColor,
                },
              }}
              ios={{
                icon: icon?.ios ?? icon?.shared,
                selectedIcon: selectedIcon?.ios ?? selectedIcon?.shared,
                systemItem: tabBarSystemItem,
                scrollEdgeAppearance: {
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
                },
                standardAppearance: {
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
                },
                overrideScrollViewContentInsetAdjustmentBehavior,
              }}
            >
              <Deferred
                lazy={lazy}
                visible={isFocused || isPreloaded || loaded.includes(route.key)}
              >
                <ActivityView
                  key={route.key}
                  mode={isFocused ? 'normal' : isActive ? 'inert' : 'paused'}
                  visible={
                    // We don't need to hide the content since it's handled natively
                    // Hiding may also cause flash due to lag after native tab switch
                    // So we leave it always visible
                    true
                  }
                  style={StyleSheet.absoluteFill}
                >
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
                </ActivityView>
              </Deferred>
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

function getPlatformIcon(icon: Icon): PlatformIcon {
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
