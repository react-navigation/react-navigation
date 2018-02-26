import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import renderer from 'react-test-renderer';

import StackNavigator from '../StackNavigator';

const styles = StyleSheet.create({
  header: {
    opacity: 0.5,
  },
});

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Welcome ${
      navigation.state.params ? navigation.state.params.user : 'anonymous'
    }`,
    gesturesEnabled: true,
    headerStyle: [{ backgroundColor: 'red' }, styles.header],
  });

  render() {
    return null;
  }
}

const routeConfig = {
  Home: {
    screen: HomeScreen,
  },
};

describe('StackNavigator', () => {
  it('renders successfully', () => {
    const MyStackNavigator = StackNavigator(routeConfig);
    const rendered = renderer.create(<MyStackNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('applies correct values when headerRight is present', () => {
    const MyStackNavigator = StackNavigator({
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          headerRight: <View />,
        },
      },
    });
    const rendered = renderer.create(<MyStackNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
