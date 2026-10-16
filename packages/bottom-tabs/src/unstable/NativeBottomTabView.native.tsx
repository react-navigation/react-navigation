import {
  getLabel,
  SafeAreaProviderCompat,
  Screen as ScreenContent,
} from '@react-navigation/elements';
import {
  CommonActions,
  NavigationMetaContext,
  type NavigationRoute,
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
  type TextStyle,
} from 'react-native';
import {
  type PlatformIconShared,
  Tabs,
  type TabsBottomAccessoryEnvironment,
  type TabSelectedEvent,
  type TabSelectionRejectedEvent,
  type TabsScreenIconAndroid,
  type TabsScreenIconIOS,
  type TabsScreenItemStateAppearanceAndroid,
  type TabsScreenItemStateAppearanceIOS,
} from 'react-native-screens';

import { Deferred } from './Deferred';
import { NativeScreen } from './NativeScreen/NativeScreen';
import type {
  NativeBottomTabDescriptor,
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
  ios?: TabsScreenIconIOS;
  android?: TabsScreenIconAndroid;
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

const SUPPORTS_PROMINENT_TAB =
  Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 27;

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
      const currentState = navigation.getState();
      const prevRoute = currentState.routes.find(
        (route) => route.key === previousRouteKey
      );

      if (
        prevRoute?.state?.type === 'stack' &&
        prevRoute.state.key &&
        (prevRoute.state.index ?? prevRoute.state.routes.length - 1) > 0
      ) {
        navigation.dispatch({
          ...StackActions.popToTop(),
          target: prevRoute.state.key,
        });
      }
    }

    previousRouteKeyRef.current = focusedRouteKey;
  }, [descriptors, focusedRouteKey, navigation]);

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
    const { selectedScreenKey, provenance, actionOrigin, isRepeated } =
      event.nativeEvent;

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
      const { tabBarRepeatedPressBehavior } = descriptors[route.key].options;

      navigation.emit({
        type: 'tabPress',
        target: route.key,
        data: {
          origin: 'native',
          behavior: {
            scrollToTop:
              isRepeated && tabBarRepeatedPressBehavior?.scrollToTop !== false,
            popToTop:
              isRepeated && tabBarRepeatedPressBehavior?.popToTop !== false,
          },
        },
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
      data: {
        origin: 'native',
        behavior: {
          scrollToTop: false,
          popToTop: false,
        },
      },
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

  const { activeIndicatorColor, activeTintColor, inactiveTintColor } =
    React.useMemo(() => {
      const activeTintColor =
        currentOptions.tabBarActiveTintColor ?? colors.primary;

      const inactiveTintColor =
        currentOptions.tabBarInactiveTintColor ??
        Platform.select<ColorValue | string>({
          ios: PlatformColor('label'),
          default: colors.text,
        });

      const activeIndicatorColor =
        currentOptions?.tabBarActiveIndicatorColor ??
        (typeof activeTintColor === 'string'
          ? Color(activeTintColor)?.alpha(0.1).string()
          : undefined);

      return { activeIndicatorColor, activeTintColor, inactiveTintColor };
    }, [
      currentOptions?.tabBarActiveIndicatorColor,
      currentOptions.tabBarActiveTintColor,
      currentOptions.tabBarInactiveTintColor,
      colors.primary,
      colors.text,
    ]);

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

  const tabBarSidebarPreferredPlacement =
    currentOptions.tabBarSidebarPreferredPlacement === 'auto'
      ? 'automatic'
      : currentOptions.tabBarSidebarPreferredPlacement;

  const prominentScreenKey = SUPPORTS_PROMINENT_TAB
    ? state.routes.find(
        (route) => descriptors[route.key]?.options.tabBarRole === 'prominent'
      )?.key
    : undefined;

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
        nativeContainerStyle={{ backgroundColor: colors.background }}
        ios={{
          prominentScreenKey,
          bottomAccessory: bottomAccessory
            ? (environment: TabsBottomAccessoryEnvironment) =>
                bottomAccessory({ placement: environment })
            : undefined,
          tabBarHiddenAnimationEnabled:
            currentOptions.tabBarVisibilityAnimationEnabled,
          tabBarControllerMode,
          tabBarSidebarPreferredPlacement,
          tabBarMinimizeBehavior,
          tabBarTintColor: activeTintColor,
        }}
      >
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const isFocused = state.index === index;
          const isPreloaded = state.preloadedRouteKeys.includes(route.key);

          const { lazy = false } = descriptor.options;

          return (
            <TabScene
              key={route.key}
              route={route}
              descriptor={descriptor}
              navigation={navigation}
              isFocused={isFocused}
              lazy={lazy}
              visible={isFocused || isPreloaded}
              fontFamily={fontFamily}
              fontWeight={fontWeight}
              fontSize={fontSize}
              fontStyle={fontStyle}
              fontColor={fontColor}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
              activeIndicatorColor={activeIndicatorColor}
              rippleColor={currentOptions.tabBarRippleColor}
              labelVisibilityMode={currentOptions.tabBarLabelVisibilityMode}
              activeIndicatorEnabled={
                currentOptions.tabBarActiveIndicatorEnabled
              }
            />
          );
        })}
      </Tabs.Host>
    </SafeAreaProviderCompat>
  );
}

type TabSceneProps = {
  route: NavigationRoute<ParamListBase, string>;
  descriptor: NativeBottomTabDescriptor;
  navigation: NativeBottomTabNavigationHelpers;
  isFocused: boolean;
  lazy: boolean;
  visible: boolean;
  fontFamily: TextStyle['fontFamily'];
  fontWeight: TextStyle['fontWeight'];
  fontSize: TextStyle['fontSize'];
  fontStyle: TextStyle['fontStyle'];
  fontColor: TextStyle['color'];
  activeTintColor: ColorValue;
  inactiveTintColor: ColorValue;
  activeIndicatorColor: ColorValue | undefined;
  rippleColor: ColorValue | undefined;
  labelVisibilityMode: NativeBottomTabNavigationOptions['tabBarLabelVisibilityMode'];
  activeIndicatorEnabled: boolean | undefined;
};

const TabScene = React.memo(function TabScene({
  route,
  descriptor,
  navigation,
  isFocused,
  lazy,
  visible,
  fontFamily,
  fontWeight,
  fontSize,
  fontStyle,
  fontColor,
  activeTintColor,
  inactiveTintColor,
  activeIndicatorColor,
  rippleColor,
  labelVisibilityMode,
  activeIndicatorEnabled,
}: TabSceneProps) {
  const { dark, colors } = useTheme();

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

  const { options, render } = descriptor;

  const {
    title,
    tabBarLabel,
    tabBarLabelPositionAdjustment,
    tabBarSelectionEnabled,
    tabBarRepeatedPressBehavior,
    tabBarBadgeStyle,
    tabBarIcon,
    tabBarIconSize,
    tabBarActiveIndicatorWidth,
    tabBarActiveIndicatorHeight,
    tabBarBadge,
    tabBarSystemItem,
    tabBarRole,
    tabBarSearchAutoFocus,
    tabBarBlurEffect = dark ? 'systemMaterialDark' : 'systemMaterial',
    tabBarStyle,
    overrideScrollViewContentInsetAdjustmentBehavior,
  } = options;

  const systemItem =
    tabBarSystemItem ??
    // Setting the `role` to 'search' doesn't add title and icon automatically
    // So we also set `tabBarSystemItem` to 'search' to match SwiftUI's behavior
    (tabBarRole === 'search' ? 'search' : undefined);

  const {
    backgroundColor: tabBarBackgroundColor,
    shadowColor: tabBarShadowColor,
  } = tabBarStyle || {};

  const tabTitle =
    // On iOS, `systemItem` already provides a localized label
    // So we should only use `tabBarLabel` if explicitly provided
    Platform.OS === 'ios' && systemItem != null
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

  const tabItemLayoutAppearance = {
    stacked: {
      normal: {
        ...tabItemAppearance,
        tabBarItemTitlePositionAdjustment:
          tabBarLabelPositionAdjustment?.stacked,
      },
    },
    inline: {
      normal: {
        ...tabItemAppearance,
        tabBarItemTitlePositionAdjustment:
          tabBarLabelPositionAdjustment?.inline,
      },
    },
    compactInline: {
      normal: {
        ...tabItemAppearance,
        tabBarItemTitlePositionAdjustment:
          tabBarLabelPositionAdjustment?.compactInline,
      },
    },
  };

  const normalTabItemAppearance: TabsScreenItemStateAppearanceAndroid = {
    tabBarItemTitleFontColor: inactiveTintColor ?? fontColor,
    tabBarItemIconColor: inactiveTintColor,
  };

  const selectedTabItemAppearance: TabsScreenItemStateAppearanceAndroid = {
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
      onWillDisappear={() => onTransitionStart({ closing: true, route })}
      onWillAppear={() => onTransitionStart({ closing: false, route })}
      onDidAppear={() => onTransitionEnd({ closing: false, route })}
      onDidDisappear={() => onTransitionEnd({ closing: true, route })}
      screenKey={route.key}
      preventNativeSelection={tabBarSelectionEnabled === false}
      badgeValue={tabBarBadge?.toString()}
      title={tabTitle}
      style={{ backgroundColor: colors.background }}
      specialEffects={{
        repeatedTabSelection: {
          popToRoot: tabBarRepeatedPressBehavior?.popToTop !== false,
          scrollToTop: tabBarRepeatedPressBehavior?.scrollToTop !== false,
        },
      }}
      android={{
        icon: icon?.android ?? icon?.shared,
        selectedIcon: selectedIcon?.android ?? selectedIcon?.shared,
        standardAppearance: {
          tabBarBackgroundColor: tabBarBackgroundColor ?? colors.card,
          tabBarItemRippleColor: rippleColor,
          tabBarItemLabelVisibilityMode: labelVisibilityMode,
          normal: normalTabItemAppearance,
          selected: selectedTabItemAppearance,
          tabBarItemIconSize: tabBarIconSize,
          tabBarItemActiveIndicatorColor: activeIndicatorColor,
          tabBarItemActiveIndicatorEnabled: activeIndicatorEnabled,
          tabBarItemActiveIndicatorWidth: tabBarActiveIndicatorWidth,
          tabBarItemActiveIndicatorHeight: tabBarActiveIndicatorHeight,
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
        systemItem,
        role: tabBarRole === 'search' ? tabBarRole : undefined,
        automaticallyActivatesSearch: tabBarSearchAutoFocus,
        scrollEdgeAppearance: {
          tabBarBackgroundColor,
          tabBarShadowColor,
          tabBarBlurEffect,
          ...tabItemLayoutAppearance,
        },
        standardAppearance: {
          tabBarBackgroundColor,
          tabBarShadowColor,
          tabBarBlurEffect,
          ...tabItemLayoutAppearance,
        },
        overrideScrollViewContentInsetAdjustmentBehavior,
      }}
    >
      <Deferred lazy={lazy} visible={visible}>
        <ScreenWithHeader
          isFocused={isFocused}
          route={route}
          navigation={descriptor.navigation}
          options={options}
        >
          <NavigationMetaContext.Provider value={meta}>
            {render()}
          </NavigationMetaContext.Provider>
        </ScreenWithHeader>
      </Deferred>
    </Tabs.Screen>
  );
});

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
        ios: {
          type: 'sfSymbol',
          name: icon.name,
          renderingMode:
            icon.renderingMode === 'multicolor'
              ? 'original'
              : icon.renderingMode,
        },
        android: undefined,
        shared: undefined,
      };
    case 'image': {
      // A `{ uri: 'name' }` source maps to an Android drawable by name.
      const drawableName =
        typeof icon.source === 'object' &&
        'uri' in icon.source &&
        icon.source.uri?.includes(':') === false
          ? icon.source.uri
          : undefined;

      return {
        ios: {
          type: 'imageSource',
          imageSource: icon.source,
          renderingMode: icon.tinted === false ? 'original' : 'template',
        },
        android:
          drawableName != null
            ? {
                type: 'drawableResource',
                name: drawableName,
                tinting: icon.tinted === false ? 'original' : 'tinted',
              }
            : {
                type: 'imageSource',
                imageSource: icon.source,
                tinting: icon.tinted === false ? 'original' : 'tinted',
              },
        shared: undefined,
      };
    }
    default: {
      const _exhaustiveCheck: never = icon;

      return _exhaustiveCheck;
    }
  }
}
