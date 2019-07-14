import * as React from 'react';
import { Button, TextInput, View } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from 'react-navigation-stack';

class Input extends React.Component {
  static navigationOptions = {
    title: 'Input screen',
  };

  render() {
    return (
      <TextInput
        placeholder="Type something"
        style={{
          backgroundColor: 'white',
          paddingVertical: 12,
          paddingHorizontal: 16,
          margin: 24,
        }}
      />
    );
  }
}

class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => this.props.navigation.push('Input')}
          title="Push screen with input"
        />
      </View>
    );
  }
}

const App = createStackNavigator(
  {
    Home: { screen: Home },
    Input: { screen: Input },
  },
  {
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      gesturesEnabled: true,
    },
  }
);

export default App;
