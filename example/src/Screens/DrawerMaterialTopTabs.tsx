import {
  createDrawerNavigator,
  createDrawerScreen,
} from '@react-navigation/drawer';
import { Text } from '@react-navigation/elements';
import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
} from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';

import { drawerAwareAdapter } from '../Shared/DrawerAwarePagerAdapter';

const Placeholder = ({ label }: { label: string }) => (
  <View style={styles.container}>
    <Text>{label}</Text>
  </View>
);

const FirstTabScreen = () => <Placeholder label="First tab" />;
const SecondTabScreen = () => <Placeholder label="Second tab" />;
const RegularScreen = () => <Placeholder label="Regular screen" />;

const TopTabsNavigator = createMaterialTopTabNavigator({
  adapter: drawerAwareAdapter,
  screens: {
    First: createMaterialTopTabScreen({
      screen: FirstTabScreen,
      options: { title: 'First' },
    }),
    Second: createMaterialTopTabScreen({
      screen: SecondTabScreen,
      options: { title: 'Second' },
    }),
  },
});

const DrawerMaterialTopTabsNavigator = createDrawerNavigator({
  screenOptions: {
    drawerType: 'front',
    swipeEdgeWidth: 100,
  },
  screens: {
    TopTabs: createDrawerScreen({
      screen: TopTabsNavigator,
      options: { title: 'Top Tabs' },
    }),
    Regular: createDrawerScreen({
      screen: RegularScreen,
      options: { title: 'Regular' },
    }),
  },
});

export const DrawerMaterialTopTabs = {
  screen: DrawerMaterialTopTabsNavigator,
  title: 'Drawer - Material Top Tabs',
  options: {
    headerShown: false,
    // The stack's own edge swipe-back gesture would compete with the drawer
    gestureEnabled: false,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
