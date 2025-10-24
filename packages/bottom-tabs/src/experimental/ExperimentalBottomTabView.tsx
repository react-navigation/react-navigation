import {
  Color,
  getLabel,
  SafeAreaProviderCompat,
  useHeaderConfig,
  useHeaderConfigProp,
} from '@react-navigation/elements';
import {
  CommonActions,
  type ParamListBase,
  StackActions,
  type TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, PlatformColor, StyleSheet } from 'react-native';
import {
  BottomTabs,
  BottomTabsScreen,
  type BottomTabsScreenItemStateAppearance,
  type PlatformIcon,
  ScreenStack,
  ScreenStackItem,
} from 'react-native-screens';

import type {
  ExperimentalBottomTabDescriptor,
  ExperimentalBottomTabDescriptorMap,
  ExperimentalBottomTabNavigationConfig,
  ExperimentalBottomTabNavigationHelpers,
  Icon,
} from './types';

type Props = ExperimentalBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: ExperimentalBottomTabNavigationHelpers;
  descriptors: ExperimentalBottomTabDescriptorMap;
};

const SceneView = ({
  lazy,
  loaded,
  isFocused,
  isPreloaded,
  descriptor,
}: {
  lazy: boolean;
  loaded: boolean;
  isFocused: boolean;
  isPreloaded: boolean;
  descriptor: ExperimentalBottomTabDescriptor;
}) => {
  const { header, headerShown } = descriptor.options;

  const {
    onHeaderHeightChange,
    headerHeight,
    headerTopInsetEnabled,
    renderHeaderProvider,
  } = useHeaderConfig({
    headerShown: headerShown === true,
    isModal: false,
    options: descriptor.options,
    renderCustomHeader: header ? () => header(descriptor) : null,
  });

  const headerConfig = useHeaderConfigProp({
    ...descriptor.options,
    route: descriptor.route,
    headerBackButtonMenuEnabled: false, // TODO: support this
    headerBackTitle: undefined,
    headerHeight,
    headerShown: header !== undefined ? false : headerShown === true,
    headerTopInsetEnabled,
    headerBack: undefined,
  });

  // Don't render a lazy screen if we've never navigated to it or it wasn't preloaded
  return lazy && !loaded && !isFocused && !isPreloaded ? null : (
    <SafeAreaProviderCompat>
      <ScreenStack style={styles.container}>
        <ScreenStackItem
          screenId={descriptor.route.key}
          style={StyleSheet.absoluteFill}
          headerConfig={headerConfig}
          onHeaderHeightChange={onHeaderHeightChange}
        >
          {renderHeaderProvider(descriptor.render())}
        </ScreenStackItem>
      </ScreenStack>
    </SafeAreaProviderCompat>
  );
};

export function ExperimentalBottomTabView({
  state,
  navigation,
  descriptors,
}: Props) {
  const { colors, fonts } = useTheme();

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

  const currentOptions = descriptors[state.routes[state.index].key]?.options;

  const {
    backgroundColor: tabBarBackgroundColor,
    shadowColor: tabBarShadowColor,
  } = currentOptions.tabBarStyle || {};

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
    Platform.select({ ios: PlatformColor('label'), default: colors.text });

  const activeIndicatorColor =
    currentOptions?.tabBarActiveIndicatorColor ??
    Color(activeTintColor)?.alpha(0.1).string();

  return (
    <BottomTabs
      tabBarItemLabelVisibilityMode={currentOptions?.tabBarLabelVisibilityMode}
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
          title,
          lazy = true,
          tabBarLabel,
          tabBarBadgeStyle,
          tabBarIcon,
          tabBarBadge,
          tabBarSystemItem,
        } = options;

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
        const badgeTextColor = Color(badgeBackgroundColor)?.isLight()
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
            onWillDisappear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: true },
                target: route.key,
              });
            }}
            onWillAppear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: false },
                target: route.key,
              });
            }}
            onDidAppear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: false },
                target: route.key,
              });
            }}
            onDidDisappear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: true },
                target: route.key,
              });
            }}
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
            {/*{*/}
            {/*  // Don't render a lazy screen if we've never navigated to it or it wasn't preloaded*/}
            {/*  lazy && !loaded.includes(route.key) && !isFocused && !isPreloaded*/}
            {/*    ? null*/}
            {/*    : descriptors[route.key].render()*/}
            {/*}*/}
            <SceneView
              lazy={lazy}
              loaded={loaded.includes(route.key)}
              descriptor={descriptors[route.key]}
              isFocused={isFocused}
              isPreloaded={isPreloaded}
            />
          </BottomTabsScreen>
        );
      })}
    </BottomTabs>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
