/**
 * @flow
 */

import React from 'react';
import { Button, ScrollView, StatusBar } from 'react-native';
import {
  NavigationActions,
  SafeAreaView,
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SafeAreaView forceInset={{ horizontal: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => navigation.navigate('Profile', { name: 'Jordan' })}
        title="Open profile screen"
      />
      <Button
        onPress={() => navigation.navigate('NotifSettings')}
        title="Open notifications screen"
      />
      <Button
        onPress={() => navigation.navigate('SettingsTab')}
        title="Go to settings tab"
      />
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </SafeAreaView>

    <StatusBar barStyle="default" />
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Screen" navigation={navigation} />
);

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}s Profile`}
    navigation={navigation}
  />
);

const MyDetailsScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}s Details`}
    navigation={navigation}
  />
);

const MyNotificationsSettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Notifications Screen" navigation={navigation} />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation} />
);

const MainTab = StackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
      path: '/',
      navigationOptions: {
        title: 'Home',
      },
    },
    Profile: {
      screen: MyProfileScreen,
      path: '/people/:name',
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.name}'s Profile!`,
      }),
    }
  },
  {
      initialRouteName: "Home",
  }
);

const SettingsTab = StackNavigator({
  Settings: {
    screen: MySettingsScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  NotifSettings: {
    screen: MyNotificationsSettingsScreen,
    navigationOptions: {
      title: 'Notifications',
    },
  },
});

const getResetActionForRoute = ({ routes, routeName }) => {
  if (routes) {
    return {
      index: 0,
      key: routeName,
      actions: [NavigationActions.navigate({ routeName: routes[0].routeName })],
    }
  }
  return null
}

/**
 * StacksInTabs [Tab]
 * -> MainTab [Stack]
 *    -> Home
 *    -> Profile
 * -> SettingsTab [Stack]
 *    -> Settings
 *    -> NotifSettings
 **/
const StacksInTabs = TabNavigator(
  {
    MainTab: {
      screen: MainTab,
      path: '/',
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    SettingsTab: {
      screen: SettingsTab,
      path: '/settings',
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-settings' : 'ios-settings-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    initialRouteName: "MainTab",
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        const actualRoute = navigation.state.routeName

        const resetAction = scene.focused
          ? getResetActionForRoute(scene.route)
          : getResetActionForRoute(previousScene)

        if (scene.focused) {
          // if focued, reset itself
          navigation.dispatch(NavigationActions.reset(resetAction))
        } else if (resetAction) {
          // if not focued, reset the previous one
          navigation.dispatch(NavigationActions.reset(resetAction))
          requestAnimationFrame(() => jumpToIndex(scene.index))
        } else {
          // just navigate
          jumpToIndex(scene.index)
        }
      },
    }),
  }
);

export default StacksInTabs;
