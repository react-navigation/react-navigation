import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { Route, useTheme } from '@react-navigation/native';
import Color from 'color';

import type { MaterialTopTabBarProps } from '../types';

export default function TabBarTop({
  state,
  navigation,
  descriptors,
  ...rest
}: MaterialTopTabBarProps) {
  const { colors } = useTheme();

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const activeColor = focusedOptions.tabBarActiveTintColor ?? colors.text;
  const inactiveColor =
    focusedOptions.tabBarInactiveTintColor ??
    Color(activeColor).alpha(0.5).rgb().string();

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
      indicatorContainerStyle={focusedOptions.tabBarIndicatorContainerStyle}
      contentContainerStyle={focusedOptions.tabBarContentContainerStyle}
      style={[{ backgroundColor: colors.card }, focusedOptions.tabBarStyle]}
      getAccessibilityLabel={({ route }) =>
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      getTestID={({ route }) => descriptors[route.key].options.tabBarTestID}
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
      renderIcon={({ route, focused, color }) => {
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
      }}
      renderLabel={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        if (options.tabBarShowLabel === false) {
          return null;
        }

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : (route as Route<string>).name;

        if (typeof label === 'string') {
          return (
            <Text
              style={[styles.label, { color }, options.tabBarLabelStyle]}
              allowFontScaling={options.tabBarAllowFontScaling}
            >
              {label}
            </Text>
          );
        }

        return label({ focused, color });
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
