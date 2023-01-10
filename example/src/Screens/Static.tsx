import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStaticNavigation,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Albums from '../Shared/Albums';
import Chat from '../Shared/Chat';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Albums,
    Chat,
  },
});

const RootStack = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: HomeTabs,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function StaticScreen() {
  return (
    <NavigationIndependentTree>
      <Navigation />
    </NavigationIndependentTree>
  );
}
