import * as React from 'react';
import { CommonActions } from '@react-navigation/core';
import {
  DrawerActions,
  DrawerNavigationState,
} from '@react-navigation/routers';
import DrawerItem from './DrawerItem';
import {
  DrawerNavigationHelpers,
  DrawerDescriptorMap,
  DrawerContentOptions,
} from '../types';

type Props = Omit<DrawerContentOptions, 'contentContainerStyle' | 'style'> & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

/**
 * Component that renders the navigation list in the drawer.
 */
export default function DrawerItemList({
  state,
  navigation,
  descriptors,
  activeTintColor = '#6200ee',
  inactiveTintColor = 'rgba(0, 0, 0, .68)',
  activeBackgroundColor = 'rgba(98, 0, 238, 0.12)',
  inactiveBackgroundColor = 'transparent',
  itemStyle,
  labelStyle,
  activeLabelStyle,
  inactiveLabelStyle,
}: Props) {
  return (state.routes.map((route, i) => {
    const focused = i === state.index;
    const color = focused ? activeTintColor : inactiveTintColor;
    const { title, drawerLabel, drawerIcon } = descriptors[route.key].options;

    return (
      <DrawerItem
        key={route.key}
        label={
          drawerLabel !== undefined
            ? drawerLabel
            : title !== undefined
            ? title
            : route.name
        }
        icon={drawerIcon}
        focused={focused}
        color={color}
        style={[
          {
            backgroundColor: focused
              ? activeBackgroundColor
              : inactiveBackgroundColor,
          },
          itemStyle,
        ]}
        labelStyle={[
          labelStyle,
          focused ? activeLabelStyle : inactiveLabelStyle,
        ]}
        onPress={() => {
          navigation.dispatch({
            ...(focused
              ? DrawerActions.closeDrawer()
              : CommonActions.navigate(route.name)),
            target: state.key,
          });
        }}
      />
    );
  }) as React.ReactNode) as React.ReactElement;
}
