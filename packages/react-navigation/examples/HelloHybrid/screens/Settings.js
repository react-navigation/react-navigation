
import React, { Component } from 'react';
import {
  SegmentedControlIOS,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  TabNavigator,
} from 'react-navigation';

const BasicSettingsScreen = () => (
  <Text style={styles.welcome}>
    Settings, Built in React!
  </Text>
);

const AdvancedSettingsScreen = () => (
  <Text style={styles.welcome}>
    Advanced settings - also React!
  </Text>
);

const TabView = ({children, navigation, tabs}) => (
  <View style={styles.container}>
    <SegmentedControlIOS
      style={styles.tabBar}
      values={tabs.map(tab => tab.myLabel)}
      selectedIndex={navigation.state.index}
      onChange={({nativeEvent}) => {
        navigation.dispatch({
          type: tabs[nativeEvent.selectedSegmentIndex].key,
        });
      }}
    />
    {children}
  </View>
);

const SettingsScreen = TabNavigator({
  Settings: {
    screen: BasicSettingsScreen,
    navigationOptions: {
      title: () => 'Settings',
    },
  },
  AdvancedSettings: {
    screen: AdvancedSettingsScreen,
    navigationOptions: {
      title: () => 'Advanced Settings',
    },
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  tabBar: {
    alignSelf: 'stretch',
    height: 40,
    margin: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  link: {
    textAlign: 'center',
    color: '#0A5FFF',
    fontSize: 16,
    marginVertical: 10,
  },
});

module.exports = SettingsScreen;
