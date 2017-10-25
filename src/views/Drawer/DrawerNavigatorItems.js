/* @flow */

import * as React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

import SafeAreaView from '../SafeAreaView';
import TouchableItem from '../TouchableItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  ViewStyleProp,
  TextStyleProp,
} from '../../TypeDefinition';
import type { DrawerScene, DrawerItem } from './DrawerView.js';

type Props = {
  navigation: NavigationScreenProp<NavigationState>,
  items: Array<NavigationRoute>,
  activeItemKey?: string,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Node | string),
  renderIcon: (scene: DrawerScene) => ?React.Node,
  onItemPress: (info: DrawerItem) => void,
  itemsContainerStyle?: ViewStyleProp,
  itemStyle?: ViewStyleProp,
  labelStyle?: TextStyleProp,
  iconContainerStyle?: ViewStyleProp,
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = ({
  navigation: { state, navigate },
  items,
  activeItemKey,
  activeTintColor,
  activeBackgroundColor,
  inactiveTintColor,
  inactiveBackgroundColor,
  getLabel,
  renderIcon,
  onItemPress,
  itemsContainerStyle,
  itemStyle,
  labelStyle,
  iconContainerStyle,
}: Props) => (
  <SafeAreaView forceInset={{ horizontal: 'never' }}>
    <View style={[styles.container, itemsContainerStyle]}>
      {items.map((route: NavigationRoute, index: number) => {
        const focused = activeItemKey === route.key;
        const color = focused ? activeTintColor : inactiveTintColor;
        const backgroundColor = focused
          ? activeBackgroundColor
          : inactiveBackgroundColor;
        const scene = { route, index, focused, tintColor: color };
        const icon = renderIcon(scene);
        const label = getLabel(scene);
        return (
          <TouchableItem
            key={route.key}
            onPress={() => {
              onItemPress({ route, focused });
            }}
            delayPressIn={0}
          >
            <SafeAreaView style={[styles.item, { backgroundColor }, itemStyle]}>
              {icon ? (
                <View
                  style={[
                    styles.icon,
                    focused ? null : styles.inactiveIcon,
                    iconContainerStyle,
                  ]}
                >
                  {icon}
                </View>
              ) : null}
              {typeof label === 'string' ? (
                <Text style={[styles.label, { color }, labelStyle]}>
                  {label}
                </Text>
              ) : (
                label
              )}
            </SafeAreaView>
          </TouchableItem>
        );
      })}
    </View>
  </SafeAreaView>
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
    // marginTop: Platform.OS === 'ios' ? 20 : 0,
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
