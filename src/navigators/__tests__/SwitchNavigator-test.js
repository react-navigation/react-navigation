import React, { Component } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

import SwitchNavigator from '../createSwitchNavigator';

const A = () => <View />;
const B = () => <View />;
const routeConfig = { A, B };

describe('SwitchNavigator', () => {
  it('renders successfully', () => {
    const MySwitchNavigator = SwitchNavigator(routeConfig);
    const rendered = renderer.create(<MySwitchNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
