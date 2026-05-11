import {
  getLabel,
  Lazy,
  SafeAreaProviderCompat,
  Screen as ScreenContent,
} from '@react-navigation/elements';
import {
  CommonActions,
  NavigationMetaContext,
  type ParamListBase,
  type Route,
  StackActions,
  type TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import {
  type ColorValue,
  type NativeSyntheticEvent,
  Platform,
  PlatformColor,
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

import { NativeScreen } from './NativeScreen/NativeScreen';
import type {
  NativeBottomTabDescriptorMap,
  NativeBottomTabIcon,
  NativeBottomTabNavigationConfig,
  NativeBottomTabNavigationHelpers,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationProp,
} from './types';

type Props = NativeBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: NativeBottomTabNavigationHelpers;
  descriptors: NativeBottomTabDescriptorMap;
};

type PlatformIcon = {
  ios?: PlatformIconIOS;
  android?: PlatformIconAndroid;
  shared?: PlatformIconShared;
};

type TabSelectionPreventedEvent = {
  selectedScreenKey: string;
  provenance: number;
  preventedScreenKey: string;
};

type ConfirmedState = {
  routeKey: string;
  provenance: number;
};

type NativeState = {
  confirmed: ConfirmedState;
};

type NativeAction = { type: 'CONFIRM_STATE'; confirmed: ConfirmedState };

const meta = {
  type: 'native-tabs',
};

function reducer(state: NativeState, action: NativeAction): NativeState {
  switch (action.type) {
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

export function NativeBottomTabView({ state, navigation, descriptors }: Props) {
  const { dark, colors, fonts } = useTheme();

  const focusedRouteKey = state.routes[state.index].key;
  const [nativeState, dispatch] = React.useReducer(reducer, {
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
  }, [descriptors, focusedRouteKey, navigation, state.index, state.routes]);

  const navigate = (
    route: (typeof state.routes)[number],
    confirmed: ConfirmedState
  ) => {
    dispatch({
      type: 'CONFIRM_STATE',
      confirmed,
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
      navigation.emit({
        type: 'tabPress',
        target: route.key,
      });
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

    dispatch({
      type: 'CONFIRM_STATE',
      confirmed: {
        routeKey: selectedScreenKey,
        provenance,
      },
    });

    navigation.emit({
      type: 'tabPress',
      target: preventedScreenKey,
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

  const shouldHideTabBar = currentOptions.tabBarStyle?.display === 'none';

  const bottomAccessory = currentOptions.bottomAccessory;

  return (
    <SafeAreaProviderCompat>
      <Tabs.Host
        navStateRequest={{
          selectedScreenKey: focusedRouteKey,
          baseProvenance: nativeState.confirmed.provenance,
        }}
        rejectStaleNavStateUpdates
        onTabSelected={onTabSelected}
        onTabSelectionRejected={onTabSelectionRejected}
        onTabSelectionPrevented={onTabSelectionPrevented}
        tabBarHidden={shouldHideTabBar}
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
            lazy = true,
            tabBarLabel,
            tabBarSelectionEnabled,
            tabBarBadgeStyle,
            tabBarIcon,
            tabBarBadge,
            tabBarSystemItem,
            tabBarBlurEffect = dark ? 'systemMaterialDark' : 'systemMaterial',
            tabBarStyle,
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
            tabBarBadgeStyle?.color ??
            (typeof badgeBackgroundColor === 'string'
              ? Color(badgeBackgroundColor).isLight()
                ? 'black'
                : 'white'
              : undefined);

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
            <Tabs.Screen
              onWillDisappear={() =>
                onTransitionStart({ closing: true, route })
              }
              onWillAppear={() => onTransitionStart({ closing: false, route })}
              onDidAppear={() => onTransitionEnd({ closing: false, route })}
              onDidDisappear={() => onTransitionEnd({ closing: true, route })}
              key={route.key}
              screenKey={route.key}
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
                  tabBarBackgroundColor: tabBarBackgroundColor ?? colors.card,
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
              <Lazy enabled={lazy} visible={isFocused || isPreloaded}>
                <ScreenWithHeader
                  isFocused={isFocused}
                  route={route}
                  navigation={navigation}
                  options={options}
                >
                  <NavigationMetaContext.Provider value={meta}>
                    {render()}
                  </NavigationMetaContext.Provider>
                </ScreenWithHeader>
              </Lazy>
            </Tabs.Screen>
          );
        })}
      </Tabs.Host>
    </SafeAreaProviderCompat>
  );
}

function ScreenWithHeader({
  isFocused,
  route,
  navigation,
  options,
  children,
}: {
  isFocused: boolean;
  route: Route<string>;
  navigation: NativeBottomTabNavigationProp<ParamListBase>;
  options: NativeBottomTabNavigationOptions;
  children: React.ReactNode;
}) {
  const {
    headerTransparent,
    header: renderCustomHeader,
    headerShown = renderCustomHeader != null,
  } = options;

  const hasNativeHeader = headerShown && renderCustomHeader == null;

  const [wasNativeHeaderShown] = React.useState(hasNativeHeader);

  React.useEffect(() => {
    if (wasNativeHeaderShown !== hasNativeHeader) {
      throw new Error(
        `Changing 'headerShown' or 'header' options dynamically is not supported when using native header.`
      );
    }
  }, [wasNativeHeaderShown, hasNativeHeader]);

  if (hasNativeHeader) {
    return (
      <NativeScreen route={route} navigation={navigation} options={options}>
        {children}
      </NativeScreen>
    );
  }

  return (
    <ScreenContent
      focused={isFocused}
      route={route}
      navigation={navigation}
      headerShown={headerShown}
      headerTransparent={headerTransparent}
      header={renderCustomHeader?.({
        route,
        navigation,
        options,
      })}
    >
      {children}
    </ScreenContent>
  );
}

function getPlatformIcon(icon: NativeBottomTabIcon): PlatformIcon {
  switch (icon.type) {
    case 'sfSymbol':
      return {
        ios: icon,
        android: undefined,
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
