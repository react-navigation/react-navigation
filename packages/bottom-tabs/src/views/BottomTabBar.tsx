import { MissingIcon } from '@react-navigation/elements';
import {
  CommonActions,
  NavigationContext,
  NavigationRouteContext,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import useTabBarAnimatedVisibility from '../hooks/useTabBarAnimatedVisibility';
import useTabBarLayout from '../hooks/useTabBarLayout';
import type { BottomTabBarProps, BottomTabNavigationOptions } from '../types';
import getPaddingBottom from '../utils/getPaddingBottom';
import getTabBarHeight from '../utils/getTabBarHeight';
import shouldUseHorizontalLabels from '../utils/shouldUseHorizontalLabels';
import BottomTabItem from './BottomTabItem';

type Props = BottomTabBarProps & {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

export default function BottomTabBar({
  state,
  navigation,
  descriptors,
  insets,
  style,
}: Props) {
  const { colors } = useTheme();
  const buildLink = useLinkBuilder();

  const { routes, index } = state;
  const focusedRoute = routes[index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;

  const {
    tabBarShowLabel,
    tabBarHideOnKeyboard = false,
    tabBarVisibilityAnimationConfig,
    tabBarStyle,
    tabBarBackground,
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
  } = focusedOptions;

  const dimensions = useSafeAreaFrame();
  const [layout, handleLayout] = useTabBarLayout(dimensions);

  const paddingBottom = getPaddingBottom(insets);
  const tabBarHeight = getTabBarHeight({
    state,
    descriptors,
    insets,
    dimensions,
    layout,
    style: [tabBarStyle, style],
  });

  const { isTabBarHidden, animatedStyles } = useTabBarAnimatedVisibility({
    tabBarHideOnKeyboard,
    tabBarVisibilityAnimationConfig,
    paddingBottom,
    layout,
  });

  const hasHorizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions,
    layout,
  });

  const tabBarBackgroundElement = tabBarBackground?.();

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          backgroundColor:
            tabBarBackgroundElement != null ? 'transparent' : colors.card,
          borderTopColor: colors.border,
        },
        animatedStyles,
        {
          height: tabBarHeight,
          paddingBottom,
          paddingHorizontal: Math.max(insets.left, insets.right),
        },
        tabBarStyle,
      ]}
      pointerEvents={isTabBarHidden ? 'none' : 'auto'}
      onLayout={handleLayout}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {tabBarBackgroundElement}
      </View>
      <View accessibilityRole="tablist" style={styles.content}>
        {routes.map((route, index) => {
          const focused = index === state.index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate({ name: route.name, merge: true }),
                target: state.key,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const label = getLabel(options, route.name);
          const accessibilityLabel = getAccessibilityLabel(
            options,
            `${label}, tab, ${index + 1} of ${routes.length}`
          );

          return (
            <NavigationContext.Provider
              key={route.key}
              value={descriptors[route.key].navigation}
            >
              <NavigationRouteContext.Provider value={route}>
                <BottomTabItem
                  route={route}
                  focused={focused}
                  horizontal={hasHorizontalLabels}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityLabel={accessibilityLabel}
                  to={buildLink(route.name, route.params)}
                  testID={options.tabBarTestID}
                  allowFontScaling={options.tabBarAllowFontScaling}
                  activeTintColor={tabBarActiveTintColor}
                  inactiveTintColor={tabBarInactiveTintColor}
                  activeBackgroundColor={tabBarActiveBackgroundColor}
                  inactiveBackgroundColor={tabBarInactiveBackgroundColor}
                  button={options.tabBarButton}
                  icon={
                    options.tabBarIcon ??
                    (({ color, size }) => (
                      <MissingIcon color={color} size={size} />
                    ))
                  }
                  badge={options.tabBarBadge}
                  badgeStyle={options.tabBarBadgeStyle}
                  label={label}
                  showLabel={tabBarShowLabel}
                  labelStyle={options.tabBarLabelStyle}
                  iconStyle={options.tabBarIconStyle}
                  style={options.tabBarItemStyle}
                />
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});

export const getLabel = (
  { title, tabBarLabel }: BottomTabNavigationOptions,
  defaultLabel: string
) =>
  tabBarLabel !== undefined
    ? tabBarLabel
    : title !== undefined
    ? title
    : defaultLabel;

export const getAccessibilityLabel = (
  { tabBarAccessibilityLabel }: BottomTabNavigationOptions,
  defaultLabel: string
) =>
  tabBarAccessibilityLabel !== undefined
    ? tabBarAccessibilityLabel
    : Platform.OS === 'ios'
    ? defaultLabel
    : undefined;
