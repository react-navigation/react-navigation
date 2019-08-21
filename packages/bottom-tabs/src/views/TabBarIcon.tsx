import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Route } from '@react-navigation/core';

type Props = {
  route: Route<string>;
  horizontal: boolean;
  activeOpacity: number;
  inactiveOpacity: number;
  activeTintColor: string;
  inactiveTintColor: string;
  renderIcon: (props: {
    route: Route<string>;
    focused: boolean;
    tintColor: string;
    horizontal: boolean;
  }) => React.ReactNode;
  style: StyleProp<ViewStyle>;
};

export default function TabBarIcon({
  route,
  activeOpacity,
  inactiveOpacity,
  activeTintColor,
  inactiveTintColor,
  renderIcon,
  horizontal,
  style,
}: Props) {
  // We render the icon twice at the same position on top of each other:
  // active and inactive one, so we can fade between them.
  return (
    <View style={style}>
      <View style={[styles.icon, { opacity: activeOpacity }]}>
        {renderIcon({
          route,
          focused: true,
          horizontal,
          tintColor: activeTintColor,
        })}
      </View>
      <View style={[styles.icon, { opacity: inactiveOpacity }]}>
        {renderIcon({
          route,
          focused: false,
          horizontal,
          tintColor: inactiveTintColor,
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    // Workaround for react-native >= 0.54 layout bug
    minWidth: 25,
  },
});
