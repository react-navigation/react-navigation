import * as React from 'react';
import { Button, Image, StyleSheet } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  Themed,
  SafeAreaView,
} from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import SampleText from './Shared/SampleText';

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
        <Themed.StatusBar />
      </SafeAreaView>
    );
  }
}

interface MyHomeScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}

class MyHomeScreen extends React.Component<MyHomeScreenProps> {
  static navigationOptions = {
    headerBackTitleVisible: false,
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
    headerBackTitleVisible: false,
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
        <Themed.StatusBar />
      </SafeAreaView>
    );
  }
}

interface MyProfileScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}

class MyProfileScreen extends React.Component<MyProfileScreenProps> {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{`${navigation.state.params!.name}'s Profile`}</SampleText>
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <Themed.StatusBar />
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
    defaultNavigationOptions: ({ theme }: NavigationStackScreenProps) => ({
      headerBackImage: () => (
        <MyCustomHeaderBackImage
          style={[
            styles.myCustomHeaderBackImageAlt,
            {
              tintColor: theme === 'light' ? '#000' : '#fff',
            },
          ]}
        />
      ),
    }),
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
  myCustomHeaderBackImageAlt: {},
});
