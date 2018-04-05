/**
 * @flow
 */

import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createNavigator,
  createNavigationContainer,
  SafeAreaView,
  TabRouter,
} from 'react-navigation';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SafeAreaView forceInset={{ horizontal: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => {
          navigation.goBack(null);
        }}
        title="Go back"
      />
    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Screen" navigation={navigation} />
);

const MyNotificationsScreen = ({ navigation }) => (
  <MyNavScreen banner="Notifications Screen" navigation={navigation} />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation} />
);

const CustomTabBar = ({ navigation }) => {
  const { routes } = navigation.state;
  return (
    <SafeAreaView style={styles.tabContainer}>
      {routes.map(route => (
        <TouchableOpacity
          onPress={() => navigation.navigate(route.routeName)}
          style={styles.tab}
          key={route.routeName}
        >
          <Text>{route.routeName}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const CustomTabView = ({ descriptors, navigation }) => {
  const { routes, index } = navigation.state;
  const descriptor = descriptors[routes[index].key];
  const ActiveScreen = descriptor.getComponent();
  return (
    <SafeAreaView forceInset={{ top: 'always' }}>
      <CustomTabBar navigation={navigation} />
      <ActiveScreen navigation={descriptor.navigation} />
    </SafeAreaView>
  );
};

const CustomTabRouter = TabRouter(
  {
    Home: {
      screen: MyHomeScreen,
      path: '',
    },
    Notifications: {
      screen: MyNotificationsScreen,
      path: 'notifications',
    },
    Settings: {
      screen: MySettingsScreen,
      path: 'settings',
    },
  },
  {
    // Change this to start on a different tab
    initialRouteName: 'Home',
  }
);

const CustomTabs = createNavigationContainer(
  createNavigator(CustomTabView, CustomTabRouter, {})
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
});

export default CustomTabs;
