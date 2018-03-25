/**
 * @flow
 */
import type { NavigationScreenProp } from 'react-navigation';

import * as React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';

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
        <Button
          onPress={() => navigation.push('ScreenWithNoHeader')}
          title="Push screen with no header"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go Home" />
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
          onPress={() => navigation.push('ScreenWithLongTitle')}
          title="Push another screen"
        />
        <Button
          onPress={() => navigation.push('ScreenWithNoHeader')}
          title="Push screen with no header"
        />
        <Button onPress={() => navigation.pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class ScreenWithLongTitle extends React.Component<NavScreenProps> {
  static navigationOptions = {
    title: "Another title that's kind of long",
  };

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button onPress={() => navigation.pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class ScreenWithNoHeader extends React.Component<NavScreenProps> {
  static navigationOptions = {
    header: null,
    title: 'No Header',
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

const StackWithHeaderPreset = createStackNavigator(
  {
    Home: HomeScreen,
    Other: OtherScreen,
    ScreenWithNoHeader: ScreenWithNoHeader,
    ScreenWithLongTitle: ScreenWithLongTitle,
  },
  {
    headerTransitionPreset: 'uikit',
  }
);

export default StackWithHeaderPreset;
