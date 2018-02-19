/**
 * @flow
 */
import type { NavigationScreenProp } from 'react-navigation';

import * as React from 'react';
import { Button, ScrollView, StatusBar } from 'react-native';
import { StackNavigator, SafeAreaView } from 'react-navigation';

type NavScreenProps = {
  navigation: NavigationScreenProp<*>,
};

class HomeScreen extends React.Component<NavScreenProps> {
  static navigationOptions = {
    title: 'Welcome',
  };

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button
          onPress={() => navigation.push('Other')}
          title="Push another screen"
        />
        <Button onPress={() => navigation.pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class OtherScreen extends React.Component<NavScreenProps> {
  static navigationOptions = {
    title: 'Your title here',
  };

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button
          onPress={() => navigation.push('Other')}
          title="Push another screen"
        />
        <Button onPress={() => navigation.pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

const StackWithHeaderPreset = StackNavigator(
  {
    Home: HomeScreen,
    Other: OtherScreen,
  },
  {
    headerTransitionPreset: 'uikit',
  }
);

export default StackWithHeaderPreset;
