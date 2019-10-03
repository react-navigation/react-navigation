import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import TouchableItem from './TouchableItem';
import { DrawerNavigationItemsProps } from '../types';

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = ({
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
  activeLabelStyle,
  inactiveLabelStyle,
  iconContainerStyle,
  drawerPosition,
}: DrawerNavigationItemsProps) => {
  const insets = useSafeArea();

  return (
    <View style={[styles.container, itemsContainerStyle]}>
      {items.map((route, index: number) => {
        const focused = activeItemKey === route.key;
        const color = focused ? activeTintColor : inactiveTintColor;
        const backgroundColor = focused
          ? activeBackgroundColor
          : inactiveBackgroundColor;
        const scene = { route, index, focused, tintColor: color };
        const icon = renderIcon(scene);
        const label = getLabel(scene);
        const accessibilityLabel =
          typeof label === 'string' ? label : undefined;
        const extraLabelStyle = focused ? activeLabelStyle : inactiveLabelStyle;

        return (
          <TouchableItem
            key={route.key}
            accessible
            accessibilityLabel={accessibilityLabel}
            onPress={() => {
              onItemPress({ route, focused });
            }}
            delayPressIn={0}
          >
            <View
              style={[
                {
                  backgroundColor,
                  marginLeft: drawerPosition === 'left' ? insets.left : 0,
                  marginRight: drawerPosition === 'right' ? insets.right : 0,
                },
                styles.item,
                itemStyle,
              ]}
            >
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
                <Text
                  style={[styles.label, { color }, labelStyle, extraLabelStyle]}
                >
                  {label}
                </Text>
              ) : (
                label
              )}
            </View>
          </TouchableItem>
        );
      })}
    </View>
  );
};

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItems.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent',
};

const styles = StyleSheet.create({
  container: {
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
