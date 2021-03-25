import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type { Route } from '@react-navigation/native';
import Badge from './Badge';

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

export default function TabBarIcon({
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
  const size = 25;

  // We render the icon twice at the same position on top of each other:
  // active and inactive one, so we can fade between them.
  return (
    <View
      style={[horizontal ? styles.iconHorizontal : styles.iconVertical, style]}
    >
      <View style={[styles.icon, { opacity: activeOpacity }]}>
        {renderIcon({
          focused: true,
          size,
          color: activeTintColor,
        })}
      </View>
      <View style={[styles.icon, { opacity: inactiveOpacity }]}>
        {renderIcon({
          focused: false,
          size,
          color: inactiveTintColor,
        })}
      </View>
      <Badge
        visible={badge != null}
        style={[
          styles.badge,
          horizontal ? styles.badgeHorizontal : styles.badgeVertical,
          badgeStyle,
        ]}
        size={(size * 3) / 4}
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
    minWidth: 25,
  },
  iconVertical: {
    flex: 1,
  },
  iconHorizontal: {
    height: '100%',
    marginTop: 3,
  },
  badge: {
    position: 'absolute',
    left: 3,
  },
  badgeVertical: {
    top: 3,
  },
  badgeHorizontal: {
    top: 7,
  },
});
