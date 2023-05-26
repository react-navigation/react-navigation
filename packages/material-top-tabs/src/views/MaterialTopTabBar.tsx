import {
  ParamListBase,
  Route,
  TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TabBar, TabBarIndicator, TabBarProps } from 'react-native-tab-view';
import useLatestCallback from 'use-latest-callback';

import type { MaterialTopTabBarProps } from '../types';

export function MaterialTopTabBar({
  state,
  navigation,
  descriptors,
  ...rest
}: MaterialTopTabBarProps) {
  const { colors, fonts } = useTheme();

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const activeColor = focusedOptions.tabBarActiveTintColor ?? colors.text;
  const inactiveColor =
    focusedOptions.tabBarInactiveTintColor ??
    Color(activeColor).alpha(0.5).rgb().string();

  type Props = TabBarProps<Route<string>>;

  const getAccessibilityLabel = useLatestCallback<
    NonNullable<Props['getAccessibilityLabel']>
  >(({ route }) => descriptors[route.key].options.tabBarAccessibilityLabel);

  const getTestID = useLatestCallback<NonNullable<Props['getTestID']>>(
    ({ route }) => descriptors[route.key].options.tabBarButtonTestID
  );

  const renderIcon = useLatestCallback<NonNullable<Props['renderIcon']>>(
    ({ route, focused, color }) => {
      const { options } = descriptors[route.key];

      if (options.tabBarShowIcon === false) {
        return null;
      }

      if (options.tabBarIcon !== undefined) {
        const icon = options.tabBarIcon({ focused, color });

        return (
          <View style={[styles.icon, options.tabBarIconStyle]}>{icon}</View>
        );
      }

      return null;
    }
  );

  const renderLabel = useLatestCallback<NonNullable<Props['renderLabel']>>(
    ({ route, focused, color }) => {
      const { options } = descriptors[route.key];

      if (options.tabBarShowLabel === false) {
        return null;
      }

      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      if (typeof label === 'string') {
        return (
          <Text
            style={[
              { color },
              fonts.regular,
              styles.label,
              options.tabBarLabelStyle,
            ]}
            allowFontScaling={options.tabBarAllowFontScaling}
          >
            {label}
          </Text>
        );
      }

      const children =
        typeof options.tabBarLabel === 'string'
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      return label({ focused, color, children });
    }
  );

  const renderBadge = useLatestCallback<NonNullable<Props['renderBadge']>>(
    ({ route }) => {
      const { tabBarBadge } = descriptors[route.key].options;

      return tabBarBadge?.() ?? null;
    }
  );

  return (
    <TabBar
      {...rest}
      navigationState={state}
      scrollEnabled={focusedOptions.tabBarScrollEnabled}
      bounces={focusedOptions.tabBarBounces}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      pressColor={focusedOptions.tabBarPressColor}
      pressOpacity={focusedOptions.tabBarPressOpacity}
      tabStyle={focusedOptions.tabBarItemStyle}
      indicatorStyle={[
        { backgroundColor: colors.primary },
        focusedOptions.tabBarIndicatorStyle,
      ]}
      gap={focusedOptions.tabBarGap}
      android_ripple={focusedOptions.tabBarAndroidRipple}
      indicatorContainerStyle={focusedOptions.tabBarIndicatorContainerStyle}
      contentContainerStyle={focusedOptions.tabBarContentContainerStyle}
      style={[{ backgroundColor: colors.card }, focusedOptions.tabBarStyle]}
      getAccessibilityLabel={getAccessibilityLabel}
      getTestID={getTestID}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        }
      }}
      onTabLongPress={({ route }) =>
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        })
      }
      renderIcon={renderIcon}
      renderLabel={renderLabel}
      renderBadge={renderBadge}
      renderIndicator={({ navigationState: state, ...rest }) => {
        return focusedOptions.tabBarIndicator ? (
          focusedOptions.tabBarIndicator({
            state: state as TabNavigationState<ParamListBase>,
            ...rest,
          })
        ) : (
          <TabBarIndicator navigationState={state} {...rest} />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
  label: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 13,
    margin: 4,
    backgroundColor: 'transparent',
  },
});
