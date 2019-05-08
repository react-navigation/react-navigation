import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';

class SignInScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this.signInAsync} />
        <Button
          title="Go back to other examples"
          onPress={() => this.props.navigation.goBack(null)}
        />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('Home');
  };
}

class HomeScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this.showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this.signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  signOutAsync = async () => {
    Platform.OS === 'ios' ? await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove) : await AsyncStorage.clear()
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="I'm done, sign me out" onPress={this.signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  signOutAsync = async () => {
    Platform.OS === 'ios' ? await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove) : await AsyncStorage.clear()
    this.props.navigation.navigate('Auth');
  };
}

class LoadingScreen extends React.Component<any, any> {
  componentDidMount() {
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const initialRouteName = userToken ? 'App' : 'Auth';
    this.props.navigation.navigate(initialRouteName);
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack,
  Loading: LoadingScreen,
});
