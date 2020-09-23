import * as React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SimpleTabs from './SimpleTabs';
import StacksOverTabs from './StacksOverTabs';

const TabsInDrawer = createDrawerNavigator({
  SimpleTabs: {
    navigationOptions: {
      drawerIcon: ({ tintColor }: { tintColor: string }) => (
        <MaterialIcons name="filter-1" size={24} style={{ color: tintColor }} />
      ),
      drawerLabel: 'Simple tabs',
    },
    screen: SimpleTabs,
  },
  StacksOverTabs: {
    navigationOptions: {
      drawerIcon: ({ tintColor }: { tintColor: string }) => (
        <MaterialIcons name="filter-2" size={24} style={{ color: tintColor }} />
      ),
      drawerLabel: 'Stacks Over Tabs',
    },
    screen: StacksOverTabs,
  },
});

export default TabsInDrawer;
