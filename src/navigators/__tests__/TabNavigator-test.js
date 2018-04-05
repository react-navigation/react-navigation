import React, { Component } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

const {
  createTabNavigator,
} = require('react-navigation-deprecated-tab-navigator');

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Welcome ${
      navigation.state.params ? navigation.state.params.user : 'anonymous'
    }`,
    gesturesEnabled: true,
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

describe('TabNavigator', () => {
  it('renders successfully', () => {
    const MyTabNavigator = createTabNavigator(routeConfig);
    const rendered = renderer.create(<MyTabNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
