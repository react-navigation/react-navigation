import * as React from 'react';
import { Button, Image, StatusBar, StyleSheet } from 'react-native';
import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import SampleText from './SampleText';

interface MyNavScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
  banner: React.ReactNode;
}

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

interface MyHomeScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}

class MyHomeScreen extends React.Component<MyHomeScreenProps> {
  static navigationOptions = {
    headerBackTitle: null,
    title: 'Welcome',
  };

  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Home Screen" navigation={navigation} />;
  }
}

interface MyPhotosScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}
class MyPhotosScreen extends React.Component<MyPhotosScreenProps> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationState>;
  }) => ({
    headerBackTitle: null,
    title: `${navigation.state.params!.name}'s photos`,
  });

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{`${navigation.state.params!.name}'s Photos`}</SampleText>
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

interface MyProfileScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}
class MyProfileScreen extends React.Component<MyProfileScreenProps> {
  static navigationOptions = () => ({
    headerBackImage: (
      <MyCustomHeaderBackImage style={styles.myCustomHeaderBackImageAlt} />
    ),
    title: 'Profile',
  });

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{`${navigation.state.params!.name}'s Profile`}</SampleText>
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
    defaultNavigationOptions: {
      headerBackImage: MyCustomHeaderBackImage as any,
    },
  }
);

export default StackWithCustomHeaderBackImage;

const styles = StyleSheet.create({
  myCustomHeaderBackImage: {
    height: 14.5,
    marginLeft: 9,
    marginRight: 12,
    marginVertical: 12,
    resizeMode: 'contain',
    width: 24,
  },
  myCustomHeaderBackImageAlt: {
    tintColor: '#f00',
  },
});
