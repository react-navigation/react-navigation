import * as React from 'react';
import { Button, StatusBar } from 'react-native';
import { SafeAreaView } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  render() {
    const { navigation } = this.props;
    const { push } = navigation;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button onPress={() => push('Other')} title="Push another screen" />
        <Button
          onPress={() => push('ScreenWithNoHeader')}
          title="Push screen with no header"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go Home" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Your title here',
  };

  render() {
    const { navigation } = this.props;
    const { push, pop } = navigation;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button
          onPress={() => push('ScreenWithLongTitle')}
          title="Push another screen"
        />
        <Button
          onPress={() => push('ScreenWithNoHeader')}
          title="Push screen with no header"
        />
        <Button onPress={() => pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class ScreenWithLongTitle extends React.Component {
  static navigationOptions = {
    title: "Another title that's kind of long",
  };

  render() {
    const { navigation } = this.props;
    const { pop } = navigation;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button onPress={() => pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class ScreenWithNoHeader extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'No Header',
  };

  render() {
    const { navigation } = this.props;
    const { push, pop } = navigation;

    return (
      <SafeAreaView style={{ paddingTop: 30 }}>
        <Button onPress={() => push('Other')} title="Push another screen" />
        <Button onPress={() => pop()} title="Pop" />
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
