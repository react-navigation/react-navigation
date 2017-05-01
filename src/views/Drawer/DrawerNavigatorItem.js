/* @flow */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TouchableItem from '../TouchableItem';

import type { Style } from '../../TypeDefinition';

type Props = {
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  labelStyle?: Style,
  focused?: string,
  icon?: React.Element<*>,
  label?: React.Element<*> | string,
  onPress?: () => void,
};

/**
 * Component for each item in the drawer.
 */
const DrawerNavigatorItem = (
  {
    activeTintColor,
    activeBackgroundColor,
    inactiveTintColor,
    inactiveBackgroundColor,
    labelStyle,
    focused,
    icon,
    label,
    onPress,
  }: Props,
) => {
  const tintColor = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const drawerItem = (
    <View style={[styles.item, { backgroundColor }]}>
      {icon
        ? <View style={[styles.icon, focused ? null : styles.inactiveIcon]}>
            {icon}
          </View>
        : null}
      {typeof label === 'string'
        ? <Text style={[styles.label, { color: tintColor }, labelStyle]}>
            {label}
          </Text>
        : label}
    </View>
  );

  if (!onPress) {
    return drawerItem;
  }

  return (
    <TouchableItem onPress={onPress} delayPressIn={0}>
      {drawerItem}
    </TouchableItem>
  );
};

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItem.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent',
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});

export default DrawerNavigatorItem;
