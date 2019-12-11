import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { Route } from '@react-navigation/native';

import { MaterialTopTabBarProps } from '../types';

export default function TabBarTop({
  state,
  navigation,
  descriptors,
  activeTintColor = 'rgba(255, 255, 255, 1)',
  inactiveTintColor = 'rgba(255, 255, 255, 0.7)',
  allowFontScaling = true,
  iconStyle,
  labelStyle,
  showIcon = false,
  showLabel = true,
  ...rest
}: MaterialTopTabBarProps) {
  return (
    <TabBar
      {...rest}
      navigationState={state}
      activeColor={activeTintColor}
      inactiveColor={inactiveTintColor}
      getAccessibilityLabel={({ route }) =>
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      getTestID={({ route }) => descriptors[route.key].options.tabBarTestID}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
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
