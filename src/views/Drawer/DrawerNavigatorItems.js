/* @flow */

import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

import DrawerNavigatorItem from './DrawerNavigatorItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  NavigationRoute,
  ViewStyleProp,
  TextStyleProp,
} from '../../TypeDefinition';
import type { DrawerScene, DrawerItem } from './DrawerView.js';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  items: Array<NavigationRoute>,
  activeItemKey?: string,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Element<*> | string),
  renderIcon: (scene: DrawerScene) => ?React.Element<*>,
  onItemPress: (info: DrawerItem) => void,
  style?: ViewStyleProp,
  labelStyle?: TextStyleProp,
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = ({
  navigation: { state, navigate },
  items,
  activeItemKey,
  activeTintColor,
  inactiveTintColor,
  getLabel,
  renderIcon,
  onItemPress,
  style,
  ...drawerItemProps
}: Props) =>
  <View style={[styles.container, style]}>
    {items.map((route: NavigationRoute, index: number) => {
      const focused = activeItemKey === route.key;
      const tintColor = focused ? activeTintColor : inactiveTintColor;
      const scene = { route, focused, index, tintColor };
      const icon = renderIcon(scene);
      const label = getLabel(scene);

      return (
        <DrawerNavigatorItem
          key={route.key}
          activeTintColor={activeTintColor}
          inactiveTintColor={inactiveTintColor}
          focused={focused}
          icon={icon}
          label={label}
          onPress={() => onItemPress({ route, focused })}
          {...drawerItemProps}
        />
      );
    })}
  </View>;

DrawerNavigatorItems.defaultProps = {
  ...DrawerNavigatorItem.defaultProps,
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
});

export default DrawerNavigatorItems;
