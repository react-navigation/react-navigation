/* @flow */

import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

import DrawerNavigatorItem from './DrawerNavigatorItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  NavigationRoute,
  Style,
} from '../../TypeDefinition';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  items?: Array<NavigationRoute>,
  style?: Style,
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = (
  {
    navigation,
    items,
    style,
    drawerItemComponent: DrawerItemComponent,
    ...drawerItemProps
  }: Props,
) => (
  <View style={[styles.container, style]}>
    {(items || navigation.state.routes)
      .map((route: NavigationRoute) => (
        <DrawerItemComponent
          {...drawerItemProps}
          key={route.key}
          navigation={navigation}
          route={route}
        />
      ))}
  </View>
);

DrawerNavigatorItems.defaultProps = {
  drawerItemComponent: DrawerNavigatorItem,
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
});

export default DrawerNavigatorItems;
