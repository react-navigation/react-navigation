/**
 * @flow
 */

import type {
  NavigationScreenProp,
  NavigationEventSubscription,
} from 'react-navigation';

import React from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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
    <StatusBar barStyle="default" />
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

type MyPeopleScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyPeopleScreen extends React.Component<MyPeopleScreenProps> {
  static navigationOptions = {
    tabBarLabel: 'People',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-people' : 'ios-people-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="People Tab" navigation={navigation} />;
  }
}

type MyChatScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyChatScreen extends React.Component<MyChatScreenProps> {
  static navigationOptions = {
    tabBarLabel: 'Chat',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Chat Tab" navigation={navigation} />;
  }
}

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
    },
    People: {
      screen: MyPeopleScreen,
    },
    Chat: {
      screen: MyChatScreen,
    },
    Settings: {
      screen: MySettingsScreen,
    },
  },
  {
    navigationOptions: {
      tabBarVisible: false,
    },
  }
);

type SimpleTabsContainerProps = {
  navigation: NavigationScreenProp<*>,
};

const TabBarButton = ({ name, navigation }) => {
  const currentName = navigation.state.routes[navigation.state.index].routeName;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(name);
      }}
    >
      <Text
        style={{ color: currentName === name ? 'blue' : 'black', fontSize: 32 }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

class CustomTabBar extends React.Component<*> {
  render() {
    return (
      <View
        style={{
          height: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderTopWidth: StyleSheet.hairlineWidth,
        }}
      >
        <TabBarButton navigation={this.props.navigation} name="Home" />
        <TabBarButton navigation={this.props.navigation} name="People" />
        <TabBarButton navigation={this.props.navigation} name="Chat" />
      </View>
    );
  }
}

class SimpleTabsContainer extends React.Component<SimpleTabsContainerProps> {
  static router = {
    ...SimpleTabs.router,
    getStateForAction(action, lastState) {
      // You can override the behavior navigation actions here, which are dispatched via navigation.dispatch, or via helpers like navigaiton.navigate.

      // In this case we simply use the default behavior:
      const newState = SimpleTabs.router.getStateForAction(action, lastState);

      console.log('Tab router action:', action, newState);
      return newState;
    },
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SimpleTabs navigation={this.props.navigation} />
        <CustomTabBar navigation={this.props.navigation} />
      </View>
    );
  }
}

export default SimpleTabsContainer;
