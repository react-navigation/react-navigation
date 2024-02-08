import type { Route } from '@react-navigation/native';
import React from 'react';
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { Badge } from './Badge';

type Props = {
  route: Route<string>;
  horizontal: boolean;
  badge?: string | number;
  badgeStyle?: StyleProp<TextStyle>;
  activeOpacity: number;
  inactiveOpacity: number;
  activeTintColor: string;
  inactiveTintColor: string;
  renderIcon: (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;
  style: StyleProp<ViewStyle>;
};

const ICON_SIZE = 25;

export function TabBarIcon({
  route: _,
  horizontal,
  badge,
  badgeStyle,
  activeOpacity,
  inactiveOpacity,
  activeTintColor,
  inactiveTintColor,
  renderIcon,
  style,
}: Props) {
  // We render the icon twice at the same position on top of each other:
  // active and inactive one, so we can fade between them.
  return (
    <View
      style={[horizontal ? styles.iconHorizontal : styles.iconVertical, style]}
    >
      <View style={[styles.icon, { opacity: activeOpacity }]}>
        {renderIcon({
          focused: true,
          size: ICON_SIZE,
          color: activeTintColor,
        })}
      </View>
      <View style={[styles.icon, { opacity: inactiveOpacity }]}>
        {renderIcon({
          focused: false,
          size: ICON_SIZE,
          color: inactiveTintColor,
        })}
      </View>
      <Badge
        visible={badge != null}
        style={[styles.badge, badgeStyle]}
        size={ICON_SIZE * 0.75}
      >
        {badge}
      </Badge>
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
    minWidth: ICON_SIZE,
  },
  iconVertical: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconHorizontal: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
  },
});
