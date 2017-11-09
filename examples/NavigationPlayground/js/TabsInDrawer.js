/**
 * @flow
 */

import React from 'react';
import { Button, Platform, ScrollView } from 'react-native';
import { TabNavigator, DrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleTabs from './SimpleTabs';
import StacksOverTabs from './StacksOverTabs';

const TabsInDrawer = DrawerNavigator({
  SimpleTabs: {
    screen: SimpleTabs,
    navigationOptions: {
      drawer: () => ({
        label: 'Simple Tabs',
        icon: ({ tintColor }) => (
          <MaterialIcons
            name="filter-1"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  },
  StacksOverTabs: {
    screen: StacksOverTabs,
    navigationOptions: {
      drawer: () => ({
        label: 'Stacks Over Tabs',
        icon: ({ tintColor }) => (
          <MaterialIcons
            name="filter-2"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  },
});

export default TabsInDrawer;
