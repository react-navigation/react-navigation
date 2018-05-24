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

    // the state only actually gets set asynchronously on componentDidMount
    // thus on the first render the component returns null (or the result of renderLoadingExperimental)
    expect(testRenderer.toJSON()).toEqual(null);
    // wait for the state to be set
    await flushPromises();

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
