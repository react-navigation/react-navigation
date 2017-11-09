/**
 * @flow
 */

import React from 'react';
import { Button, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView, TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('Home')}
      title="Go to home tab"
    />
    <Button
      onPress={() => navigation.navigate('Settings')}
      title="Go to settings tab"
    />
    <Button onPress={() => navigation.goBack(null)} title="Go back" />
  </SafeAreaView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Tab" navigation={navigation} />
);

MyHomeScreen.navigationOptions = {
  tabBarTestIDProps: {
    testID: 'TEST_ID_HOME',
    accessibilityLabel: 'TEST_ID_HOME_ACLBL',
  },
  tabBarLabel: 'Home',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-home' : 'ios-home-outline'}
      size={26}
      style={{ color: tintColor }}
    />
  ),
};

const MyPeopleScreen = ({ navigation }) => (
  <MyNavScreen banner="People Tab" navigation={navigation} />
);

MyPeopleScreen.navigationOptions = {
  tabBarLabel: 'People',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-people' : 'ios-people-outline'}
      size={26}
      style={{ color: tintColor }}
    />
  ),
};

const MyChatScreen = ({ navigation }) => (
  <MyNavScreen banner="Chat Tab" navigation={navigation} />
);

MyChatScreen.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
      size={26}
      style={{ color: tintColor }}
    />
  ),
};

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Tab" navigation={navigation} />
);

MySettingsScreen.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ tintColor, focused }) => (
    <Ionicons
      name={focused ? 'ios-settings' : 'ios-settings-outline'}
      size={26}
      style={{ color: tintColor }}
    />
  ),
};

const SimpleTabs = TabNavigator(
  {
    Home: {
      screen: MyHomeScreen,
      path: '',
    },
    People: {
      screen: MyPeopleScreen,
      path: 'cart',
    },
    Chat: {
      screen: MyChatScreen,
      path: 'chat',
    },
    Settings: {
      screen: MySettingsScreen,
      path: 'settings',
    },
  },
  {
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff',
    },
  }
);

export default SimpleTabs;
