import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from '@react-navigation/native';

class ScreenOne extends React.Component {
  componentDidMount() {
    this._timer = setTimeout(() => {
      this.props.navigation.navigate('Screen2');
      clearTimeout(this._timer);
    }, 0);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>Here is Screen One!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('Screen2');
          }}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>Press me!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ScreenTwo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>Here is Screen Two!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('Screen3');
          }}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>Press me!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ScreenThree extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>Here is Screen Three!</Text>
      </View>
    );
  }
}

export const Stack = createStackNavigator(
  {
    Screen1: { screen: ScreenOne },
    Screen2: { screen: ScreenTwo },
    Screen3: { screen: ScreenThree },
  },
  {
    initialRouteName: 'Screen1',
    defaultNavigationOptions: {
      header: null,
    },
  }
);

const PrimaryStack = createAppContainer(Stack);
export default PrimaryStack;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 200,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
