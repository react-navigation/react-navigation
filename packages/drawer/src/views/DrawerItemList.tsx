import {
  CommonActions,
  DrawerActions,
  DrawerNavigationState,
  ParamListBase,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type { DrawerDescriptorMap, DrawerNavigationHelpers } from '../types';
import DrawerItem from './DrawerItem';

type Props = {
  state: DrawerNavigationState<ParamListBase>;
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
}: Props) {
  const buildLink = useLinkBuilder();

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;

  const {
    drawerActiveTintColor,
    drawerInactiveTintColor,
    drawerActiveBackgroundColor,
    drawerInactiveBackgroundColor,
  } = focusedOptions;

  return state.routes.map((route, i) => {
    const focused = i === state.index;
    const {
      title,
      drawerLabel,
      drawerIcon,
      drawerLabelStyle,
      drawerItemStyle,
    } = descriptors[route.key].options;

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
        activeTintColor={drawerActiveTintColor}
        inactiveTintColor={drawerInactiveTintColor}
        activeBackgroundColor={drawerActiveBackgroundColor}
        inactiveBackgroundColor={drawerInactiveBackgroundColor}
        labelStyle={drawerLabelStyle}
        style={drawerItemStyle}
        to={buildLink(route.name, route.params)}
        onPress={() => {
          navigation.dispatch({
            ...(focused
              ? DrawerActions.closeDrawer()
              : CommonActions.navigate({ name: route.name, merge: true })),
            target: state.key,
          });
        }}
      />
    );
  }) as React.ReactNode as React.ReactElement;
}
