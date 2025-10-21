import {
  Color,
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
import { Platform, PlatformColor } from 'react-native';
import {
  BottomTabs,
  BottomTabsScreen,
  type BottomTabsScreenItemStateAppearance,
  type BottomTabsScreenProps,
  type Icon,
} from 'react-native-screens';

import type {
  ExperimentalBottomTabDescriptorMap,
  ExperimentalBottomTabHeaderProps,
  ExperimentalBottomTabNavigationConfig,
  ExperimentalBottomTabNavigationHelpers,
  ExperimentalBottomTabNavigationProp,
} from './types';

type Props = ExperimentalBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: ExperimentalBottomTabNavigationHelpers;
  descriptors: ExperimentalBottomTabDescriptorMap;
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
    fontSize = Platform.select({
      // FIXME: setting font family or weight overrides the font size on iOS
      ios: 10,
      default: undefined,
    }),
    fontStyle,
  } = currentOptions.tabBarLabelStyle || {};

  const activeTintColor =
    currentOptions.tabBarActiveTintColor ?? colors.primary;

  const inactiveTintColor =
    currentOptions.tabBarInactiveTintColor ??
    Platform.select({ ios: PlatformColor('label'), default: colors.text });

  return (
    <BottomTabs
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
      tabBarItemActiveIndicatorColor={
        currentOptions?.tabBarActiveIndicatorColor
      }
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
          header = ({ options }: ExperimentalBottomTabHeaderProps) => (
            <Header {...options} title={getHeaderTitle(options, route.name)} />
          ),
          headerShown,
          headerStatusBarHeight,
          headerTransparent,
          sceneStyle,
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
            {...getIconProps(tabBarIcon)}
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
              style={sceneStyle}
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

function getIconProps(
  icon: Icon | undefined
): Pick<BottomTabsScreenProps, 'icon' | 'iconResource'> {
  if (!icon) {
    return {};
  }

  if (Platform.OS === 'ios') {
    return {
      icon,
    };
  }

  if ('templateSource' in icon) {
    return {
      iconResource: icon.templateSource,
    };
  }

  return {};
}
