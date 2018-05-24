import React, { Component } from 'react';
import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';

import SwitchNavigator from '../createSwitchNavigator';
import flushPromises from '../../utils/flushPromises';

const A = () => <View />;
const B = () => <View />;
const routeConfig = { A, B };

describe('SwitchNavigator', () => {
  it('renders successfully', async () => {
    const MySwitchNavigator = SwitchNavigator(routeConfig);
    const testRenderer = TestRenderer.create(<MySwitchNavigator />);

    // the state only actually gets set asynchronously on componentDidMount
    // thus on the first render the component returns null (or the result of renderLoadingExperimental)
    expect(testRenderer.toJSON()).toEqual(null);
    // wait for the state to be set
    await flushPromises();

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
