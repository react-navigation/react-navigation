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
import type { DrawerScene } from './DrawerView.js';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  items?: Array<NavigationRoute>,
  itemComponent: ReactClass<*>,
  getScreenOptions: (routeKey: string) => { drawerOnPress?: () => void },
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Element<*> | string),
  renderIcon: (scene: DrawerScene) => ?React.Element<*>,
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
    itemComponent: ItemComponent,
    getScreenOptions,
    activeTintColor,
    inactiveTintColor,
    getLabel,
    renderIcon,
    style,
    ...drawerItemProps
  }: Props,
) => (
  <View style={[styles.container, style]}>
    {(items || state.routes).map((route: NavigationRoute, index: number) => {
      const focused = state.routes[state.index].key === route.key;
      const tintColor = focused ? activeTintColor : inactiveTintColor;
      const scene = { route, focused, index, tintColor };
      const icon = renderIcon(scene);
      const label = getLabel(scene);
      const { drawerOnPress } = getScreenOptions(route.key);
      const onPress = drawerOnPress === undefined
        ? () => {
            navigate('DrawerClose');
            navigate(route.routeName);
          }
        : drawerOnPress;

      return (
        <ItemComponent
          {...drawerItemProps}
          activeTintColor={activeTintColor}
          inactiveTintColor={inactiveTintColor}
          key={route.key}
          index={index}
          focused={focused}
          icon={icon}
          label={label}
          onPress={onPress}
        />
      );
    })}
  </View>
);

DrawerNavigatorItems.defaultProps = {
  ...DrawerNavigatorItem.defaultProps,
  itemComponent: DrawerNavigatorItem,
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
});

export default DrawerNavigatorItems;
