/**
 * @flow
 */

import React from 'react';
import {
  Button,
  ScrollView,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('Profile', { name: 'Jordan' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => navigation.navigate('NotifSettings')}
      title="Go to notification settings"
    />
    <Button
      onPress={() => navigation.navigate('Settings')}
      title="Go to settings"
    />
    <Button
      onPress={() => navigation.goBack(null)}
      title="Go back"
    />
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Home Screen"
    navigation={navigation}
  />
);

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}s Profile`}
    navigation={navigation}
  />
);
MyProfileScreen.navigationOptions = {
  title: ({ state }) => `${state.params.name}'s Profile!`,
};

const MyNotificationsSettingsScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Notification Settings"
    navigation={navigation}
  />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Settings"
    navigation={navigation}
  />
);

const MainTab = StackNavigator({
  Home: {
    screen: MyHomeScreen,
    path: '/',
    navigationOptions: {
      title: () => 'Welcome',
    },
  },
  Profile: {
    screen: MyProfileScreen,
    path: '/people/:name',
    navigationOptions: {
      title: ({ state }) => `${state.params.name}'s Profile!`,
    },
  },
});

const SettingsTab = StackNavigator({
  Settings: {
    screen: MySettingsScreen,
    path: '/',
    navigationOptions: {
      title: () => 'Settings',
    },
  },
  NotifSettings: {
    screen: MyNotificationsSettingsScreen,
    navigationOptions: {
      title: () => 'Notification Settings',
    },
  },
});

const StacksInTabs = TabNavigator({
  MainTab: {
    screen: MainTab,
    path: '/',
    navigationOptions: {
      tabBar: () => ({
        label: 'Home',
        icon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  },
  SettingsTab: {
    screen: SettingsTab,
    path: '/settings',
    navigationOptions: {
      tabBar: () => ({
        label: 'Settings',
        icon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-settings' : 'ios-settings-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      }),
    },
  },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
});

export default StacksInTabs;
