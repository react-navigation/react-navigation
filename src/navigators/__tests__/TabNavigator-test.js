import React, { Component } from 'react';
import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import flushPromises from '../../utils/flushPromises';

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
  it('renders successfully', async () => {
    const MyTabNavigator = createTabNavigator(routeConfig);
    const testRenderer = TestRenderer.create(<MyTabNavigator />);
    await flushPromises();
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
