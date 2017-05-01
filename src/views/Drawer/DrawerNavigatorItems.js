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
  itemComponent: ReactClass<*>,
  style?: Style,
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = (
  {
    navigation,
    items,
    itemComponent: ItemComponent,
    style,
    ...drawerItemProps
  }: Props,
) => (
  <View style={[styles.container, style]}>
    {(items || navigation.state.routes)
      .map((route: NavigationRoute, index: number) => (
        <ItemComponent
          {...drawerItemProps}
          key={route.key}
          index={index}
          navigation={navigation}
          route={route}
        />
      ))}
  </View>
);

DrawerNavigatorItems.defaultProps = {
  itemComponent: DrawerNavigatorItem,
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
});

export default DrawerNavigatorItems;
