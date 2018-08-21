/**
 * @flow
 */

import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleTabs from './SimpleTabs';
import StacksOverTabs from './StacksOverTabs';

const TabsInDrawer = createDrawerNavigator({
  SimpleTabs: {
    screen: SimpleTabs,
    navigationOptions: {
      drawerLabel: 'Simple tabs',
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons name="filter-1" size={24} style={{ color: tintColor }} />
      ),
    },
  },
  StacksOverTabs: {
    screen: StacksOverTabs,
    navigationOptions: {
      drawerLabel: 'Stacks Over Tabs',
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons name="filter-2" size={24} style={{ color: tintColor }} />
      ),
    },
  },
});

export default TabsInDrawer;
