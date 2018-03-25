import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';

const Example = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{props.text || 'Example!'}</Text>
      {props.children}
    </View>
  );
};
class QuizScreen extends React.Component {
  render() {
    return (
      <Example text="Quiz">
        <Button
          title="Toggle drawer"
          onPress={() => this.props.navigation.toggleDrawer()}
        />
      </Example>
    );
  }
}

class FriendListScreen extends React.Component {
  render() {
    return <Example text="Friends list" />;
  }
}

class SignInScreen extends React.Component {
  render() {
    return (
      <Example text="Sign in">
        <Button
          title="OK GO"
          onPress={() => this.props.navigation.navigate('App')}
        />
      </Example>
    );
  }
}

class ForgotPasswordScreen extends React.Component {
  render() {
    return <Example text="Forgot password" />;
  }
}

const DefaultFriendRoutes = {
  PersonalityQuiz: QuizScreen,
  FriendList: FriendListScreen,
};
let InitialFriendsNavigator = createDrawerNavigator(DefaultFriendRoutes);

class FriendScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {this.props.navigation.state.routeName}
        </Text>
        <Button
          title="Toggle drawer"
          onPress={() => this.props.navigation.toggleDrawer()}
        />
      </View>
    );
  }
}

class FriendsNavigator extends React.Component {
  static router = InitialFriendsNavigator.router;

  async componentDidMount() {
    await new Promise(resolve => setTimeout(resolve, 100));
    this.props.navigation.dangerouslyUpdateRouter({
      ...DefaultFriendRoutes,
      Brent: FriendScreen,
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.props.navigation.dangerouslyUpdateRouter({
      ...DefaultFriendRoutes,
      Brent: FriendScreen,
      Eric: FriendScreen,
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <InitialFriendsNavigator navigation={this.props.navigation} />
      </View>
    );
  }
}

let AuthNavigator = createStackNavigator({
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
});

let AppNavigator = createSwitchNavigator({
  Auth: AuthNavigator,
  App: FriendsNavigator,
});

export default class PersonalityTestApp extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
