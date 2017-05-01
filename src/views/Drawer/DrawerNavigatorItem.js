/* @flow */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TouchableItem from '../TouchableItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  NavigationRoute,
  Style,
} from '../../TypeDefinition';
import type { DrawerScene } from './DrawerView.js';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  route: NavigationRoute,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Element<*> | string),
  renderIcon: (scene: DrawerScene) => ?React.Element<*>,
  getDrawerOnPress: (scene: DrawerScene) => ?() => void,
  labelStyle?: Style,
};

/**
 * Component for each item in the drawer.
 */
const DrawerNavigatorItem = (
  {
    navigation: {
      state,
      navigate,
    },
    route,
    activeTintColor,
    activeBackgroundColor,
    inactiveTintColor,
    inactiveBackgroundColor,
    getLabel,
    renderIcon,
    getScreenOptions,
    labelStyle,
  }: Props,
) => {
  const { drawerOnPress } = getScreenOptions(route.key);
  const focused = state.routes[state.index].key === route.key;
  const color = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;
  const scene = { route, focused, tintColor: color };
  const icon = renderIcon(scene);
  const label = getLabel(scene);

  const drawerItem = (
    <View style={[styles.item, { backgroundColor }]}>
      {icon
        ? <View style={[styles.icon, focused ? null : styles.inactiveIcon]}>
            {icon}
          </View>
        : null}
      {typeof label === 'string'
        ? <Text style={[styles.label, { color }, labelStyle]}>
            {label}
          </Text>
        : label}
    </View>
  );

  if (drawerOnPress === null) {
    return drawerItem;
  }

  return (
    <TouchableItem
      onPress={
        drawerOnPress
          ? () => drawerOnPress()
          : () => {
              navigate('DrawerClose');
              navigate(route.routeName);
            }
      }
      delayPressIn={0}
    >
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
