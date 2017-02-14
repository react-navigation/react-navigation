/* @flow */

import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import TouchableItem from '../TouchableItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationAction,
  Style,
} from '../../TypeDefinition';
import type {
  DrawerScene,
} from './DrawerView.js';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
  activeTintColor?: string;
  activeBackgroundColor?: string;
  inactiveTintColor?: string;
  inactiveBackgroundColor?: string;
  getLabelText: (scene: DrawerScene) => string;
  renderIcon: (scene: DrawerScene) => ?React.Element<*>;
  style?: Style;
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = ({
  navigation,
  activeTintColor,
  activeBackgroundColor,
  inactiveTintColor,
  inactiveBackgroundColor,
  getLabelText,
  renderIcon,
  style,
}: Props) => (
  <View style={[styles.container, style]}>
    {navigation.state.routes.map((route: *, index: number) => {
      const focused = navigation.state.index === index;
      const color = focused ? activeTintColor : inactiveTintColor;
      const backgroundColor = focused ? activeBackgroundColor : inactiveBackgroundColor;
      const scene = { route, index, focused, tintColor: color };
      const icon = renderIcon(scene);
      const label = getLabelText(scene);
      return (
        <TouchableItem
          key={route.key}
          onPress={() => {
            navigation.navigate('DrawerClose');
            navigation.navigate(route.routeName);
          }}
          delayPressIn={0}
        >
          <View style={[styles.item, { backgroundColor }]}>
            {icon ? (
              <View style={[styles.icon, focused ? null : styles.inactiveIcon]}>
                {icon}
              </View>
            ) : null}
            <Text style={[styles.label, { color }]}>
              {label}
            </Text>
          </View>
        </TouchableItem>
      );
    })}
  </View>
);

DrawerNavigatorItems.propTypes = {
  navigation: PropTypes.object.isRequired,
  activeTintColor: PropTypes.string,
  activeBackgroundColor: PropTypes.string,
  inactiveTintColor: PropTypes.string,
  inactiveBackgroundColor: PropTypes.string,
  style: View.propTypes.style,
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
    marginVertical: 4,
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
