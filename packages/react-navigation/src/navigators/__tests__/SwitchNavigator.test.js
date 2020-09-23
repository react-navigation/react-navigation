import * as React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

import { createSwitchNavigator } from '@react-navigation/core';
import { createAppContainer } from '@react-navigation/native';

const A = () => <View />;
const B = () => <View />;
const routeConfig = { A, B };

describe('SwitchNavigator', () => {
  it('renders successfully', () => {
    const MySwitchNavigator = createSwitchNavigator(routeConfig);
    const App = createAppContainer(MySwitchNavigator);
    const rendered = renderer.create(<App />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
