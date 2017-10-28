import React, { Component } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

import DrawerNavigator from '../DrawerNavigator';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Welcome ${navigation.state.params
      ? navigation.state.params.user
      : 'anonymous'}`,
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

describe('DrawerNavigator', () => {
  it('renders successfully', () => {
    const MyDrawerNavigator = DrawerNavigator(routeConfig);
    const rendered = renderer.create(<MyDrawerNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
