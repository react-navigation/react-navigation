import {
  CommonActions,
  DrawerActions,
  type DrawerNavigationState,
  type ParamListBase,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type { DrawerDescriptorMap, DrawerNavigationHelpers } from '../types';
import { DrawerItem } from './DrawerItem';

type Props = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

/**
 * Component that renders the navigation list in the drawer.
 */
export function DrawerItemList({ state, navigation, descriptors }: Props) {
  const { buildHref } = useLinkBuilder();

  const focusedRoute = state.routes[state.index];

  if (focusedRoute == null) {
    throw new Error(`Couldn't find a route at index ${state.index}.`);
  }

  const focusedOptions = descriptors[focusedRoute.key]?.options ?? {};

  const {
    drawerActiveTintColor,
    drawerInactiveTintColor,
    drawerActiveBackgroundColor,
    drawerInactiveBackgroundColor,
  } = focusedOptions;

  return state.routes.map((route, i) => {
    const descriptor = descriptors[route.key];

    if (descriptor == null) {
      throw new Error(`Couldn't find a descriptor for route '${route.key}'.`);
    }

    const focused = i === state.index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'drawerItemPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.dispatch({
          ...(focused
            ? DrawerActions.closeDrawer()
            : CommonActions.navigate(route.name, route.params)),
          target: state.key,
        });
      }
    };

    const {
      title,
      drawerLabel,
      drawerIcon,
      drawerLabelStyle,
      drawerItemStyle,
      drawerItemTestID,
      drawerAllowFontScaling,
    } = descriptor.options;

    return (
      <DrawerItem
        key={route.key}
        route={route}
        href={buildHref(route.name, route.params)}
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
        allowFontScaling={drawerAllowFontScaling}
        labelStyle={drawerLabelStyle}
        style={drawerItemStyle}
        onPress={onPress}
        testID={drawerItemTestID}
      />
    );
  }) as React.ReactNode as React.ReactElement;
}
