import React, { Component } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

import createDrawerNavigator from '../createDrawerNavigator';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Welcome ${
      navigation.state.params ? navigation.state.params.user : 'anonymous'
    }`,
    gesturesEnabled: true,
  });

  render() {
    return <View style={{ flex: 1 }} />;
  }
}

describe('createDrawerNavigator', () => {
  it('renders successfully', () => {
    const MyDrawerNavigator = createDrawerNavigator({ Home: HomeScreen });
    const rendered = renderer.create(<MyDrawerNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
