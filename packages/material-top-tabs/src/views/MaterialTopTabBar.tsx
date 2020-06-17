import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { Route, useTheme } from '@react-navigation/native';
import Color from 'color';

import type { MaterialTopTabBarProps } from '../types';

export default function TabBarTop(props: MaterialTopTabBarProps) {
  const { colors } = useTheme();

  const {
    state,
    navigation,
    descriptors,
    activeTintColor = colors.text,
    inactiveTintColor = Color(activeTintColor).alpha(0.5).rgb().string(),
    allowFontScaling = true,
    showIcon = false,
    showLabel = true,
    pressColor = Color(activeTintColor).alpha(0.08).rgb().string(),
    iconStyle,
    labelStyle,
    indicatorStyle,
    style,
    ...rest
  } = props;

  return (
    <TabBar
      {...rest}
      navigationState={state}
      activeColor={activeTintColor}
      inactiveColor={inactiveTintColor}
      indicatorStyle={[{ backgroundColor: colors.primary }, indicatorStyle]}
      style={[{ backgroundColor: colors.card }, style]}
      pressColor={pressColor}
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
        if (showIcon === false) {
          return null;
        }

        const { options } = descriptors[route.key];

        if (options.tabBarIcon !== undefined) {
          const icon = options.tabBarIcon({ focused, color });

          return <View style={[styles.icon, iconStyle]}>{icon}</View>;
        }

        return null;
      }}
      renderLabel={({ route, focused, color }) => {
        if (showLabel === false) {
          return null;
        }

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : (route as Route<string>).name;

        if (typeof label === 'string') {
          return (
            <Text
              style={[styles.label, { color }, labelStyle]}
              allowFontScaling={allowFontScaling}
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
