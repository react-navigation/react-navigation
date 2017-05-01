/* @flow */

import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

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
  items?: Array<NavigationRoute>,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Element<*> | string),
  renderIcon: (scene: DrawerScene) => ?React.Element<*>,
  getDrawerOnPress: (scene: DrawerScene) => ?() => void,
  style?: Style,
  labelStyle?: Style,
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = (
  {
    navigation: {
      state,
      navigate,
    },
    items,
    activeTintColor,
    activeBackgroundColor,
    inactiveTintColor,
    inactiveBackgroundColor,
    getLabel,
    renderIcon,
    getScreenOptions,
    style,
    labelStyle,
  }: Props,
) => (
  <View style={[styles.container, style]}>
    {(items || state.routes).map((route: NavigationRoute, index: number) => {
      const { drawerOnPress } = getScreenOptions(route.key);
      const focused = state.routes[state.index].key === route.key;
      const color = focused ? activeTintColor : inactiveTintColor;
      const backgroundColor = focused
        ? activeBackgroundColor
        : inactiveBackgroundColor;
      const scene = { route, index, focused, tintColor: color };
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
        return (
          <View key={route.key}>
            {drawerItem}
          </View>
        );
      }

      return (
        <TouchableItem
          key={route.key}
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
    })}
  </View>
);

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItems.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent',
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
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

export default DrawerNavigatorItems;
