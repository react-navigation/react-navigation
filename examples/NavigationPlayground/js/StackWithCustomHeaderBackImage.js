/**
 * @flow
 */

import type { NavigationScreenProp } from 'react-navigation';

import * as React from 'react';
import { Image, Button, StatusBar, StyleSheet } from 'react-native';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import SampleText from './SampleText';

type MyNavScreenProps = {
  navigation: NavigationScreenProp<*>,
  banner: React.Node,
};

class MyCustomHeaderBackImage extends React.Component<any, any> {
  render() {
    const source = require('./assets/back.png');
    return (
      <Image
        source={source}
        style={[styles.myCustomHeaderBackImage, this.props.style]}
      />
    );
  }
}

class MyNavScreen extends React.Component<MyNavScreenProps> {
  render() {
    const { navigation, banner } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => navigation.navigate('Photos', { name: 'Jane' })}
          title="Navigate to a photos screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

type MyHomeScreenProps = {
  navigation: NavigationScreenProp<*>,
};

class MyHomeScreen extends React.Component<MyHomeScreenProps> {
  static navigationOptions = {
    title: 'Welcome',
    headerBackTitle: null,
  };

  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Home Screen" navigation={navigation} />;
  }
}

type MyPhotosScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyPhotosScreen extends React.Component<MyPhotosScreenProps> {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}'s photos`,
    headerBackTitle: null,
  });

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{`${navigation.state.params.name}'s Photos`}</SampleText>
        <Button
          onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
          title="Navigate to a profile screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

type MyProfileScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyProfileScreen extends React.Component<MyProfileScreenProps> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerBackImage: (
      <MyCustomHeaderBackImage style={styles.myCustomHeaderBackImageAlt} />
    ),
  });

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{`${navigation.state.params.name}'s Profile`}</SampleText>
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

const StackWithCustomHeaderBackImage = createStackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    Photos: {
      path: 'photos/:name',
      screen: MyPhotosScreen,
    },
    Profile: {
      path: 'profile/:name',
      screen: MyProfileScreen,
    },
  },
  {
    navigationOptions: {
      headerBackImage: MyCustomHeaderBackImage,
    },
  }
);

export default StackWithCustomHeaderBackImage;

const styles = StyleSheet.create({
  myCustomHeaderBackImage: {
    height: 14.5,
    width: 24,
    marginLeft: 9,
    marginRight: 12,
    marginVertical: 12,
    resizeMode: 'contain',
  },
  myCustomHeaderBackImageAlt: {
    tintColor: '#f00',
  },
});
